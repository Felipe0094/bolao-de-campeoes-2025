import { supabase } from '../integrations/supabase/client';
import fs from 'fs';
import path from 'path';

async function updateDatabase() {
  try {
    // Lê os arquivos SQL
    const groupsSqlPath = path.join(__dirname, '../integrations/supabase/update_groups.sql');
    const teamsSqlPath = path.join(__dirname, '../integrations/supabase/update_teams.sql');
    const matchesSqlPath = path.join(__dirname, '../integrations/supabase/update_matches.sql');

    const groupsSql = fs.readFileSync(groupsSqlPath, 'utf8');
    const teamsSql = fs.readFileSync(teamsSqlPath, 'utf8');
    const matchesSql = fs.readFileSync(matchesSqlPath, 'utf8');

    // Executa os scripts em sequência
    console.log('Atualizando grupos...');
    const { error: groupsError } = await supabase.rpc('exec_sql', { sql: groupsSql });
    if (groupsError) throw groupsError;

    console.log('Atualizando times...');
    const { error: teamsError } = await supabase.rpc('exec_sql', { sql: teamsSql });
    if (teamsError) throw teamsError;

    console.log('Atualizando jogos...');
    const { error: matchesError } = await supabase.rpc('exec_sql', { sql: matchesSql });
    if (matchesError) throw matchesError;

    console.log('Banco de dados atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar banco de dados:', error);
  }
}

// Executa a função
updateDatabase(); 