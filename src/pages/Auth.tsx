
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const Auth = () => {
  const { signIn, signUp, loading, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Define o modo baseado na rota atual
    setIsSignUp(location.pathname === "/auth/signup");
  }, [location.pathname]);

  // Se o usuário já estiver autenticado, redireciona para o dashboard
  useEffect(() => {
    if (user && !loading) {
      console.log('Auth page: User logged in, redirecting to dashboard');
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

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

  // Se o usuário estiver autenticado, não renderiza nada (será redirecionado pelo useEffect)
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authLoading) return; // Evitar múltiplos submits
    
    try {
      setAuthLoading(true);
      
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error("Nome é obrigatório");
        }
        await signUp(email, password, name);
        setShowAlert(true);
      } else {
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{isSignUp ? "Criar Conta" : "Entrar"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      required
                      disabled={authLoading}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    disabled={authLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                    disabled={authLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? "Carregando..." : isSignUp ? "Criar Conta" : "Entrar"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  {isSignUp ? (
                    <>
                      Já tem uma conta?{" "}
                      <Link
                        to="/auth/signin"
                        className="text-green-600 hover:underline"
                      >
                        Entrar
                      </Link>
                    </>
                  ) : (
                    <>
                      Não tem uma conta?{" "}
                      <Link
                        to="/auth/signup"
                        className="text-green-600 hover:underline"
                      >
                        Criar Conta
                      </Link>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-center">
              Agora você precisa confirmar seu email, seu filho da puta!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              Má vontade do caralho!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowAlert(false);
                navigate("/auth/signin");
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Entendi, porra!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Auth;
