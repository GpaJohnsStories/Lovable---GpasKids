-- Fix admin_audit table security issues
-- This migration restricts access to admin_audit table to only admin users (not viewers)

-- First, drop the existing policy that allows viewers
DROP POLICY IF EXISTS "Admins and viewers can view audit logs" ON public.admin_audit;

-- Create a new restrictive policy for admin-only access
CREATE POLICY "Only admins can view audit logs"
ON public.admin_audit
FOR SELECT
TO authenticated
USING (is_admin());

-- Ensure the table has proper insert policies for the audit system
CREATE POLICY "System can insert audit logs"
ON public.admin_audit  
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Add an update policy to prevent any modifications to audit logs
-- (Audit logs should be immutable once created)
CREATE POLICY "No updates allowed on audit logs"
ON public.admin_audit
FOR UPDATE
TO authenticated
USING (false);

-- Add a delete policy to prevent deletion of audit logs
-- (Only in extreme emergency situations should audit logs be deleted)
CREATE POLICY "No deletion allowed on audit logs"
ON public.admin_audit
FOR DELETE  
TO authenticated
USING (false);

-- Ensure RLS is enabled
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;

-- Create a more secure audit logging function that validates admin access
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_action text,
  p_table_name text DEFAULT NULL,
  p_record_id text DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow admins to log activities
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only admins can log audit activities';
  END IF;

  -- Insert the audit log
  INSERT INTO public.admin_audit (
    action,
    table_name,
    record_id,
    admin_id,
    old_values,
    new_values
  ) VALUES (
    p_action,
    p_table_name,
    p_record_id,
    auth.uid(),
    p_old_values,
    p_new_values
  );
END;
$$;

-- Grant execute permission to authenticated users (but function will check admin status)
GRANT EXECUTE ON FUNCTION public.log_admin_activity TO authenticated;