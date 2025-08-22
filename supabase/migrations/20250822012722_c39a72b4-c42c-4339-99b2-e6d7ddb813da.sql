-- Mask sensitive emails in role_change_audit to mitigate data exposure risk
-- 1) Add hashed and domain-only columns
ALTER TABLE public.role_change_audit 
  ADD COLUMN IF NOT EXISTS changed_by_email_hash text,
  ADD COLUMN IF NOT EXISTS target_email_hash text,
  ADD COLUMN IF NOT EXISTS changed_by_email_domain text,
  ADD COLUMN IF NOT EXISTS target_email_domain text;

-- 2) Backfill new columns from existing plaintext emails (if present)
UPDATE public.role_change_audit
SET 
  changed_by_email_hash = CASE WHEN changed_by_email IS NOT NULL THEN encode(digest(lower(changed_by_email), 'sha256'), 'hex') END,
  target_email_hash      = CASE WHEN target_email IS NOT NULL THEN encode(digest(lower(target_email), 'sha256'), 'hex') END,
  changed_by_email_domain = CASE WHEN changed_by_email IS NOT NULL THEN split_part(changed_by_email, '@', 2) END,
  target_email_domain      = CASE WHEN target_email IS NOT NULL THEN split_part(target_email, '@', 2) END
WHERE changed_by_email_hash IS NULL OR target_email_hash IS NULL OR changed_by_email_domain IS NULL OR target_email_domain IS NULL;

-- 3) Drop plaintext email columns
ALTER TABLE public.role_change_audit
  DROP COLUMN IF EXISTS changed_by_email,
  DROP COLUMN IF EXISTS target_email;

-- 4) Helpful indexes for lookups by hash
CREATE INDEX IF NOT EXISTS idx_role_change_audit_target_email_hash ON public.role_change_audit (target_email_hash);
CREATE INDEX IF NOT EXISTS idx_role_change_audit_changed_by_email_hash ON public.role_change_audit (changed_by_email_hash);

-- 5) Update change_user_role() to write masked values only
CREATE OR REPLACE FUNCTION public.change_user_role(target_email text, new_role text, reason text DEFAULT NULL::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id UUID;
  current_user_email TEXT;
  old_role TEXT;
  change_delay INTERVAL := '48 hours';
  -- masked fields
  current_user_email_hash TEXT;
  current_user_domain TEXT;
  target_email_hash TEXT;
  target_email_domain TEXT;
BEGIN
  -- Only privileged admins can change roles
  IF NOT public.is_privileged_admin() THEN
    RAISE EXCEPTION 'Access denied: Only privileged admins can change user roles';
  END IF;

  -- Validate new role
  IF new_role NOT IN ('admin', 'viewer', 'user') THEN
    RAISE EXCEPTION 'Invalid role: Must be admin, viewer, or user';
  END IF;

  -- Find target user by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'ERROR: User not found with email: ' || target_email;
  END IF;

  -- Get current user email for audit (masked)
  SELECT email INTO current_user_email
  FROM auth.users
  WHERE id = auth.uid();

  current_user_email_hash := encode(digest(lower(current_user_email), 'sha256'), 'hex');
  current_user_domain := split_part(current_user_email, '@', 2);
  target_email_hash := encode(digest(lower(target_email), 'sha256'), 'sha256');
  target_email_hash := encode(digest(lower(target_email), 'sha256'), 'hex');
  target_email_domain := split_part(target_email, '@', 2);

  -- Get current role
  SELECT role INTO old_role
  FROM public.profiles
  WHERE id = target_user_id;

  -- Check for promotion delay to admin (unless same privileged admin)
  IF new_role = 'admin' AND old_role != 'admin' THEN
    IF EXISTS (
      SELECT 1 FROM public.role_change_audit
      WHERE target_user_id = change_user_role.target_user_id
        AND new_role = 'admin'
        AND created_at > now() - change_delay
        AND changed_by_user_id != auth.uid()
    ) THEN
      RETURN 'ERROR: Admin promotion requires 48-hour wait period';
    END IF;
  END IF;

  -- Update or insert profile
  INSERT INTO public.profiles (id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (id) DO UPDATE SET 
    role = new_role,
    updated_at = now();

  -- Insert masked audit record
  INSERT INTO public.role_change_audit (
    target_user_id,
    target_email_hash,
    target_email_domain,
    old_role,
    new_role,
    changed_by_user_id,
    changed_by_email_hash,
    changed_by_email_domain,
    reason
  ) VALUES (
    target_user_id,
    target_email_hash,
    target_email_domain,
    old_role,
    new_role,
    auth.uid(),
    current_user_email_hash,
    current_user_domain,
    reason
  );

  RETURN 'SUCCESS: ' || target_email || ' role changed from ' || 
         COALESCE(old_role, 'none') || ' to ' || new_role;
END;
$function$;