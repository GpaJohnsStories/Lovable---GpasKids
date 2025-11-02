-- Remove google_drive_link column from stories table
-- This field was only used for text content upload which is being removed
ALTER TABLE public.stories 
DROP COLUMN IF EXISTS google_drive_link;