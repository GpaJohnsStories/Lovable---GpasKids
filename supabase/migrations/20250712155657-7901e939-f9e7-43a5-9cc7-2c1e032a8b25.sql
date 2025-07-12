-- Clean up custom admin system and switch to pure Supabase Auth
-- This removes the admin_users table and related functions, keeping only profiles table for role management

-- 1. Drop the custom admin_users table and related objects
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- 2. Drop custom admin functions that are no longer needed
DROP FUNCTION IF EXISTS public.admin_login(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.admin_sync_auth_password(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.change_admin_password(text, text) CASCADE;
DROP FUNCTION IF EXISTS public.hash_password(text) CASCADE;
DROP FUNCTION IF EXISTS public.verify_password(text, text) CASCADE;
DROP FUNCTION IF EXISTS public.admin_reset_password(text) CASCADE;

-- 3. Update the is_admin functions to only check profiles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
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

-- 4. Update the is_admin_safe function
CREATE OR REPLACE FUNCTION public.is_admin_safe()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- 5. Create function to promote users to admin (for setup)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find user by email in auth.users
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'User not found. Make sure the user has signed up first with: ' || user_email;
  END IF;
  
  -- Update or insert profile as admin
  INSERT INTO public.profiles (id, role)
  VALUES (user_id, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
  
  RETURN 'SUCCESS: ' || user_email || ' promoted to admin!';
END;
$$;

-- 6. Ensure profiles table has proper structure for admin management
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS webauthn_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS webauthn_credentials JSONB DEFAULT '[]'::jsonb;

-- 7. Create index for better performance on role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 8. Update profiles RLS policies to be more secure
DROP POLICY IF EXISTS "Admins can manage all profiles." ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

-- Create new, more secure policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());