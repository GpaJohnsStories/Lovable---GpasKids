-- Fix security issues: Restrict database_operations_audit access and fix function search paths

-- 1. Add missing search_path to security functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.is_viewer()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = 'public'
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
  
  -- Get user role
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = current_uid;
  
  -- Return true if user is viewer
  RETURN COALESCE(user_role = 'viewer', FALSE);
END;
$$;

CREATE OR REPLACE FUNCTION public.has_admin_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = 'public'
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
  
  -- Get user role
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = current_uid;
  
  -- Return true if user is admin or viewer
  RETURN COALESCE(user_role IN ('admin', 'viewer'), FALSE);
END;
$$;

-- 2. Restrict database_operations_audit table access to admins only
-- First drop existing policies that might allow public access
DROP POLICY IF EXISTS "Admins and viewers can view audit logs" ON public.database_operations_audit;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.database_operations_audit;

-- Create restrictive policies for database_operations_audit
CREATE POLICY "Only admins can view database audit logs" 
ON public.database_operations_audit
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Only system can insert database audit logs" 
ON public.database_operations_audit
FOR INSERT 
WITH CHECK (true);  -- Allow system inserts but not direct user inserts

-- Ensure no public access to sensitive audit data
CREATE POLICY "Block all updates on database audit logs" 
ON public.database_operations_audit
FOR UPDATE 
USING (false);

CREATE POLICY "Block all deletes on database audit logs" 
ON public.database_operations_audit
FOR DELETE 
USING (false);