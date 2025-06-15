import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Team {
  id: string;
  name: string;
  country: string;
  logo_url?: string;
}

export const useTeams = () => {
  const queryClient = useQueryClient();

  const updateTeamLogos = useMutation({
    mutationFn: async () => {
      const updates = [
        { name: 'Al Ahly', logo: 'al-ahly-svg-65689.png' },
        { name: 'Al Hilal', logo: 'al_hilal_defesa.png' },
        { name: 'Al Ain', logo: 'Al_Ain_FC_S6ZOvGV.png' },
        { name: 'Auckland City', logo: 'Auckland_City.png' },
        { name: 'Atlético de Madrid', logo: 'Atlético_de_Madrid.png', variations: ['Atlético', 'Atletico', 'Madrid'] },
        { name: 'Bayern', logo: 'bayern-de-munique.png' },
        { name: 'Benfica', logo: 'benfica.png' },
        { name: 'Boca Juniors', logo: 'boca-juniors-svg-13083.png' },
        { name: 'Borussia Dortmund', logo: 'borussia-dortmund.png' },
        { name: 'Botafogo', logo: 'botafogo-svg.png' },
        { name: 'Chelsea', logo: 'chelsea.png' },
        { name: 'Espérance', logo: 'Espérance.png' },
        { name: 'Flamengo', logo: 'Flamengo-2018.png' },
        { name: 'Fluminense', logo: 'fluminense.png' },
        { name: 'Inter de Milão', logo: 'Inter_de_Milão_2021.png' },
        { name: 'Inter Miami', logo: 'inter-miami-svg-62393.png' },
        { name: 'Juventus', logo: 'juventus-italia-svg.png' },
        { name: 'Los Angeles FC', logo: 'los-angeles-fc-svg-63033.png' },
        { name: 'Mamelodi Sundowns', logo: 'Mamelodi_Sundowns.png' },
        { name: 'Manchester City', logo: 'manchester-city.png' },
        { name: 'Monterrey', logo: 'Monterrey.png' },
        { name: 'Pachuca', logo: 'pachuca-logo.png' },
        { name: 'Palmeiras', logo: 'Palmeiras.png' },
        { name: 'Paris Saint-Germain', logo: 'paris-saint-germain.png' },
        { name: 'Porto', logo: 'porto.png' },
        { name: 'Real Madrid', logo: 'real-madrid.png' },
        { name: 'Red Bull', logo: 'RedBull.png' },
        { name: 'River Plate', logo: 'River_Plate_Escudo_novo.png' },
        { name: 'Seattle Sounders', logo: 'seatle-sounders-73844.png' },
        { name: 'Urawa Red Diamonds', logo: 'urawa-reds-svg-65917.png', variations: ['Urawa', 'Red Diamonds'] },
        { name: 'Ulsan', logo: 'ulsan.png', variations: ['Ulsan'] },
        { name: 'Salzburg', logo: 'salzburg.png', variations: ['Salzburg'] },
        { name: 'Wydad', logo: 'Wydad.png' }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('teams')
          .update({ logo_url: update.logo })
          .or(
            update.variations 
              ? update.variations.map(v => `name.ilike.%${v}%`).join(',')
              : `name.ilike.%${update.name}%`
          );

        if (error) {
          console.error(`Error updating ${update.name}:`, error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });

  const updateTeamName = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('teams')
        .update({ name: 'Los Angeles FC' })
        .ilike('name', '%León%');

      if (error) {
        console.error('Error updating team name:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });

  return {
    updateTeamLogos: updateTeamLogos.mutate,
    updateTeamName: updateTeamName.mutate
  };
}; 
