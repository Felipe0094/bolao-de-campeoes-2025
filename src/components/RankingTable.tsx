import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Target, CheckCircle } from "lucide-react";

interface Player {
  id: string;
  name: string;
  points: number;
  exactPredictions: number;
  correctResults: number;
  position: number;
  isCurrentUser?: boolean;
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
        <div className="space-y-4">
          {players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                player.isCurrentUser
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                  {player.position}
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {player.name}
                    {player.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">
                        Você
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-green-600" />
                      {player.exactPredictions} placares exatos
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      {player.correctResults} resultados
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {player.points}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingTable;
