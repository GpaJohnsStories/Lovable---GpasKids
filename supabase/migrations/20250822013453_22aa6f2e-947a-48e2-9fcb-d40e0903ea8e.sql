-- Phase A: Secure Administrator Email Storage Migration
-- Remove plaintext admin emails from privileged_admins table

-- 1) Add hashed and domain-only columns to privileged_admins
ALTER TABLE public.privileged_admins 
  ADD COLUMN IF NOT EXISTS email_hash text,
  ADD COLUMN IF NOT EXISTS email_domain text;

-- 2) Backfill new columns from existing plaintext emails
UPDATE public.privileged_admins
SET 
  email_hash = encode(digest(lower(email), 'sha256'), 'hex'),
  email_domain = split_part(email, '@', 2)
WHERE email_hash IS NULL OR email_domain IS NULL;

-- 3) Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_privileged_admins_email_hash ON public.privileged_admins (email_hash);
CREATE INDEX IF NOT EXISTS idx_privileged_admins_email_domain ON public.privileged_admins (email_domain);

-- 4) Helper function to add privileged admin by email (stores hash + domain)
CREATE OR REPLACE FUNCTION public.add_privileged_admin_secure(admin_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  email_normalized text;
  computed_hash text;
  computed_domain text;
BEGIN
  -- Only privileged admins can add other privileged admins
  IF NOT public.is_privileged_admin() THEN
    RAISE EXCEPTION 'Access denied: Only privileged admins can add privileged admins';
  END IF;

  -- Normalize and validate email
  email_normalized := lower(trim(admin_email));
  IF email_normalized !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    RETURN 'ERROR: Invalid email format';
  END IF;

  -- Compute hash and domain
  computed_hash := encode(digest(email_normalized, 'sha256'), 'hex');
  computed_domain := split_part(email_normalized, '@', 2);

  -- Check if already exists (by hash)
  IF EXISTS (SELECT 1 FROM public.privileged_admins WHERE email_hash = computed_hash) THEN
    RETURN 'ERROR: Admin email already exists';
  END IF;

  -- Insert with masked data only
  INSERT INTO public.privileged_admins (
    user_id,
    email_hash,
    email_domain
  ) VALUES (
    crypto.randomUUID(), -- Temporary user_id, should be resolved by auth system
    computed_hash,
    computed_domain
  );

  RETURN 'SUCCESS: Privileged admin added (hash: ' || substring(computed_hash, 1, 8) || '...)';
END;
$function$;

-- 5) Helper function to remove privileged admin by email
CREATE OR REPLACE FUNCTION public.remove_privileged_admin_secure(admin_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  email_normalized text;
  computed_hash text;
  removed_count integer;
BEGIN
  -- Only privileged admins can remove other privileged admins
  IF NOT public.is_privileged_admin() THEN
    RAISE EXCEPTION 'Access denied: Only privileged admins can remove privileged admins';
  END IF;

  -- Normalize email and compute hash
  email_normalized := lower(trim(admin_email));
  computed_hash := encode(digest(email_normalized, 'sha256'), 'hex');

  -- Remove by hash
  DELETE FROM public.privileged_admins WHERE email_hash = computed_hash;
  GET DIAGNOSTICS removed_count = ROW_COUNT;

  IF removed_count = 0 THEN
    RETURN 'ERROR: Admin email not found';
  END IF;

  RETURN 'SUCCESS: Privileged admin removed';
END;
$function$;

-- 6) Helper function to get allowed admin email hashes (for secure-auth)
CREATE OR REPLACE FUNCTION public.get_allowed_admin_email_hashes()
RETURNS text[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT ARRAY(
    SELECT email_hash FROM public.privileged_admins WHERE email_hash IS NOT NULL
  );
$function$;

-- 7) Helper function to list privileged admins (masked for UI)
CREATE OR REPLACE FUNCTION public.list_privileged_admins_masked()
RETURNS TABLE(
  id uuid,
  email_domain text,
  email_hash_preview text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    pa.id,
    pa.email_domain,
    substring(pa.email_hash, 1, 8) || '...' as email_hash_preview,
    pa.created_at
  FROM public.privileged_admins pa
  WHERE pa.email_hash IS NOT NULL
  ORDER BY pa.created_at DESC;
$function$;

-- 8) Audit trigger for privileged_admins changes
CREATE OR REPLACE FUNCTION public.audit_privileged_admin_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log privileged admin table changes
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.admin_audit (
      action,
      table_name,
      admin_id,
      new_values
    ) VALUES (
      'PRIVILEGED_ADMIN_ADDED',
      'privileged_admins',
      auth.uid(),
      jsonb_build_object(
        'email_domain', NEW.email_domain,
        'email_hash_preview', substring(NEW.email_hash, 1, 8) || '...'
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.admin_audit (
      action,
      table_name,
      admin_id,
      old_values
    ) VALUES (
      'PRIVILEGED_ADMIN_REMOVED',
      'privileged_admins',
      auth.uid(),
      jsonb_build_object(
        'email_domain', OLD.email_domain,
        'email_hash_preview', substring(OLD.email_hash, 1, 8) || '...'
      )
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Create the audit trigger
DROP TRIGGER IF EXISTS privileged_admin_audit_trigger ON public.privileged_admins;
CREATE TRIGGER privileged_admin_audit_trigger
  AFTER INSERT OR DELETE ON public.privileged_admins
  FOR EACH ROW EXECUTE FUNCTION public.audit_privileged_admin_changes();