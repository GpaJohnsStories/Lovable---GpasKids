-- Clean slate admin reset
-- This will remove ALL admin users and start fresh

-- 1. Delete all admin users from the secure admin table
DELETE FROM public.admin_users;

-- 2. Reset all profiles to regular users (removes admin privileges)
UPDATE public.profiles SET role = 'user' WHERE role = 'admin';

-- 3. Create a simple function to promote your email to admin again
CREATE OR REPLACE FUNCTION public.simple_promote_to_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find user by email in auth.users
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'User not found. Make sure to sign up first with: ' || user_email;
  END IF;
  
  -- Update or insert profile as admin
  INSERT INTO public.profiles (id, role)
  VALUES (user_id, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
  
  RETURN 'SUCCESS: ' || user_email || ' is now an admin!';
END;
$$;