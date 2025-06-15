import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Match } from "@/hooks/useMatches";
import { useSubmitPrediction } from "@/hooks/usePredictions";
import TeamLogo from "./TeamLogo";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

interface MatchPredictionFormProps {
  match: Match;
  userPrediction?: {
    home_score: number;
    away_score: number;
  };
}

const MatchPredictionForm = ({ match, userPrediction }: MatchPredictionFormProps) => {
  const submitPrediction = useSubmitPrediction();
  const hasUserPrediction = userPrediction !== undefined;
  
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  // Carregar palpite salvo quando o componente monta ou quando userPrediction muda
  useEffect(() => {
    if (userPrediction) {
      setHomeScore(userPrediction.home_score.toString());
      setAwayScore(userPrediction.away_score.toString());
    }
  }, [userPrediction]);

  const handleSubmitPrediction = () => {
    if (homeScore !== "" && awayScore !== "") {
      submitPrediction.mutate({
        matchId: match.id,
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
      });
    }
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

      {/* Formulário de palpite */}
      <div className="flex items-end gap-6">
        <div className="flex-1 text-center">
          <div className="flex flex-col items-center gap-2 mb-3">
            <TeamLogo 
              logoUrl={match.home_team.logo_url} 
              teamName={match.home_team.name}
              size="lg"
            />
            <span className="font-semibold text-gray-800 text-sm">{match.home_team.name}</span>
          </div>
          <Input
            type="number"
            min="0"
            max="20"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            className="text-center text-xl font-bold border-2 border-blue-200 focus:border-blue-400 bg-white/80"
            placeholder="0"
          />
        </div>
        
        <div className="text-3xl font-bold text-gray-400 bg-white/50 rounded-full w-12 h-12 flex items-center justify-center mb-6">×</div>
        
        <div className="flex-1 text-center">
          <div className="flex flex-col items-center gap-2 mb-3">
            <TeamLogo 
              logoUrl={match.away_team.logo_url} 
              teamName={match.away_team.name}
              size="lg"
            />
            <span className="font-semibold text-gray-800 text-sm">{match.away_team.name}</span>
          </div>
          <Input
            type="number"
            min="0"
            max="20"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            className="text-center text-xl font-bold border-2 border-blue-200 focus:border-blue-400 bg-white/80"
            placeholder="0"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSubmitPrediction}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        disabled={homeScore === "" || awayScore === "" || submitPrediction.isPending}
      >
        {submitPrediction.isPending 
          ? "Enviando..." 
          : hasUserPrediction 
            ? "Atualizar Palpite" 
            : "Enviar Palpite"
        }
      </Button>
    </div>
  );
};

export default MatchPredictionForm;
