import { supabase } from '../integrations/supabase/client';

async function checkMatches() {
  const { data: matches, error } = await supabase
    .from('matches')
    .select(`
      id,
      match_date,
      match_time,
      status,
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
    .order('match_date', { ascending: true })
    .order('match_time', { ascending: true });

  if (error) {
    console.error('Error fetching matches:', error);
    return;
  }

  console.log('Matches in database:');
  matches.forEach(match => {
    console.log(`${match.match_date} | ${match.match_time} | ${match.home_team.name} vs ${match.away_team.name} | ${match.group.name}`);
  });
}

checkMatches(); 