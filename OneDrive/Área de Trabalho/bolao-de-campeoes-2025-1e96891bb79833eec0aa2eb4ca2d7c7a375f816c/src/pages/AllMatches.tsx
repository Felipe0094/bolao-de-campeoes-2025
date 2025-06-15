import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMatches } from "@/hooks/useMatches";
import MatchCard from "@/components/MatchCard";
import { ArrowLeft, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const AllMatches = () => {
  const { data: matches, isLoading } = useMatches();
  const [showAllMatches, setShowAllMatches] = useState(true);

  const filteredMatches = matches?.filter(match => 
    showAllMatches ? true : match.status === 'upcoming'
  ) || [];

  // Agrupar jogos por dia
  const matchesByDay = filteredMatches.reduce((acc, match) => {
    const date = match.match_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as Record<string, typeof filteredMatches>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar showBack />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Todos os Jogos</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => setShowAllMatches(!showAllMatches)}
          >
            <Filter className="h-4 w-4" />
            {showAllMatches ? "Mostrar Apenas Próximos" : "Mostrar Todos"}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Carregando jogos...</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(matchesByDay).map(([date, dayMatches]) => (
              <div key={date}>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  {new Date(date).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMatches;
