-- Fix security issue: Update RLS policies for privileged_admins table
-- to use security definer function instead of direct table queries

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Only privileged admins can manage privileged_admins" ON public.privileged_admins;
DROP POLICY IF EXISTS "Only privileged admins can view privileged_admins" ON public.privileged_admins;

-- Create secure RLS policies using the existing is_privileged_admin() function
-- This prevents potential recursive issues and ensures proper access control

CREATE POLICY "Privileged admins can view privileged_admins table"
ON public.privileged_admins
FOR SELECT
TO authenticated
USING (public.is_privileged_admin());

CREATE POLICY "Privileged admins can insert into privileged_admins table"
ON public.privileged_admins
FOR INSERT
TO authenticated
WITH CHECK (public.is_privileged_admin());

CREATE POLICY "Privileged admins can update privileged_admins table"
ON public.privileged_admins
FOR UPDATE
TO authenticated
USING (public.is_privileged_admin())
WITH CHECK (public.is_privileged_admin());

CREATE POLICY "Privileged admins can delete from privileged_admins table"
ON public.privileged_admins
FOR DELETE
TO authenticated
USING (public.is_privileged_admin());