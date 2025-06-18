
-- Let's check what policies actually exist and fix the RLS setup
-- First, let's see what policies are currently on the comments table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'comments';

-- Now let's completely reset the RLS policies to ensure they work correctly
-- Drop all existing policies on comments
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can view all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can update all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can delete all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.comments;

-- Create new, simpler policies that should work
-- Allow public to view only approved comments
CREATE POLICY "Public can view approved comments"
  ON public.comments FOR SELECT
  USING (status = 'approved');

-- Allow anyone to create comments (for the public comment form)
CREATE POLICY "Anyone can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

-- Allow admins to do everything with comments
CREATE POLICY "Admins can do everything"
  ON public.comments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
