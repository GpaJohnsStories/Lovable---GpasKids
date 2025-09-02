-- Enable required extensions for cron scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the nightly backup cron job (runs at 2 AM daily)
-- This will schedule daily backups automatically
SELECT cron.schedule(
  'nightly-backup-v2',
  '0 2 * * *', -- Every day at 2:00 AM UTC
  $$
  SELECT net.http_post(
    url:='https://hlywucxwpzbqmzssmwpj.supabase.co/functions/v1/full-backup-to-bucket',
    headers:='{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseXd1Y3h3cHpicW16c3Ntd3BqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkxNDA1MywiZXhwIjoyMDY0NDkwMDUzfQ.CPOHqK3ag9KlH26U-PLGZkT9oJzIgEo8uPNgkUiMy0k", "Content-Type": "application/json"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);

-- Verify the cron job was created by selecting from cron.job
-- This will show us the scheduled job details
CREATE OR REPLACE VIEW public.scheduled_backups AS
SELECT 
  jobid,
  schedule,
  command,
  nodename,
  nodeport,
  database,
  username,
  active,
  jobname
FROM cron.job 
WHERE jobname = 'nightly-backup-v2';