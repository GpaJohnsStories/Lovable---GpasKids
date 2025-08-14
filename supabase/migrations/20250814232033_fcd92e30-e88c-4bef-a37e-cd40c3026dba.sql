-- Create secure function to check if personal ID exists without exposing the actual IDs
CREATE OR REPLACE FUNCTION public.check_personal_id_exists(p_personal_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.used_personal_ids 
    WHERE personal_id = UPPER(p_personal_id)
  );
END;
$function$;

-- Drop the existing public read policy that allows anyone to see all personal IDs
DROP POLICY IF EXISTS "Anyone can check used personal ids" ON public.used_personal_ids;

-- Create a restricted policy that only allows admins to view the table directly
CREATE POLICY "Only admins can view used personal ids" 
ON public.used_personal_ids 
FOR SELECT 
USING (is_admin());

-- Keep the insert policy but make it more secure
DROP POLICY IF EXISTS "Anyone can insert personal ids" ON public.used_personal_ids;

CREATE POLICY "Secure personal id insertion" 
ON public.used_personal_ids 
FOR INSERT 
WITH CHECK (
  personal_id IS NOT NULL AND 
  length(personal_id) = 6 AND 
  personal_id ~ '^[A-Z0-9]+$'
);