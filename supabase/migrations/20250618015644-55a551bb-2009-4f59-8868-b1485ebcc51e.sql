
-- First, let's check what RLS policies exist for comments
-- and create proper admin access policies

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.comments;

-- Create new RLS policies for the comments table
-- Allow public to view only approved comments
CREATE POLICY "Public can view approved comments"
  ON public.comments FOR SELECT
  USING (status = 'approved');

-- Allow anyone to create comments (for the public comment form)
CREATE POLICY "Anyone can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

-- Allow admins to view and manage ALL comments regardless of status
CREATE POLICY "Admins can view all comments"
  ON public.comments FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all comments"
  ON public.comments FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete all comments"
  ON public.comments FOR DELETE
  USING (public.is_admin());
