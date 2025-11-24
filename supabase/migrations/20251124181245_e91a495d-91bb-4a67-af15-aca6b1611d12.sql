-- Fix Security Issues - Handle Dependencies First

-- 1. Drop policies that depend on privileged_admins.email column
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Super restricted role audit access" ON public.role_change_audit;

-- Recreate products policy using email_hash instead
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.privileged_admins pa
    WHERE pa.email_hash = encode(digest(lower(auth.email()), 'sha256'), 'hex')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.privileged_admins pa
    WHERE pa.email_hash = encode(digest(lower(auth.email()), 'sha256'), 'hex')
  )
);

-- Recreate role_change_audit policy using email_hash
CREATE POLICY "Super restricted role audit access"
ON public.role_change_audit
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND is_privileged_admin() 
  AND (auth.jwt() ->> 'aud') = 'authenticated'
  AND (
    changed_by_user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.privileged_admins pa
      WHERE pa.user_id = auth.uid() 
      AND pa.email_hash = encode(digest(lower(auth.email()), 'sha256'), 'hex')
    )
  )
);

-- 2. Now safely remove plaintext email column
ALTER TABLE public.privileged_admins DROP COLUMN email;

-- 3. Fix special_days RLS policies - restrict modifications to admins only
DROP POLICY IF EXISTS "Users can delete special days" ON public.special_days;
DROP POLICY IF EXISTS "Users can insert special days" ON public.special_days;
DROP POLICY IF EXISTS "Users can update special days" ON public.special_days;

CREATE POLICY "Only admins can insert special days"
ON public.special_days
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update special days"
ON public.special_days
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete special days"
ON public.special_days
FOR DELETE
TO authenticated
USING (is_admin());

-- 4. Document webauthn_credentials security requirement
COMMENT ON COLUMN public.profiles.webauthn_credentials IS 
'SECURITY: Contains sensitive authentication data. Never SELECT in public queries. Only access during authentication.';