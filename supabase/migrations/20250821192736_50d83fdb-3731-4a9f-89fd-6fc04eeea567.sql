
-- 1) Ensure RLS is enabled for database_operations_audit
ALTER TABLE public.database_operations_audit ENABLE ROW LEVEL SECURITY;

-- 2) Tighten privileges: revoke from anon and PUBLIC
REVOKE ALL ON TABLE public.database_operations_audit FROM anon;
REVOKE ALL ON TABLE public.database_operations_audit FROM PUBLIC;

-- Optional safety: clear authenticated grants first, then re-grant SELECT only
REVOKE ALL ON TABLE public.database_operations_audit FROM authenticated;
GRANT SELECT ON TABLE public.database_operations_audit TO authenticated;

-- Note: INSERTs should only be done via SECURITY DEFINER functions (e.g., log_database_operation).
-- Do NOT grant INSERT to clients.

-- 3) Recreate strict RLS policies (idempotent)
DROP POLICY IF EXISTS "Only admins can view database audit logs" ON public.database_operations_audit;
CREATE POLICY "Only admins can view database audit logs"
  ON public.database_operations_audit
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Block all updates on database audit logs" ON public.database_operations_audit;
CREATE POLICY "Block all updates on database audit logs"
  ON public.database_operations_audit
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "Block all deletes on database audit logs" ON public.database_operations_audit;
CREATE POLICY "Block all deletes on database audit logs"
  ON public.database_operations_audit
  FOR DELETE
  USING (false);

-- Keep insert pathway restricted to trusted server context (no grants given to clients).
DROP POLICY IF EXISTS "Only system can insert database audit logs" ON public.database_operations_audit;
CREATE POLICY "Only system can insert database audit logs"
  ON public.database_operations_audit
  FOR INSERT
  WITH CHECK (true);
