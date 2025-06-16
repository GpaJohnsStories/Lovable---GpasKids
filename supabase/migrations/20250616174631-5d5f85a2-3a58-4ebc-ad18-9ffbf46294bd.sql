
-- Remove the author_email column from the comments table
ALTER TABLE public.comments DROP COLUMN IF EXISTS author_email;
