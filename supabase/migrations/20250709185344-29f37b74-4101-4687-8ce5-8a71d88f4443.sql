-- Fix the audit logging constraint that's blocking story saves
-- Make client_type nullable and provide a default

ALTER TABLE public.database_operations_audit 
ALTER COLUMN client_type DROP NOT NULL;

-- Update the logging function to handle missing client_type
CREATE OR REPLACE FUNCTION public.log_database_operation(
  p_operation_type text, 
  p_table_name text, 
  p_record_id text DEFAULT NULL::text, 
  p_client_type text DEFAULT 'unknown'::text, 
  p_operation_details jsonb DEFAULT NULL::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    COALESCE(p_client_type, 'unknown'),
    auth.uid(),
    inet_client_addr(),
    p_operation_details
  );
END;
$function$;