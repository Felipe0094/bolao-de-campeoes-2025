
import { Card, CardContent } from "@/components/ui/card";
import { Match } from "@/hooks/useMatches";
import { usePredictions } from "@/hooks/usePredictions";
import MatchResult from "./MatchResult";
import MatchPredictionForm from "./MatchPredictionForm";
import MatchPredictionDisplay from "./MatchPredictionDisplay";
import MatchCountdown from "./MatchCountdown";
import { canMakePrediction } from "@/utils/matchUtils";

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const { data: predictions } = usePredictions();
  
  const userPrediction = predictions?.find(p => p.match_id === match.id);
  const canPredict = match.status === "upcoming" && canMakePrediction(match.match_date, match.match_time);

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 shadow-lg">
      {/* Status indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        match.status === "upcoming" 
          ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
          : match.status === "live" 
            ? "bg-gradient-to-r from-red-500 to-orange-500"
            : "bg-gradient-to-r from-green-500 to-emerald-500"
      }`} />
      
      <CardContent className="pt-8 pb-6 px-6">
        {match.status === "upcoming" && (
          <div className="mb-6">
            <MatchCountdown matchDate={match.match_date} matchTime={match.match_time} />
          </div>
        )}

        {match.status === "finished" && (
          <MatchResult match={match} userPrediction={userPrediction} />
        )}

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
          {canPredict ? (
            <MatchPredictionForm match={match} userPrediction={userPrediction} />
          ) : (
            <MatchPredictionDisplay match={match} userPrediction={userPrediction} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
