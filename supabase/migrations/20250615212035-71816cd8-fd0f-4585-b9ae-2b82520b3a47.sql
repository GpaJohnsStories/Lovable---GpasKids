
-- Drop old RLS policies that depend on `is_approved` column.
DROP POLICY IF EXISTS "Anyone can read approved comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.comments;

-- This block creates the enum and adds/updates columns, assuming the previous migration was rolled back.
DO $$
BEGIN
    -- Create the enum type if it doesn't exist.
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comment_status') THEN
        CREATE TYPE public.comment_status AS ENUM ('pending', 'approved', 'rejected', 'archived');
    END IF;

    -- Add 'status' column if it doesn't exist.
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='status' AND table_schema='public') THEN
        ALTER TABLE public.comments ADD COLUMN status public.comment_status NOT NULL DEFAULT 'pending';
    END IF;
    
    -- Update 'status' based on 'is_approved' if 'is_approved' exists.
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='is_approved' AND table_schema='public') THEN
        UPDATE public.comments SET status = 'approved' WHERE is_approved = true;

        -- Now drop 'is_approved' column.
        ALTER TABLE public.comments DROP COLUMN is_approved;
    END IF;
END;
$$;

-- Disable RLS on comments to allow admin functionality, similar to the 'stories' table.
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
