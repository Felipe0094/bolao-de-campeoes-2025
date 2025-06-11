
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Prediction {
  id: string;
  user_id: string;
  match_id: string;
  home_score: number;
  away_score: number;
  points: number | null;
  created_at: string;
  updated_at: string;
}

export const usePredictions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['predictions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching predictions for user:', user.id);

      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
      }

      console.log('Predictions fetched successfully:', data);
      return data as Prediction[];
    },
    enabled: !!user,
  });
};

export const useSubmitPrediction = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, homeScore, awayScore }: {
      matchId: string;
      homeScore: number;
      awayScore: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Submitting prediction:', { matchId, homeScore, awayScore, userId: user.id });

      const { data, error } = await supabase
        .from('predictions')
        .upsert(
          {
            user_id: user.id,
            match_id: matchId,
            home_score: homeScore,
            away_score: awayScore,
          },
          { onConflict: 'user_id,match_id' }
        )
        .select()
        .single();

      if (error) {
        console.error('Error submitting prediction:', error);
        throw error;
      }

      console.log('Prediction submitted successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      toast({
        title: "Palpite enviado!",
        description: "Seu palpite foi salvo com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erro ao enviar palpite",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
