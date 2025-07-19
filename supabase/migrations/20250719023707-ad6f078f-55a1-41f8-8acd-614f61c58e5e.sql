
-- Add viewer role support to the profiles table and create functions for role checking
UPDATE public.profiles 
SET role = 'viewer' 
WHERE role = 'user' AND id IN (
  -- You can specify specific user IDs here if needed, or leave empty for now
  SELECT id FROM public.profiles WHERE FALSE
);

-- Create function to check if user is viewer
CREATE OR REPLACE FUNCTION public.is_viewer()
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
    WHERE id = auth.uid() AND role = 'viewer'
  );
END;
$$;

-- Create function to check if user has admin or viewer access
CREATE OR REPLACE FUNCTION public.has_admin_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN public.is_admin() OR public.is_viewer();
END;
$$;

-- Update existing admin policies to allow viewer read access
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins and viewers can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_admin_access());

-- Update comments policies for viewer access
DROP POLICY IF EXISTS "Secure admin access to comments" ON public.comments;
CREATE POLICY "Admins can manage all comments"
ON public.comments FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Viewers can read all comments"
ON public.comments FOR SELECT
USING (public.is_viewer());

-- Update admin audit policies for viewer access
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit;
CREATE POLICY "Admins and viewers can view audit logs"
ON public.admin_audit FOR SELECT
USING (public.has_admin_access());

-- Update database operations audit for viewer access
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.database_operations_audit;
CREATE POLICY "Admins and viewers can view audit logs"
ON public.database_operations_audit FOR SELECT
USING (public.has_admin_access());

-- Create function to promote user to viewer role
CREATE OR REPLACE FUNCTION public.promote_user_to_viewer(user_email text)
RETURNS text
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
  
  -- Update or insert profile as viewer
  INSERT INTO public.profiles (id, role)
  VALUES (user_id, 'viewer')
  ON CONFLICT (id) DO UPDATE SET role = 'viewer';
  
  RETURN 'SUCCESS: ' || user_email || ' promoted to viewer!';
END;
$$;
