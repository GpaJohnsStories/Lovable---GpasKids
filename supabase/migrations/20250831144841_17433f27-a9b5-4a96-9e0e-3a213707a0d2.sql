-- Fix the storage functions to use metadata->'size' instead of o.size

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
    COALESCE(SUM((o.metadata->>'size')::bigint), 0)::bigint AS total_size_bytes,
    pg_size_pretty(COALESCE(SUM((o.metadata->>'size')::bigint), 0)::bigint) AS total_size_pretty
  FROM storage.objects o;
END;
$function$;

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
    COALESCE(SUM((o.metadata->>'size')::bigint), 0)::bigint AS total_size_bytes,
    pg_size_pretty(COALESCE(SUM((o.metadata->>'size')::bigint), 0)::bigint) AS total_size_pretty
  FROM storage.buckets b
  LEFT JOIN storage.objects o
    ON o.bucket_id = b.id
  GROUP BY b.id
  ORDER BY b.id;
END;
$function$;

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

  -- Count objects and sum their byte sizes from storage.objects metadata
  SELECT 
    COUNT(o.id),
    COALESCE(SUM((o.metadata->>'size')::bigint), 0)
  INTO obj_count, total_bytes
  FROM storage.objects o
  WHERE o.bucket_id = bucket_name;

  RETURN QUERY SELECT 
    obj_count,
    total_bytes,
    pg_size_pretty(total_bytes);
END;
$function$;