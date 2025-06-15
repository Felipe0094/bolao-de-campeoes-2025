import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { calculatePoints } from '@/utils/matchUtils';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Match } from '@/types/match';

// Importa o canal compartilhado
import { matchesChannel } from './useMatches';

export function useMatchResults() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select(`
            *,
            home_team:home_team_id(name),
            away_team:away_team_id(name)
          `)
          .order('match_date', { ascending: true });

        if (error) throw error;

        setMatches(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    // Subscribe to changes
    const channel = supabase
      .channel('matches_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMatches(prev => [...prev, payload.new as Match]);
          } else if (payload.eventType === 'UPDATE') {
            setMatches(prev => 
              prev.map(match => 
                match.id === payload.new.id ? payload.new as Match : match
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setMatches(prev => 
              prev.filter(match => match.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Busca jogos finalizados sem pontos calculados
  const { data: matchesToProcess } = useQuery({
    queryKey: ['matches-to-process'],
    queryFn: async () => {
      const { data: matches, error } = await supabase
        .from('matches')
        .select(`
          id,
          home_score,
          away_score,
          predictions (
            id,
            user_id,
            home_score,
            away_score,
            points
          )
        `)
        .eq('status', 'finished')
        .not('home_score', 'is', null)
        .not('away_score', 'is', null);

      if (error) throw error;

      // Filtra apenas jogos que têm previsões sem pontos calculados
      return matches.filter(match => 
        match.predictions.some(pred => pred.points === null)
      );
    },
  });

  // Mutation para atualizar os pontos das previsões
  const updatePredictionPoints = useMutation({
    mutationFn: async (matchId: string) => {
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select(`
          id,
          home_score,
          away_score,
          predictions (
            id,
            user_id,
            home_score,
            away_score
          )
        `)
        .eq('id', matchId)
        .single();

      if (matchError) throw matchError;

      // Calcula pontos para cada previsão
      const updates = match.predictions.map(prediction => ({
        id: prediction.id,
        user_id: prediction.user_id,
        match_id: match.id,
        home_score: prediction.home_score,
        away_score: prediction.away_score,
        points: calculatePoints(
          { home_score: prediction.home_score, away_score: prediction.away_score },
          { home_score: match.home_score, away_score: match.away_score }
        )
      }));

      // Atualiza os pontos no banco
      const { error: updateError } = await supabase
        .from('predictions')
        .upsert(updates);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      toast({
        title: "Pontos atualizados!",
        description: "Os pontos foram calculados e atualizados com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating prediction points:', error);
      toast({
        title: "Erro ao atualizar pontos",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Processa automaticamente os jogos pendentes
  const processPendingMatches = async () => {
    if (!matchesToProcess?.length) return;

    for (const match of matchesToProcess) {
      await updatePredictionPoints.mutateAsync(match.id);
    }
  };

  // Inscreve-se para mudanças na tabela de jogos
  useEffect(() => {
    // Adiciona um novo listener para eventos de UPDATE
    matchesChannel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'matches'
      },
      async (payload) => {
        console.log('Match updated:', payload);
        
        // Se o jogo foi atualizado e tem placar
        if (payload.new.home_score !== null && 
            payload.new.away_score !== null) {
          await updatePredictionPoints.mutateAsync(payload.new.id);
        }
      }
    );

    return () => {
      // Não desinscreve o canal aqui, pois ele é compartilhado
    };
  }, []);

  return {
    matches,
    loading,
    error,
    matchesToProcess,
    updatePredictionPoints,
    processPendingMatches,
  };
} 