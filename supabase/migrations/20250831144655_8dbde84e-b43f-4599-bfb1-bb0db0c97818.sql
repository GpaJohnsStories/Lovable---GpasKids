-- Grant execute on storage metrics functions to web roles
GRANT EXECUTE ON FUNCTION public.get_storage_totals() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_buckets_metrics() TO anon, authenticated;
-- Optional: grant on per-bucket metrics function if used elsewhere
GRANT EXECUTE ON FUNCTION public.get_bucket_metrics(text) TO anon, authenticated;