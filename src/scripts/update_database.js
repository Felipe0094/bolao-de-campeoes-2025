const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDatabase() {
  try {
    // Lê o arquivo SQL
    const sqlPath = path.join(__dirname, '../integrations/supabase/update_all.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Executa o SQL
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Erro ao executar SQL:', error);
      return;
    }

    console.log('Banco de dados atualizado com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
  }
}

updateDatabase(); 