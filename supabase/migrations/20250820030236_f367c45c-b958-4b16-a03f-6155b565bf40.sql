-- Fix remaining security issues identified by the linter

-- 1. Fix function search path issues by adding SET search_path
CREATE OR REPLACE FUNCTION public.audit_admin_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log any access to privileged admin data
  INSERT INTO public.admin_audit (
    action,
    table_name,
    admin_id,
    new_values
  ) VALUES (
    TG_OP || '_PRIVILEGED_ADMIN_ACCESS',
    TG_TABLE_NAME,
    auth.uid(),
    jsonb_build_object(
      'accessed_at', now(),
      'user_agent', current_setting('request.headers', true)::json->>'user-agent'
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- 2. Fix validate_admin_context function search path
CREATE OR REPLACE FUNCTION public.validate_admin_context()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_count INTEGER;
  recent_activity TIMESTAMP;
BEGIN
  -- Additional validation checks
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check for suspicious session activity
  SELECT COUNT(*), MAX(updated_at) 
  INTO session_count, recent_activity
  FROM public.profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'viewer');
  
  -- Validate session is legitimate
  IF session_count = 0 OR recent_activity < (now() - interval '24 hours') THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- 3. Move pgcrypto extension to extensions schema (if it exists in public)
-- This is safe to run even if extension is already in the right place
DO $$
BEGIN
  -- Only move if pgcrypto exists in public schema
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
    -- Create extensions schema if it doesn't exist
    CREATE SCHEMA IF NOT EXISTS extensions;
    -- Move pgcrypto to extensions schema
    ALTER EXTENSION pgcrypto SET SCHEMA extensions;
  END IF;
END
$$;