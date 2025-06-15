import { Match } from "@/hooks/useMatches";
import { Prediction } from "@/hooks/usePredictions";

interface MatchResultProps {
  match: Match;
  userPrediction?: Prediction;
}

const MatchResult = ({ match, userPrediction }: MatchResultProps) => {
  const hasUserPrediction = userPrediction !== undefined;

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg">
      <div className="text-center">
        {hasUserPrediction && (
          <div className="space-y-2">
            <div className="text-sm">
              Seu palpite: {userPrediction.home_score} x {userPrediction.away_score}
            </div>
            <div className="text-sm font-medium text-red-600">
              Palpite incorreto
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchResult;
