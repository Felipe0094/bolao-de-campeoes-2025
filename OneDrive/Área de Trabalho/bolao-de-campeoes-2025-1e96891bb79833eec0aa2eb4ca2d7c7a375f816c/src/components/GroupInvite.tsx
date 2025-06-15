
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, Share2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GroupMember {
  id: string;
  name: string;
  joinedAt: string;
  isAdmin?: boolean;
}

interface GroupInviteProps {
  groupCode: string;
  members: GroupMember[];
  isAdmin: boolean;
}

const GroupInvite = ({ groupCode, members, isAdmin }: GroupInviteProps) => {
  const [inviteCode, setInviteCode] = useState("");
  const { toast } = useToast();

  const inviteLink = `${window.location.origin}/join/${groupCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copiado!",
      description: "O link de convite foi copiado para sua área de transferência.",
    });
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Bolão Mundial de Clubes 2025",
        text: "Participe do nosso bolão do Mundial de Clubes!",
        url: inviteLink,
      });
    } else {
      handleCopyLink();
    }
  };

  const handleJoinGroup = () => {
    if (inviteCode.trim()) {
      toast({
        title: "Solicitação enviada!",
        description: "Você será adicionado ao grupo em breve.",
      });
      setInviteCode("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Join Group Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-blue-600" />
            Participar de um Grupo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Cole o código do convite aqui"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <Button onClick={handleJoinGroup} disabled={!inviteCode.trim()}>
              Participar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Group Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-green-600" />
            Seu Grupo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Group Info */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-800">
                Grupo dos Amigos - Mundial 2025
              </h3>
              <Badge variant="secondary">{members.length} membros</Badge>
            </div>
            
            {isAdmin && (
              <div className="space-y-3">
                <div className="text-sm text-green-700">
                  <strong>Código do grupo:</strong> {groupCode}
                </div>
                
                <div className="text-sm text-green-700">
                  <strong>Link de convite:</strong>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="text-sm bg-white"
                  />
                  <Button size="sm" variant="outline" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleShareLink}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Members List */}
          <div>
            <h4 className="font-semibold mb-3">Membros do Grupo</h4>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">
                      {member.name}
                      {member.isAdmin && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Entrou em {member.joinedAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupInvite;
