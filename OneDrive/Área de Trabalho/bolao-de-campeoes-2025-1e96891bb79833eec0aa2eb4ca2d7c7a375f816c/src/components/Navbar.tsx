import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface NavbarProps {
  showBack?: boolean;
  showProfile?: boolean;
  showSignOut?: boolean;
}

const Navbar = ({ showBack, showProfile, showSignOut }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <img 
              src="/bolao-logo.png"
              alt="Bolão Futebol é pra Homem"
              className="h-14 w-14 object-contain flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent truncate">
                Bolão Futebol é pra Homem
              </span>
              {showProfile && user && (
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
                    <AvatarFallback className="text-xs">
                      {profile?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-600 truncate">
                    {profile?.name || user?.user_metadata?.name || user?.email}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {showBack && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0 sm:w-auto sm:px-3"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Voltar</span>
              </Button>
            )}
            
            {showProfile && (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
                    <AvatarFallback>
                      {profile?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">
                    Olá, {profile?.name || user?.user_metadata?.name || user?.email}
                  </span>
                </div>
                
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 sm:w-auto sm:px-3">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Perfil</span>
                  </Button>
                </Link>
              </>
            )}
            
            {showSignOut && (
              <Button variant="outline" size="sm" onClick={signOut} className="h-9 w-9 p-0 sm:w-auto sm:px-3">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Sair</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
