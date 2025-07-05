-- Enhanced Security: Least Privilege Database Access Implementation
-- This migration implements stricter RLS policies and audit logging

-- 1. Create audit logging table for database operations
CREATE TABLE IF NOT EXISTS public.database_operations_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  client_type TEXT NOT NULL, -- 'public', 'admin', 'service'
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  operation_details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.database_operations_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.database_operations_audit FOR SELECT
  USING (is_admin_safe());

-- System can insert audit logs (no user restrictions for logging)
CREATE POLICY "System can insert audit logs"
  ON public.database_operations_audit FOR INSERT
  WITH CHECK (true);

-- 2. Create function to log database operations
CREATE OR REPLACE FUNCTION public.log_database_operation(
  p_operation_type TEXT,
  p_table_name TEXT,
  p_record_id TEXT DEFAULT NULL,
  p_client_type TEXT DEFAULT 'unknown',
  p_operation_details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.database_operations_audit (
    operation_type,
    table_name,
    record_id,
    client_type,
    user_id,
    ip_address,
    operation_details
  ) VALUES (
    p_operation_type,
    p_table_name,
    p_record_id,
    p_client_type,
    auth.uid(),
    inet_client_addr(),
    p_operation_details
  );
END;
$$;

-- 3. Create trigger function for automatic audit logging
CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log the operation with old and new values
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_database_operation(
      'INSERT',
      TG_TABLE_NAME,
      NEW.id::TEXT,
      current_setting('app.client_type', true),
      jsonb_build_object('new_values', to_jsonb(NEW))
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_database_operation(
      'UPDATE',
      TG_TABLE_NAME,
      NEW.id::TEXT,
      current_setting('app.client_type', true),
      jsonb_build_object('old_values', to_jsonb(OLD), 'new_values', to_jsonb(NEW))
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_database_operation(
      'DELETE',
      TG_TABLE_NAME,
      OLD.id::TEXT,
      current_setting('app.client_type', true),
      jsonb_build_object('old_values', to_jsonb(OLD))
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- 4. Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_comments_changes ON public.comments;
CREATE TRIGGER audit_comments_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

DROP TRIGGER IF EXISTS audit_stories_changes ON public.stories;
CREATE TRIGGER audit_stories_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

-- 5. Create more restrictive policies for comments table
-- Drop existing broad policies
DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;

-- Create more specific comment creation policy with rate limiting context
CREATE POLICY "Public can create comments with restrictions"
  ON public.comments FOR INSERT
  WITH CHECK (
    -- Only allow creation with pending status
    status = 'pending'
    -- Could add additional restrictions here like rate limiting
    AND personal_id IS NOT NULL 
    AND length(personal_id) = 6
    AND length(subject) >= 2
    AND length(content) >= 10
  );

-- 6. Add helper function to check if operation is from trusted client
CREATE OR REPLACE FUNCTION public.is_trusted_client()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the client has set a trusted client identifier
  RETURN current_setting('app.client_type', true) IN ('admin', 'service');
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$;

-- 7. Create index for better audit log performance
CREATE INDEX IF NOT EXISTS idx_database_operations_audit_created_at 
  ON public.database_operations_audit(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_database_operations_audit_table_operation 
  ON public.database_operations_audit(table_name, operation_type);
CREATE INDEX IF NOT EXISTS idx_database_operations_audit_user_id
  ON public.database_operations_audit(user_id) WHERE user_id IS NOT NULL;