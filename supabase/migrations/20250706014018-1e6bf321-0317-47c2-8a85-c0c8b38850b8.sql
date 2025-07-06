-- Fix search_path security warnings for database functions
-- This prevents search path injection attacks by setting explicit search paths

-- Fix simple_promote_to_admin function
CREATE OR REPLACE FUNCTION public.simple_promote_to_admin(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix hash_password function
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN crypt(password, gen_salt('bf', 12));
END;
$function$;

-- Fix verify_password function
CREATE OR REPLACE FUNCTION public.verify_password(password text, hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN crypt(password, hash) = hash;
END;
$function$;