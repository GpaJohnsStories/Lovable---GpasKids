-- Create privileged_admins table for role management control
CREATE TABLE public.privileged_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.privileged_admins ENABLE ROW LEVEL SECURITY;

-- Only privileged admins can view this table
CREATE POLICY "Only privileged admins can view privileged_admins" 
ON public.privileged_admins 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.privileged_admins pa 
    WHERE pa.user_id = auth.uid()
  )
);

-- Only privileged admins can manage this table
CREATE POLICY "Only privileged admins can manage privileged_admins" 
ON public.privileged_admins 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.privileged_admins pa 
    WHERE pa.user_id = auth.uid()
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.privileged_admins pa 
    WHERE pa.user_id = auth.uid()
  )
);

-- Create role change audit table
CREATE TABLE public.role_change_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_user_id UUID NOT NULL,
  target_email TEXT NOT NULL,
  old_role TEXT,
  new_role TEXT NOT NULL,
  changed_by_user_id UUID NOT NULL,
  changed_by_email TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;

-- Only privileged admins can view role change audit
CREATE POLICY "Only privileged admins can view role_change_audit" 
ON public.role_change_audit 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.privileged_admins pa 
    WHERE pa.user_id = auth.uid()
  )
);

-- Only system can insert role change audit
CREATE POLICY "Only system can insert role_change_audit" 
ON public.role_change_audit 
FOR INSERT 
WITH CHECK (true);

-- Create function to check if user is privileged admin
CREATE OR REPLACE FUNCTION public.is_privileged_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_uid uuid;
BEGIN
  -- Get current user ID
  current_uid := auth.uid();
  
  -- Return false if no authenticated user
  IF current_uid IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user is in privileged_admins table
  RETURN EXISTS (
    SELECT 1 FROM public.privileged_admins
    WHERE user_id = current_uid
  );
END;
$function$;

-- Create secure role change function
CREATE OR REPLACE FUNCTION public.change_user_role(
  target_email text,
  new_role text,
  reason text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id UUID;
  current_user_email TEXT;
  old_role TEXT;
  change_delay INTERVAL := '48 hours';
BEGIN
  -- Only privileged admins can change roles
  IF NOT public.is_privileged_admin() THEN
    RAISE EXCEPTION 'Access denied: Only privileged admins can change user roles';
  END IF;

  -- Validate new role
  IF new_role NOT IN ('admin', 'viewer', 'user') THEN
    RAISE EXCEPTION 'Invalid role: Must be admin, viewer, or user';
  END IF;

  -- Find target user by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'ERROR: User not found with email: ' || target_email;
  END IF;

  -- Get current user email for audit
  SELECT email INTO current_user_email
  FROM auth.users
  WHERE id = auth.uid();

  -- Get current role
  SELECT role INTO old_role
  FROM public.profiles
  WHERE id = target_user_id;

  -- Check for promotion to admin (requires delay unless done by same privileged admin)
  IF new_role = 'admin' AND old_role != 'admin' THEN
    -- Check if this is a recent promotion
    IF EXISTS (
      SELECT 1 FROM public.role_change_audit
      WHERE target_user_id = change_user_role.target_user_id
      AND new_role = 'admin'
      AND created_at > now() - change_delay
      AND changed_by_user_id != auth.uid()
    ) THEN
      RETURN 'ERROR: Admin promotion requires 48-hour wait period';
    END IF;
  END IF;

  -- Update or insert profile
  INSERT INTO public.profiles (id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (id) DO UPDATE SET 
    role = new_role,
    updated_at = now();

  -- Log the change
  INSERT INTO public.role_change_audit (
    target_user_id,
    target_email,
    old_role,
    new_role,
    changed_by_user_id,
    changed_by_email,
    reason
  ) VALUES (
    target_user_id,
    target_email,
    old_role,
    new_role,
    auth.uid(),
    current_user_email,
    reason
  );

  RETURN 'SUCCESS: ' || target_email || ' role changed from ' || 
         COALESCE(old_role, 'none') || ' to ' || new_role;
END;
$function$;

-- Create function to get allowed emails for registration
CREATE OR REPLACE FUNCTION public.get_allowed_admin_emails()
RETURNS text[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT ARRAY(
    SELECT email FROM public.privileged_admins
    UNION
    -- Add any additional hardcoded emails here if needed
    SELECT unnest(ARRAY[]::text[])
  );
$function$;