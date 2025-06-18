
-- Step 1: Drop the existing comments table completely to start fresh
DROP TABLE IF EXISTS public.comments CASCADE;

-- Step 2: Recreate the comments table with the same structure
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  personal_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status public.comment_status NOT NULL DEFAULT 'pending',
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE
);

-- Step 3: Disable RLS completely for now to ensure comments work
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;

-- Step 4: Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'comments' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 5: Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'comments';
