-- Remove IP address and user agent columns from all tables for complete privacy compliance

-- Drop columns from story_votes table
ALTER TABLE public.story_votes 
DROP COLUMN IF EXISTS ip_address,
DROP COLUMN IF EXISTS user_agent;

-- Drop columns from story_reads table  
ALTER TABLE public.story_reads
DROP COLUMN IF EXISTS ip_address,
DROP COLUMN IF EXISTS user_agent;

-- Drop columns from admin_audit table
ALTER TABLE public.admin_audit
DROP COLUMN IF EXISTS ip_address,
DROP COLUMN IF EXISTS user_agent;

-- Drop columns from database_operations_audit table
ALTER TABLE public.database_operations_audit
DROP COLUMN IF EXISTS ip_address,
DROP COLUMN IF EXISTS user_agent;

-- Update log_database_operation function to remove IP address collection
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
    operation_details
  ) VALUES (
    p_operation_type,
    p_table_name,
    p_record_id,
    COALESCE(p_client_type, 'unknown'),
    auth.uid(),
    p_operation_details
  );
END;
$function$;