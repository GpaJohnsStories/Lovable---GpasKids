-- First, let's recreate the hash_password function with proper type casting
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'::text, 12));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;