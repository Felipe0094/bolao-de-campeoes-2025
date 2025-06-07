import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, Calendar, Eye, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMatches } from "@/hooks/useMatches";
import { useRanking } from "@/hooks/useRanking";
import { useProfile } from "@/hooks/useProfile";
import MatchCard from "./MatchCard";
import RankingTable from "./RankingTable";
import TeamLogo from "./TeamLogo";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "./Navbar";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const { data: ranking, isLoading: rankingLoading } = useRanking();

  const upcomingMatches = matches?.filter(match => match.status === 'upcoming').slice(0, 3) || [];
  const currentUser = ranking?.find(player => player.isCurrentUser);
  const nextMatch = upcomingMatches[0];

  // Função para obter URL da imagem do Supabase Storage
  const getAssetUrl = (path: string) => {
    const { data } = supabase.storage.from('app-assets').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar showProfile showSignOut />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
          <p className="text-gray-600">Bem-vindo ao seu painel do bolão!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sua Performance</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{currentUser?.position || '-'}</div>
                  <p className="text-xs text-muted-foreground">Sua Posição</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{ranking?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Participantes</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span>{currentUser?.points || 0} pontos</span>
                  <span>{currentUser?.exactPredictions || 0} palpites exatos</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Jogo</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {nextMatch ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <TeamLogo 
                        logoUrl={nextMatch.home_team.logo_url} 
                        teamName={nextMatch.home_team.name}
                        size="sm"
                      />
                      <span className="text-xs text-center font-medium">{nextMatch.home_team.name}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-400">VS</span>
                    <div className="flex flex-col items-center gap-1">
                      <TeamLogo 
                        logoUrl={nextMatch.away_team.logo_url} 
                        teamName={nextMatch.away_team.name}
                        size="sm"
                      />
                      <span className="text-xs text-center font-medium">{nextMatch.away_team.name}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {nextMatch.match_date} às {nextMatch.match_time}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Nenhum jogo agendado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ranking</h2>
          <RankingTable players={ranking || []} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Jogos</h2>
            <Link to="/matches">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Ver Todos
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
