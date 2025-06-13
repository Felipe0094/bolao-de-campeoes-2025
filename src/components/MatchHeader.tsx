import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { Match } from "@/hooks/useMatches";
import TeamLogo from "./TeamLogo";
import { formatDate } from "@/utils/dateUtils";

interface MatchHeaderProps {
  match: {
    match_date: string;
    match_time: string;
    home_team: {
      name: string;
      logo_url: string;
    };
    away_team: {
      name: string;
      logo_url: string;
    };
  };
}

const MatchHeader = ({ match }: MatchHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
      <div className="text-sm font-medium text-blue-600">
        {formatDate(match.match_date)}
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <img
            src={match.home_team.logo_url}
            alt={match.home_team.name}
            className="w-16 h-16 object-contain"
          />
          <span className="text-sm font-medium text-center">{match.home_team.name}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">VS</span>
          <span className="text-sm text-gray-500 mt-1">{match.match_time}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img
            src={match.away_team.logo_url}
            alt={match.away_team.name}
            className="w-16 h-16 object-contain"
          />
          <span className="text-sm font-medium text-center">{match.away_team.name}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchHeader;
