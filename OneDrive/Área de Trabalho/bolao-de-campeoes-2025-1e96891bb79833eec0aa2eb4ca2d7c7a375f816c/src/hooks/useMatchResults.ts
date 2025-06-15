import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Match } from './useMatches';

export const useMatchResults = () => {
  return useQuery({
    queryKey: ['match-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          match_date,
          match_time,
          status,
          home_score,
          away_score,
          home_team:teams!matches_home_team_id_fkey (
            name,
            country,
            logo_url
          ),
          away_team:teams!matches_away_team_id_fkey (
            name,
            country,
            logo_url
          ),
          group:groups (
            name
          )
        `)
        .eq('status', 'finished')
        .order('match_date', { ascending: false })
        .order('match_time', { ascending: false });

      if (error) {
        console.error('Error fetching match results:', error);
        throw error;
      }

      return data as Match[];
    },
  });
}; 