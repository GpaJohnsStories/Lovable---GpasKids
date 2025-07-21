-- Debug and fix admin access functions
-- First, let's check what auth.uid() returns in different contexts

-- Create a debug function to see what's happening
CREATE OR REPLACE FUNCTION public.debug_auth_context()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_uid uuid;
  profile_exists boolean;
  user_role text;
BEGIN
  -- Get current auth uid
  current_uid := auth.uid();
  
  -- Check if profile exists
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = current_uid) INTO profile_exists;
  
  -- Get user role if exists
  SELECT role INTO user_role FROM public.profiles WHERE id = current_uid;
  
  RETURN jsonb_build_object(
    'auth_uid', current_uid,
    'profile_exists', profile_exists,
    'user_role', COALESCE(user_role, 'not_found'),
    'timestamp', now()
  );
END;
$$;

-- Update the is_admin function to be more robust
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Get user role
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = current_uid;
  
  -- Return true if user is admin
  RETURN COALESCE(user_role = 'admin', FALSE);
END;
$function$;

-- Update the is_viewer function to be more robust
CREATE OR REPLACE FUNCTION public.is_viewer()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Get user role
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = current_uid;
  
  -- Return true if user is viewer
  RETURN COALESCE(user_role = 'viewer', FALSE);
END;
$function$;

-- Update the has_admin_access function
CREATE OR REPLACE FUNCTION public.has_admin_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Get user role
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = current_uid;
  
  -- Return true if user is admin or viewer
  RETURN COALESCE(user_role IN ('admin', 'viewer'), FALSE);
END;
$function$;