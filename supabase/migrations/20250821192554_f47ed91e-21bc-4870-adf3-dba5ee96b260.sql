
-- 1) Ensure RLS is enabled for admin_audit
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;

-- 2) Tighten privileges: revoke from anon and PUBLIC, keep authenticated with minimal needed grants
REVOKE ALL ON TABLE public.admin_audit FROM anon;
REVOKE ALL ON TABLE public.admin_audit FROM PUBLIC;

-- Ensure authenticated role can access the table (RLS will still enforce admin-only visibility)
GRANT SELECT ON TABLE public.admin_audit TO authenticated;

-- Note: INSERTs into admin_audit are performed via SECURITY DEFINER functions/triggers.
-- Table owner retains privileges; no need to grant INSERT to authenticated users.

-- 3) Recreate strict RLS policies (idempotent approach: drop if exists, then create)
DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.admin_audit;
CREATE POLICY "Only admins can view audit logs"
  ON public.admin_audit
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can insert audit logs" ON public.admin_audit;
CREATE POLICY "Only admins can insert audit logs"
  ON public.admin_audit
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Block all updates on audit logs" ON public.admin_audit;
CREATE POLICY "Block all updates on audit logs"
  ON public.admin_audit
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "Block all deletes on audit logs" ON public.admin_audit;
CREATE POLICY "Block all deletes on audit logs"
  ON public.admin_audit
  FOR DELETE
  USING (false);
