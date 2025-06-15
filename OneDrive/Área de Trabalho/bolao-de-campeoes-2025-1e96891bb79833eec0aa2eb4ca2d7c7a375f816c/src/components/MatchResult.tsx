import { Match } from "@/hooks/useMatches";
import { Prediction } from "@/hooks/usePredictions";

interface MatchResultProps {
  match: Match;
  userPrediction?: Prediction;
}

const MatchResult = ({ match, userPrediction }: MatchResultProps) => {
  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="text-sm font-bold">
          Resultado: {match.home_score} x {match.away_score}
        </div>
      </div>
    </div>
  );
};

export default MatchResult;
