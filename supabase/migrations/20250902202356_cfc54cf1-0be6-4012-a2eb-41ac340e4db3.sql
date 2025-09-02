-- Fix security issues from the previous migration

-- 1. Fix the scheduled_backups view to be properly secure
DROP VIEW IF EXISTS public.scheduled_backups;

-- Create a secure function instead of a security definer view
CREATE OR REPLACE FUNCTION public.get_scheduled_backups()
RETURNS TABLE(
  jobid bigint,
  schedule text,
  command text,
  active boolean,
  jobname text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only admins can view scheduled backup information
  IF NOT public.is_admin_safe() THEN
    RAISE EXCEPTION 'Access denied: Only admins can view scheduled backups';
  END IF;
  
  RETURN QUERY
  SELECT 
    j.jobid,
    j.schedule,
    j.command,
    j.active,
    j.jobname
  FROM cron.job j
  WHERE j.jobname = 'nightly-backup-v2';
END;
$$;

-- 2. Create extensions in proper schema (not public)
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_cron to extensions schema if possible (this may not work on Supabase hosted)
-- Note: On Supabase, extensions are typically managed automatically and this might not be needed

-- 3. Add comments to document the backup schedule
COMMENT ON FUNCTION public.get_scheduled_backups() IS 'Returns information about scheduled backup cron jobs - admin access only';