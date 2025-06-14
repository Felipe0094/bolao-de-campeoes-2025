import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { Trophy, Users, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();

  // Se estiver carregando, mostra um loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o usuário estiver autenticado, redireciona para o dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bolão Mundial de Clubes da FIFA 2025
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Faça seus palpites e acompanhe o maior torneio de clubes do mundo!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Grande Premiação</h3>
              <p className="text-gray-600">
                70% do valor total para o campeão, 20% para o vice e 10% para o terceiro lugar
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">32 Times</h3>
              <p className="text-gray-600">
                Os melhores clubes do mundo competindo pelo título mundial
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <Info className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fácil de Participar</h3>
              <p className="text-gray-600">
                Crie sua conta, entre no grupo e comece a fazer seus palpites
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link to="/auth/signin">
              <Button size="lg" className="w-full md:w-auto">
                Entrar
              </Button>
            </Link>
            <div className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link to="/auth/signup" className="text-green-600 hover:underline">
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
