
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, Mail, Save } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import ImageCropper from "@/components/ImageCropper";

const Profile = () => {
  const { profile, isLoading, updateProfile, uploadAvatar, isUpdating } = useProfile();
  const [name, setName] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Update local state when profile loads
  useState(() => {
    if (profile) {
      setName(profile.name || "");
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar tamanho do arquivo (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }
      
      // Verificar tipo do arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida.');
        return;
      }
      
      setSelectedFile(file);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    console.log('Crop completed, uploading file:', croppedFile);
    uploadAvatar(croppedFile);
    setSelectedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
        <Navbar showBack />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div>Carregando perfil...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar showBack />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Meu Perfil</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais aqui.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
                  <AvatarFallback className="text-lg">
                    {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2" 
                      asChild
                      disabled={isUpdating}
                    >
                      <span>
                        <Camera className="h-4 w-4" />
                        {isUpdating ? "Processando..." : "Alterar Foto"}
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUpdating}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG ou GIF (máx. 5MB)
                    <br />
                    A imagem será cortada em formato circular
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    disabled={isUpdating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    O email não pode ser alterado
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isUpdating || !name.trim()}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isUpdating ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Cropper Modal */}
      <ImageCropper
        isOpen={showCropper}
        onClose={() => {
          setShowCropper(false);
          setSelectedFile(null);
        }}
        onCropComplete={handleCropComplete}
        imageFile={selectedFile}
      />
    </div>
  );
};

export default Profile;
