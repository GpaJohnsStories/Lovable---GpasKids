
-- 1) Fix get_bucket_metrics to use the correct size column from storage.objects
CREATE OR REPLACE FUNCTION public.get_bucket_metrics(bucket_name text)
RETURNS TABLE(object_count bigint, total_size_bytes bigint, total_size_pretty text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  obj_count BIGINT := 0;
  total_bytes BIGINT := 0;
BEGIN
  -- Only admins can access storage metrics
  IF NOT public.is_admin_safe() THEN
    RAISE EXCEPTION 'Access denied: Only admins can view storage metrics';
  END IF;

  -- Count objects and sum their byte sizes from storage.objects
  SELECT 
    COUNT(o.id),
    COALESCE(SUM(o.size), 0)
  INTO obj_count, total_bytes
  FROM storage.objects o
  WHERE o.bucket_id = bucket_name;

  RETURN QUERY SELECT 
    obj_count,
    total_bytes,
    pg_size_pretty(total_bytes);
END;
$function$;

-- 2) Per-bucket metrics across all buckets
CREATE OR REPLACE FUNCTION public.get_all_buckets_metrics()
RETURNS TABLE(bucket_name text, object_count bigint, total_size_bytes bigint, total_size_pretty text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
BEGIN
  -- Only admins can access storage metrics
  IF NOT public.is_admin_safe() THEN
    RAISE EXCEPTION 'Access denied: Only admins can view storage metrics';
  END IF;

  RETURN QUERY
  SELECT 
    b.id::text AS bucket_name,
    COUNT(o.id)::bigint AS object_count,
    COALESCE(SUM(o.size), 0)::bigint AS total_size_bytes,
    pg_size_pretty(COALESCE(SUM(o.size), 0)::bigint) AS total_size_pretty
  FROM storage.buckets b
  LEFT JOIN storage.objects o
    ON o.bucket_id = b.id
  GROUP BY b.id
  ORDER BY b.id;
END;
$function$;

-- 3) Single-row totals for all storage buckets
CREATE OR REPLACE FUNCTION public.get_storage_totals()
RETURNS TABLE(total_objects bigint, total_size_bytes bigint, total_size_pretty text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
BEGIN
  -- Only admins can access storage metrics
  IF NOT public.is_admin_safe() THEN
    RAISE EXCEPTION 'Access denied: Only admins can view storage metrics';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(o.id)::bigint AS total_objects,
    COALESCE(SUM(o.size), 0)::bigint AS total_size_bytes,
    pg_size_pretty(COALESCE(SUM(o.size), 0)::bigint) AS total_size_pretty
  FROM storage.objects o;
END;
$function$;
