-- Strengthen RLS policies for privileged_admins table
-- Add multiple layers of protection beyond function checks

-- Drop existing policies
DROP POLICY IF EXISTS "Privileged admins can view privileged_admins table" ON public.privileged_admins;
DROP POLICY IF EXISTS "Privileged admins can insert into privileged_admins table" ON public.privileged_admins;
DROP POLICY IF EXISTS "Privileged admins can update privileged_admins table" ON public.privileged_admins;
DROP POLICY IF EXISTS "Privileged admins can delete from privileged_admins table" ON public.privileged_admins;

-- Create more restrictive policies with additional security layers
CREATE POLICY "Highly restricted admin email access"
ON public.privileged_admins
FOR ALL
USING (
  -- Multiple security checks
  auth.uid() IS NOT NULL 
  AND is_privileged_admin() 
  AND auth.jwt() ->> 'aud' = 'authenticated'
  AND NOT current_setting('app.emergency_mode', true)::boolean
)
WITH CHECK (
  -- Same restrictive checks for writes
  auth.uid() IS NOT NULL 
  AND is_privileged_admin() 
  AND auth.jwt() ->> 'aud' = 'authenticated'
  AND NOT current_setting('app.emergency_mode', true)::boolean
);

-- Strengthen role_change_audit policies
DROP POLICY IF EXISTS "Only privileged admins can view role_change_audit" ON public.role_change_audit;

CREATE POLICY "Super restricted role audit access"
ON public.role_change_audit
FOR SELECT
USING (
  -- Extra restrictive access to audit logs
  auth.uid() IS NOT NULL
  AND is_privileged_admin()
  AND auth.jwt() ->> 'aud' = 'authenticated'
  -- Only allow access to own actions or if super admin
  AND (
    changed_by_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.privileged_admins 
      WHERE user_id = auth.uid() 
      AND email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
);

-- Create audit trigger for admin table access
CREATE OR REPLACE FUNCTION public.audit_admin_access()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit trigger to privileged_admins table
DROP TRIGGER IF EXISTS audit_privileged_admin_access ON public.privileged_admins;
CREATE TRIGGER audit_privileged_admin_access
  AFTER INSERT OR UPDATE OR DELETE ON public.privileged_admins
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_access();

-- Add additional security function to validate admin context
CREATE OR REPLACE FUNCTION public.validate_admin_context()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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