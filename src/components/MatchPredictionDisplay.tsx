
import { Match } from "@/hooks/useMatches";
import TeamLogo from "./TeamLogo";
import { canMakePrediction } from "@/utils/matchUtils";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface MatchPredictionDisplayProps {
  match: Match;
  userPrediction?: {
    home_score: number;
    away_score: number;
  };
}

const MatchPredictionDisplay = ({ match, userPrediction }: MatchPredictionDisplayProps) => {
  const hasUserPrediction = userPrediction !== undefined;
  const timeExpired = !canMakePrediction(match.match_date, match.match_time);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const weekday = weekdays[date.getDay()];
    return `${weekday}, ${date.toLocaleDateString('pt-BR')}`;
  };

  return (
    <div className="space-y-6">
      {/* Informações do jogo */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/70 px-3 py-1 rounded-full">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(match.match_date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/70 px-3 py-1 rounded-full">
          <Clock className="h-4 w-4" />
          <span>{match.match_time}</span>
        </div>
        <Badge variant="outline" className="text-xs bg-white/70">
          Grupo {match.group.name}
        </Badge>
      </div>

      <div className="text-center py-6">
        {hasUserPrediction ? (
          <div className="space-y-4">
            <div className="flex items-end justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <TeamLogo 
                  logoUrl={match.home_team.logo_url} 
                  teamName={match.home_team.name}
                  size="lg"
                />
                <span className="font-semibold text-gray-800 text-sm">{match.home_team.name}</span>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold text-2xl shadow-lg">
                {userPrediction?.home_score} × {userPrediction?.away_score}
              </div>
              <div className="flex flex-col items-center gap-2">
                <TeamLogo 
                  logoUrl={match.away_team.logo_url} 
                  teamName={match.away_team.name}
                  size="lg"
                />
                <span className="font-semibold text-gray-800 text-sm">{match.away_team.name}</span>
              </div>
            </div>
            <div className={`text-sm px-4 py-2 rounded-full inline-block ${
              timeExpired 
                ? "bg-red-100 text-red-700" 
                : "bg-green-100 text-green-700"
            }`}>
              {timeExpired ? "Seu palpite (tempo esgotado)" : "Seu palpite"}
            </div>
          </div>
        ) : (
          <div className={`py-8 px-6 rounded-xl ${
            timeExpired 
              ? "bg-red-50 text-red-600 border border-red-200" 
              : "bg-gray-50 text-gray-500 border border-gray-200"
          }`}>
            <div className="text-lg font-medium">
              {timeExpired ? "Tempo para palpites encerrado" : "Nenhum palpite feito"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchPredictionDisplay;
