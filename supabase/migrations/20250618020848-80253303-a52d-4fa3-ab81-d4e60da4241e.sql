
-- Let's check if there are any comments in the table at all
SELECT COUNT(*) as total_comments FROM public.comments;

-- Let's see all comments with their basic info
SELECT id, personal_id, subject, status, created_at 
FROM public.comments 
ORDER BY created_at DESC 
LIMIT 10;

-- Let's also check what RLS policies are currently active
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'comments';

-- Check if RLS is enabled on the comments table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'comments';
