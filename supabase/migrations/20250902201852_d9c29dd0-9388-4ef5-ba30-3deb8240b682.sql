-- Check if pg_cron extension is enabled and set up daily backup cron job

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests if not already enabled  
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any existing nightly-backup cron job to avoid duplicates
SELECT cron.unschedule('nightly-backup');

-- Create the nightly backup cron job (runs at 2 AM daily)
SELECT cron.schedule(
  'nightly-backup',
  '0 2 * * *', -- Every day at 2:00 AM
  $$
  SELECT net.http_post(
    url:='https://hlywucxwpzbqmzssmwpj.supabase.co/functions/v1/full-backup-to-bucket',
    headers:='{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '", "Content-Type": "application/json"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);

-- Insert service role key setting if it doesn't exist (for cron job authentication)
INSERT INTO public.app_settings (setting_key, setting_value, description)
VALUES (
  'service_role_key', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseXd1Y3h3cHpicW16c3Ntd3BqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkxNDA1MywiZXhwIjoyMDY0NDkwMDUzfQ.CPOHqK3ag9KlH26U-PLGZkT9oJzIgEo8uPNgkUiMy0k',
  'Service role key for automated tasks'
) ON CONFLICT (setting_key) DO NOTHING;

-- Create function to get service role key securely
CREATE OR REPLACE FUNCTION get_service_role_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  key_value TEXT;
BEGIN
  SELECT setting_value INTO key_value
  FROM public.app_settings
  WHERE setting_key = 'service_role_key';
  
  IF key_value IS NULL THEN
    RAISE EXCEPTION 'Service role key not found in app_settings';
  END IF;
  
  RETURN key_value;
END;
$$;