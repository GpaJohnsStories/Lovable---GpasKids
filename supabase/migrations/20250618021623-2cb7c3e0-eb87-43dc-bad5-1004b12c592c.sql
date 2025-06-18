
-- Let's completely reset and fix the RLS policies for comments
-- First, drop all existing policies to start completely fresh
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Public can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can view all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can update all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can delete all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can do everything" ON public.comments;

-- Ensure RLS is enabled
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create the most permissive INSERT policy possible for public users
-- This allows anyone to insert comments without any restrictions
CREATE POLICY "Allow all inserts" 
  ON public.comments 
  FOR INSERT 
  WITH CHECK (true);

-- Allow public to view only approved comments
CREATE POLICY "Public can view approved comments"
  ON public.comments 
  FOR SELECT
  USING (status = 'approved');

-- Allow admins to do everything (view, update, delete all comments)
CREATE POLICY "Admins full access"
  ON public.comments 
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Verify the policies were created correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'comments'
ORDER BY policyname;
