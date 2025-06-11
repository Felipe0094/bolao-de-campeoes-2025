import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface RankingPlayer {
  id: string;
  name: string;
  points: number;
  exactPredictions: number;
  correctResults: number;
  position: number;
  isCurrentUser?: boolean;
}

export const useRanking = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      console.log('Fetching ranking data...');

      // Busca todos os perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Busca todas as previsões com pontos
      const { data: predictions, error: predictionsError } = await supabase
        .from('predictions')
        .select(`
          user_id,
          points,
          home_score,
          away_score,
          match:matches (
            home_score,
            away_score
          )
        `)
        .not('points', 'is', null);

      if (predictionsError) {
        console.error('Error fetching predictions:', predictionsError);
        throw predictionsError;
      }

      // Calcula estatísticas para cada usuário
      const userStats = profiles.map(profile => {
        const userPredictions = predictions.filter(p => p.user_id === profile.id);
        
        const stats = userPredictions.reduce((acc, pred) => {
          // Soma os pontos
          acc.totalPoints += pred.points || 0;

          // Conta placares exatos (5 pontos)
          if (pred.points === 5) {
            acc.exactPredictions++;
          }

          // Conta resultados corretos (3 ou 1 ponto)
          if (pred.points === 3 || pred.points === 1) {
            acc.correctResults++;
          }

          return acc;
        }, {
          totalPoints: 0,
          exactPredictions: 0,
          correctResults: 0
        });

        return {
          id: profile.id,
          name: profile.name,
          ...stats
        };
      });

      // Ordena por pontos e cria ranking
      const ranking = userStats
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((player, index) => ({
          id: player.id,
          name: player.name,
          points: player.totalPoints,
          exactPredictions: player.exactPredictions,
          correctResults: player.correctResults,
          position: index + 1,
          isCurrentUser: player.id === user?.id,
        }));

      console.log('Processed ranking:', ranking);
      return ranking as RankingPlayer[];
    },
  });
};
