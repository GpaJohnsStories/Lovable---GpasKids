-- Fix search_path issues for existing functions
CREATE OR REPLACE FUNCTION public.digest(text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
 SET search_path = public
AS '$libdir/pgcrypto', $function$pg_digest$function$;

CREATE OR REPLACE FUNCTION public.digest(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
 SET search_path = public
AS '$libdir/pgcrypto', $function$pg_digest$function$;