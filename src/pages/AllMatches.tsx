import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMatches } from "@/hooks/useMatches";
import MatchCard from "@/components/MatchCard";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const AllMatches = () => {
  const { data: matches, isLoading } = useMatches();

  const upcomingMatches = matches?.filter(match => match.status === 'upcoming') || [];
  const pastMatches = matches?.filter(match => match.status === 'finished') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar showBack />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Todos os Jogos</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Próximos Jogos</h2>
              {isLoading ? (
                <div className="text-center py-4">Carregando jogos...</div>
              ) : upcomingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhum jogo próximo encontrado
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Jogos Anteriores</h2>
              {isLoading ? (
                <div className="text-center py-4">Carregando jogos...</div>
              ) : pastMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhum jogo anterior encontrado
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMatches;
