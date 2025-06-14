
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TeamMapping {
  [key: string]: string;
}

// Mapeamento dos nomes dos times da API para os IDs no banco
const TEAM_MAPPINGS: TeamMapping = {
  'Al Ahly': 'Al Ahly',
  'Inter Miami': 'Inter Miami CF',
  'Palmeiras': 'Palmeiras',
  'FC Porto': 'FC Porto',
  'Paris Saint Germain': 'Paris SG',
  'Atletico Madrid': 'Atlético Madrid',
  'Botafogo': 'Botafogo',
  'Seattle Sounders': 'Seattle Sounders FC',
  'Bayern Munich': 'Bayern Munich',
  'Auckland City': 'Auckland City FC',
  'Boca Juniors': 'Boca Juniors',
  'Benfica': 'Benfica',
  'Chelsea': 'Chelsea',
  'Leon': 'Club León',
  'Flamengo': 'Flamengo',
  'Esperance Tunis': 'Espérance de Tunis',
  'River Plate': 'River Plate',
  'Urawa Red Diamonds': 'Urawa Red Diamonds',
  'Monterrey': 'Monterrey',
  'Inter Milan': 'Inter Milan',
  'Fluminense': 'Fluminense',
  'Borussia Dortmund': 'Borussia Dortmund',
  'Ulsan Hyundai': 'Ulsan Hyundai',
  'Mamelodi Sundowns': 'Mamelodi Sundowns',
  'Manchester City': 'Manchester City',
  'Wydad Casablanca': 'Wydad AC',
  'Al Ain': 'Al Ain',
  'Juventus': 'Juventus',
  'Real Madrid': 'Real Madrid',
  'Al Hilal': 'Al Hilal',
  'Pachuca': 'CF Pachuca',
  'RB Salzburg': 'FC Salzburg'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const apiKey = Deno.env.get('API_SPORTS_KEY');
    if (!apiKey) {
      throw new Error('API_SPORTS_KEY not configured');
    }

    console.log('Fetching FIFA Club World Cup fixtures...');

    // Buscar fixtures da Copa do Mundo de Clubes da FIFA
    // Liga ID 541 é o FIFA Club World Cup na API-Sports
    const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?league=541&season=2025', {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`API Sports error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Found ${data.response?.length || 0} fixtures from API`);

    const updatedMatches = [];
    const errors = [];

    for (const fixture of data.response || []) {
      try {
        const homeTeamName = TEAM_MAPPINGS[fixture.teams.home.name] || fixture.teams.home.name;
        const awayTeamName = TEAM_MAPPINGS[fixture.teams.away.name] || fixture.teams.away.name;

        // Buscar times no banco de dados
        const { data: homeTeam } = await supabaseClient
          .from('teams')
          .select('id')
          .eq('name', homeTeamName)
          .single();

        const { data: awayTeam } = await supabaseClient
          .from('teams')
          .select('id')
          .eq('name', awayTeamName)
          .single();

        if (!homeTeam || !awayTeam) {
          console.log(`Teams not found: ${homeTeamName} vs ${awayTeamName}`);
          continue;
        }

        // Verificar se o jogo existe no banco
        const { data: existingMatch } = await supabaseClient
          .from('matches')
          .select('id, status, home_score, away_score')
          .eq('home_team_id', homeTeam.id)
          .eq('away_team_id', awayTeam.id)
          .single();

        if (!existingMatch) {
          console.log(`Match not found in database: ${homeTeamName} vs ${awayTeamName}`);
          continue;
        }

        // Verificar se o jogo foi finalizado na API
        if (fixture.fixture.status.short === 'FT' && existingMatch.status !== 'finished') {
          const homeScore = fixture.goals.home;
          const awayScore = fixture.goals.away;

          // Atualizar resultado no banco
          const { error: updateError } = await supabaseClient
            .from('matches')
            .update({
              status: 'finished',
              home_score: homeScore,
              away_score: awayScore,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingMatch.id);

          if (updateError) {
            errors.push(`Error updating match ${homeTeamName} vs ${awayTeamName}: ${updateError.message}`);
          } else {
            updatedMatches.push({
              match: `${homeTeamName} ${homeScore} x ${awayScore} ${awayTeamName}`,
              previous_status: existingMatch.status
            });
            console.log(`Updated: ${homeTeamName} ${homeScore} x ${awayScore} ${awayTeamName}`);
          }
        } else if (fixture.fixture.status.short === 'LIVE' && existingMatch.status !== 'live') {
          // Atualizar status para "ao vivo"
          const { error: updateError } = await supabaseClient
            .from('matches')
            .update({
              status: 'live',
              updated_at: new Date().toISOString()
            })
            .eq('id', existingMatch.id);

          if (!updateError) {
            updatedMatches.push({
              match: `${homeTeamName} vs ${awayTeamName}`,
              previous_status: existingMatch.status,
              new_status: 'live'
            });
          }
        }

      } catch (matchError) {
        console.error('Error processing match:', matchError);
        errors.push(`Error processing match: ${matchError.message}`);
      }
    }

    const result = {
      success: true,
      updated_matches: updatedMatches,
      total_updated: updatedMatches.length,
      errors: errors,
      timestamp: new Date().toISOString()
    };

    console.log('Update summary:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error fetching match results:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
