
-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.comments;
DROP POLICY IF EXISTS "Allow all inserts" ON public.comments;
DROP POLICY IF EXISTS "Admins full access" ON public.comments;
DROP POLICY IF EXISTS "Public can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can view all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can update all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can delete all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can do everything" ON public.comments;

-- Re-enable RLS on comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert comments (for public comment submission)
CREATE POLICY "Anyone can insert comments" 
  ON public.comments 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow public to view only approved comments
CREATE POLICY "Public can view approved comments"
  ON public.comments 
  FOR SELECT
  USING (status = 'approved');

-- Create policy to allow admins full access to all comments
-- This uses the existing is_admin() function from your database
CREATE POLICY "Admins can manage all comments"
  ON public.comments 
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Verify the policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'comments'
ORDER BY policyname;
