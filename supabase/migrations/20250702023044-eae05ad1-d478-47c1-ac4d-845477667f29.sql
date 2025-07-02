-- STAGE 1: Secure Admin Migration with Safety Nets
-- This creates the new secure admin system while keeping the old one working

-- 1. Create admin user in profiles table (your super admin)
INSERT INTO public.profiles (id, role) 
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 2. Create emergency bypass function (temporary safety net)
CREATE OR REPLACE FUNCTION public.is_emergency_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Emergency bypass: check for hardcoded session or special header
  IF current_setting('app.emergency_admin', true) = 'true' THEN
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$;

-- 3. Create enhanced admin check function with fallback
CREATE OR REPLACE FUNCTION public.is_admin_safe()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Emergency bypass first
  IF public.is_emergency_admin() THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user is authenticated admin
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 4. Enable RLS on comments table with dual admin system
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can do everything" ON public.comments;

-- Create new secure policies with emergency fallback
CREATE POLICY "Public can view approved comments"
  ON public.comments FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Secure admin access to comments"
  ON public.comments FOR ALL
  USING (public.is_admin_safe())
  WITH CHECK (public.is_admin_safe());

-- 5. Secure stories table (currently has permissive policies, make them admin-only for management)
-- Keep read access public, restrict write access to admins only
DROP POLICY IF EXISTS "Allow story creation" ON public.stories;
DROP POLICY IF EXISTS "Allow story updates" ON public.stories;
DROP POLICY IF EXISTS "Allow story deletion" ON public.stories;

CREATE POLICY "Admins can create stories"
  ON public.stories FOR INSERT
  WITH CHECK (public.is_admin_safe());

CREATE POLICY "Admins can update stories"
  ON public.stories FOR UPDATE
  USING (public.is_admin_safe())
  WITH CHECK (public.is_admin_safe());

CREATE POLICY "Admins can delete stories"
  ON public.stories FOR DELETE
  USING (public.is_admin_safe());

-- 6. Create audit table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid,
  action text NOT NULL,
  table_name text,
  record_id text,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit FOR SELECT
  USING (public.is_admin_safe());

-- 7. Create emergency reset function (use only if locked out)
CREATE OR REPLACE FUNCTION public.emergency_admin_reset()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function can be called to temporarily disable RLS for recovery
  -- Only use in emergencies!
  ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.stories DISABLE ROW LEVEL SECURITY;
  
  RETURN 'Emergency reset activated. Re-enable RLS after recovery.';
END;
$$;