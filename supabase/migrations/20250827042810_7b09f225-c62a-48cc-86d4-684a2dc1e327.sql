-- Security Fix: Remove insecure email exposure function and enhance privileged admin security

-- Drop the insecure function that bypasses RLS
DROP FUNCTION IF EXISTS public.get_allowed_admin_emails();

-- Update the privileged_admins table to remove the plain email column entirely
-- This ensures no plain emails can be exposed even by accident
ALTER TABLE public.privileged_admins DROP COLUMN IF EXISTS email;

-- Create a more secure function that only returns email hashes for authentication
CREATE OR REPLACE FUNCTION public.get_allowed_admin_email_hashes_secure()
RETURNS text[]
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_role text;
BEGIN
  -- Only allow privileged admins to access this function
  IF NOT public.is_privileged_admin() THEN
    RAISE EXCEPTION 'Access denied: Only privileged admins can access email hashes';
  END IF;

  -- Return only email hashes (never plain emails)
  RETURN ARRAY(
    SELECT email_hash 
    FROM public.privileged_admins 
    WHERE email_hash IS NOT NULL
  );
END;
$$;

-- Add additional security constraint to ensure email_hash is always present
ALTER TABLE public.privileged_admins 
ADD CONSTRAINT email_hash_required 
CHECK (email_hash IS NOT NULL AND length(email_hash) >= 32);

-- Update the RLS policy to be even more restrictive
DROP POLICY IF EXISTS "Highly restricted admin email access" ON public.privileged_admins;

CREATE POLICY "Ultra secure privileged admin access"
ON public.privileged_admins
FOR ALL
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.is_privileged_admin() 
  AND (auth.jwt() ->> 'aud') = 'authenticated'
  AND NOT coalesce((current_setting('app.emergency_mode', true))::boolean, false)
  -- Additional check: only allow access during normal business operations
  AND extract(hour from now()) BETWEEN 6 AND 22
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.is_privileged_admin() 
  AND (auth.jwt() ->> 'aud') = 'authenticated'
  AND NOT coalesce((current_setting('app.emergency_mode', true))::boolean, false)
  AND extract(hour from now()) BETWEEN 6 AND 22
);

-- Create audit trigger for any access to privileged_admins table
CREATE OR REPLACE FUNCTION public.audit_privileged_admin_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log any access attempt to privileged admin data
  INSERT INTO public.admin_audit (
    action,
    table_name,
    admin_id,
    new_values
  ) VALUES (
    'PRIVILEGED_ADMIN_ACCESS_' || TG_OP,
    'privileged_admins',
    auth.uid(),
    jsonb_build_object(
      'timestamp', now(),
      'operation', TG_OP,
      'user_agent', current_setting('request.headers', true)::json->>'user-agent',
      'ip_address', current_setting('request.headers', true)::json->>'x-forwarded-for'
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create the audit trigger
DROP TRIGGER IF EXISTS audit_privileged_admin_access_trigger ON public.privileged_admins;
CREATE TRIGGER audit_privileged_admin_access_trigger
  AFTER SELECT OR INSERT OR UPDATE OR DELETE
  ON public.privileged_admins
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_privileged_admin_access();