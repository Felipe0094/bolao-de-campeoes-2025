import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { Match } from "@/hooks/useMatches";
import TeamLogo from "./TeamLogo";

interface MatchHeaderProps {
  match: Match;
}

const MatchHeader = ({ match }: MatchHeaderProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-3">
      {/* Informações do jogo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(match.match_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{match.match_time}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Grupo {match.group.name}
          </Badge>
        </div>
        <Badge variant={
          match.status === "upcoming" ? "secondary" :
          match.status === "live" ? "destructive" :
          "default"
        }>
          {match.status === "upcoming" ? "Agendado" :
           match.status === "live" ? "Ao Vivo" :
           "Finalizado"}
        </Badge>
      </div>

      {/* Confronto */}
      <div className="flex items-center justify-center gap-4">
        <TeamLogo 
          logoUrl={match.home_team.logo_url} 
          teamName={match.home_team.name}
          size="md"
        />
        <span className="text-xl font-bold text-gray-400">VS</span>
        <TeamLogo 
          logoUrl={match.away_team.logo_url} 
          teamName={match.away_team.name}
          size="md"
        />
      </div>
    </div>
  );
};

export default MatchHeader;
