
-- Disable RLS completely on comments table, just like stories table
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies since we're disabling RLS
DROP POLICY IF EXISTS "Allow all inserts" ON public.comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;  
DROP POLICY IF EXISTS "Admins full access" ON public.comments;
DROP POLICY IF EXISTS "Public can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can view all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can update all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can delete all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can do everything" ON public.comments;

-- Verify RLS is disabled (should show 'f' for rowsecurity)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('comments', 'stories')
ORDER BY tablename;
