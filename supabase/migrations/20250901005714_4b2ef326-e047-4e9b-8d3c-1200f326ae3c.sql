-- Enable required extensions for cron scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily backup at 08:00 UTC
SELECT cron.schedule(
  'nightly-full-backup',
  '0 8 * * *', -- Daily at 08:00 UTC
  $$
  SELECT
    net.http_post(
        url:='https://hlywucxwpzbqmzssmwpj.supabase.co/functions/v1/full-backup-to-bucket',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseXd1Y3h3cHpicW16c3Ntd3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTQwNTMsImV4cCI6MjA2NDQ5MDA1M30.m72-z_MYxyijIqclV9hJplTNen02IdLLCOv7w3ZoHfY"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);