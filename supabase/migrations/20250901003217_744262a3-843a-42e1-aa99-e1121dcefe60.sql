-- SECURITY FIX: Remove the vulnerable get_allowed_admin_emails function that exposes admin emails
-- This function bypasses RLS and allows anyone to retrieve admin email addresses

DROP FUNCTION IF EXISTS public.get_allowed_admin_emails();

-- Create a secure replacement that only returns email hashes for verification purposes
-- This function is restricted to privileged admins only
CREATE OR REPLACE FUNCTION public.get_allowed_admin_email_hashes_secure()
RETURNS text[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Only privileged admins can access this function
  SELECT CASE 
    WHEN public.is_privileged_admin() THEN 
      ARRAY(SELECT email_hash FROM public.privileged_admins WHERE email_hash IS NOT NULL)
    ELSE 
      ARRAY[]::text[]
  END;
$$;

-- Also ensure the privileged_admins table has the most restrictive RLS policy
-- Drop the existing permissive policy and create restrictive ones
DROP POLICY IF EXISTS "Highly restricted admin email access" ON public.privileged_admins;

-- Create separate restrictive policies for each operation
CREATE POLICY "Only privileged admins can view privileged_admins"
ON public.privileged_admins
FOR SELECT
TO authenticated
USING (public.is_privileged_admin());

CREATE POLICY "Only privileged admins can insert privileged_admins"
ON public.privileged_admins
FOR INSERT
TO authenticated
WITH CHECK (public.is_privileged_admin());

CREATE POLICY "Only privileged admins can update privileged_admins"
ON public.privileged_admins
FOR UPDATE
TO authenticated
USING (public.is_privileged_admin())
WITH CHECK (public.is_privileged_admin());

CREATE POLICY "Only privileged admins can delete privileged_admins"
ON public.privileged_admins
FOR DELETE
TO authenticated
USING (public.is_privileged_admin());

-- Add audit trigger for privileged admin changes if not exists
DROP TRIGGER IF EXISTS audit_privileged_admin_changes_trigger ON public.privileged_admins;
CREATE TRIGGER audit_privileged_admin_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.privileged_admins
FOR EACH ROW EXECUTE FUNCTION public.audit_privileged_admin_changes();

-- Additional security: Consider removing the plain text email column in future
-- For now, we'll keep it but ensure it's only accessible to privileged admins
COMMENT ON COLUMN public.privileged_admins.email IS 'SECURITY: Contains sensitive admin email addresses. Access restricted to privileged admins only.';