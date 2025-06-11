import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Target, CheckCircle } from "lucide-react";

interface Player {
  id: string;
  name: string;
  points: number;
  exactPredictions: number;
  correctResults: number;
  position: number;
  isCurrentUser?: boolean;
  avatar_url?: string;
}

interface RankingTableProps {
  players: Player[];
}

const RankingTable = ({ players }: RankingTableProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Ranking
        </CardTitle>
        <div className="text-sm text-gray-500 space-y-1">
          <p className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-600" />
            <span>5 pontos: Placar exato</span>
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span>3 pontos: Vencedor + placar parcial</span>
          </p>
          <p className="flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-600" />
            <span>1 ponto: Resultado correto</span>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                player.isCurrentUser
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0 flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-sm">
                    {player.position}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={player.avatar_url} alt={player.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm">
                      {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold flex items-center gap-2 truncate">
                    <span className="truncate">{player.name}</span>
                    {player.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        Você
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 space-y-0.5 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span>{player.exactPredictions} placares exatos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <span>{player.correctResults} resultados corretos</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="text-xl font-bold text-blue-600">
                    {player.points}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingTable;
