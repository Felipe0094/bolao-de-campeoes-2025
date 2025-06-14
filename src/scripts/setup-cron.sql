
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Agendar busca de resultados a cada 2 horas
SELECT cron.schedule(
  'fetch-match-results-every-2-hours',
  '0 */2 * * *', -- A cada 2 horas
  $$
  SELECT
    net.http_post(
        url:='https://sqlxinffbahbfoydmksy.supabase.co/functions/v1/fetch-match-results',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxbHhpbmZmYmFoYmZveWRta3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTUyNTIsImV4cCI6MjA2NDg3MTI1Mn0.ZVVRsWW1T3WTPmHpEraICsQX8GZMxlEVn1yBXf7DPq0"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Verificar cron jobs ativos
SELECT * FROM cron.job;
