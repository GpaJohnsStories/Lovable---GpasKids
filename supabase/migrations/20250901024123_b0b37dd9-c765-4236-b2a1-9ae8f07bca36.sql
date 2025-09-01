-- CRITICAL SECURITY FIX: Lock down emergency RPC functions that allow admin takeover
-- These functions currently allow ANY user to become admin or disable RLS

-- Remove execute permissions from all non-admin users for emergency functions
REVOKE EXECUTE ON FUNCTION public.emergency_promote_admin(text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.simple_promote_to_admin(text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.promote_user_to_admin(text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.promote_user_to_viewer(text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.emergency_admin_reset() FROM anon, authenticated;

-- Lock down introspection functions that expose database structure
REVOKE EXECUTE ON FUNCTION public.export_public_schema_json() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.export_public_rls_policies_json() FROM anon, authenticated;

-- Secure the admin email hash function
REVOKE EXECUTE ON FUNCTION public.get_allowed_admin_email_hashes() FROM anon, authenticated;

-- Tighten database audit log access
DROP POLICY IF EXISTS "Only system can insert database audit logs" ON public.database_operations_audit;
CREATE POLICY "Only trusted clients can insert database audit logs" 
ON public.database_operations_audit 
FOR INSERT 
WITH CHECK (is_trusted_client() OR is_admin_safe());

-- Lock down friend_names table (not currently used but securing for future)
DROP POLICY IF EXISTS "Anyone can read friend names" ON public.friend_names;
DROP POLICY IF EXISTS "Anyone can update friend names by hash" ON public.friend_names;
CREATE POLICY "Only admins can read friend names" 
ON public.friend_names 
FOR SELECT 
USING (is_admin_safe());

CREATE POLICY "Only system can update friend names" 
ON public.friend_names 
FOR UPDATE 
USING (is_trusted_client());

-- Add search_path security to all SECURITY DEFINER functions
ALTER FUNCTION public.emergency_promote_admin(text) SET search_path = 'public';
ALTER FUNCTION public.simple_promote_to_admin(text) SET search_path = 'public';
ALTER FUNCTION public.promote_user_to_admin(text) SET search_path = 'public';
ALTER FUNCTION public.promote_user_to_viewer(text) SET search_path = 'public';
ALTER FUNCTION public.emergency_admin_reset() SET search_path = 'public';
ALTER FUNCTION public.export_public_schema_json() SET search_path = 'public';
ALTER FUNCTION public.export_public_rls_policies_json() SET search_path = 'public';
ALTER FUNCTION public.get_allowed_admin_email_hashes() SET search_path = 'public';
ALTER FUNCTION public.get_allowed_admin_email_hashes_secure() SET search_path = 'public';
ALTER FUNCTION public.is_admin() SET search_path = 'public';
ALTER FUNCTION public.is_admin_safe() SET search_path = 'public';
ALTER FUNCTION public.is_privileged_admin() SET search_path = 'public';
ALTER FUNCTION public.has_admin_access() SET search_path = 'public';
ALTER FUNCTION public.is_viewer() SET search_path = 'public';
ALTER FUNCTION public.is_trusted_client() SET search_path = 'public';