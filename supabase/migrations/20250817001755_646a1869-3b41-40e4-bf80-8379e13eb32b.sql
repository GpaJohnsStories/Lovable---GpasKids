-- Update the is_admin() function to check profiles table for admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  current_uid uuid;
  user_role text;
BEGIN
  -- Get current user ID
  current_uid := auth.uid();
  
  -- Return false if no authenticated user
  IF current_uid IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get user role from profiles table
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = current_uid;
  
  -- Return true if user is admin
  RETURN COALESCE(user_role = 'admin', FALSE);
END;
$$;