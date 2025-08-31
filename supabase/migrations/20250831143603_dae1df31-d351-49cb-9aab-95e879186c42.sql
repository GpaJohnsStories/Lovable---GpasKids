-- Create secure RPC functions for system metrics

-- Function to get database size metrics
CREATE OR REPLACE FUNCTION public.get_database_size()
RETURNS TABLE(size_bytes BIGINT, size_pretty TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  db_size_bytes BIGINT;
BEGIN
  -- Only admins can access database metrics
  IF NOT public.is_admin_safe() THEN
    RAISE EXCEPTION 'Access denied: Only admins can view database metrics';
  END IF;
  
  -- Get database size in bytes
  SELECT pg_database_size(current_database()) INTO db_size_bytes;
  
  RETURN QUERY SELECT 
    db_size_bytes,
    pg_size_pretty(db_size_bytes);
END;
$$;

-- Function to get storage bucket metrics
CREATE OR REPLACE FUNCTION public.get_bucket_metrics(bucket_name TEXT)
RETURNS TABLE(object_count BIGINT, total_size_bytes BIGINT, total_size_pretty TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $$
DECLARE
  obj_count BIGINT := 0;
  total_bytes BIGINT := 0;
BEGIN
  -- Only admins can access storage metrics
  IF NOT public.is_admin_safe() THEN
    RAISE EXCEPTION 'Access denied: Only admins can view storage metrics';
  END IF;
  
  -- Get object count and total size from storage.objects
  SELECT 
    COUNT(*),
    COALESCE(SUM(metadata->>'size')::BIGINT, 0)
  INTO obj_count, total_bytes
  FROM storage.objects 
  WHERE bucket_id = bucket_name;
  
  RETURN QUERY SELECT 
    obj_count,
    total_bytes,
    pg_size_pretty(total_bytes);
END;
$$;

-- Function to get icon library count
CREATE OR REPLACE FUNCTION public.get_icon_library_count()
RETURNS TABLE(icon_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  count_result BIGINT;
BEGIN
  -- Only admins can access icon metrics
  IF NOT public.is_admin_safe() THEN
    RAISE EXCEPTION 'Access denied: Only admins can view icon metrics';
  END IF;
  
  -- Count records in icon_library
  SELECT COUNT(*) INTO count_result FROM public.icon_library;
  
  RETURN QUERY SELECT count_result;
END;
$$;