
-- 1) Export a JSON snapshot of the public schema (tables and columns)
CREATE OR REPLACE FUNCTION public.export_public_schema_json()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'generated_at', now(),
    'schema', 'public',
    'tables', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'table', t.table_name,
          'columns', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'column', c.column_name,
                'data_type', c.data_type,
                'is_nullable', c.is_nullable,
                'column_default', c.column_default
              )
              ORDER BY c.ordinal_position
            )
            FROM information_schema.columns c
            WHERE c.table_schema = 'public'
              AND c.table_name = t.table_name
          )
        )
        ORDER BY t.table_name
      ),
      '[]'::jsonb
    )
  )
  INTO result
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE';

  RETURN result;
END;
$$;

-- 2) Export a JSON snapshot of RLS policies on public tables
CREATE OR REPLACE FUNCTION public.export_public_rls_policies_json()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'generated_at', now(),
    'schema', 'public',
    'policies', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'policy_name', pol.policyname,
          'permissive', pol.permissive,
          'roles', pol.roles,
          'cmd', pol.cmd,
          'schemaname', pol.schemaname,
          'tablename', pol.tablename,
          'qual', pol.qual,
          'with_check', pol.with_check
        )
        ORDER BY pol.schemaname, pol.tablename, pol.policyname
      ),
      '[]'::jsonb
    )
  )
  FROM pg_policies pol
  WHERE pol.schemaname = 'public';
$$;
