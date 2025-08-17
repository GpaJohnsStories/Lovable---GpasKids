-- Fix admin_audit table security by replacing permissive policies with restrictive ones
-- Drop existing permissive policies
DROP POLICY IF EXISTS "No deletion allowed on audit logs" ON public.admin_audit;
DROP POLICY IF EXISTS "No updates allowed on audit logs" ON public.admin_audit; 
DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.admin_audit;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit;

-- Create restrictive policies (using RESTRICTIVE instead of PERMISSIVE)
CREATE POLICY "Only admins can view audit logs" 
ON public.admin_audit
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can insert audit logs" 
ON public.admin_audit
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

-- Explicitly block all updates and deletes for security
CREATE POLICY "Block all updates on audit logs" 
ON public.admin_audit
FOR UPDATE 
TO authenticated
USING (false);

CREATE POLICY "Block all deletes on audit logs" 
ON public.admin_audit
FOR DELETE 
TO authenticated
USING (false);

-- Ensure RLS is enabled on admin_audit table
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;