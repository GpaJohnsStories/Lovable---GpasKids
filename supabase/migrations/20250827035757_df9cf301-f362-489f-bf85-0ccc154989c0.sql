-- Add publication_status_code column to stories table
ALTER TABLE public.stories 
ADD COLUMN publication_status_code SMALLINT NOT NULL DEFAULT 5;

-- Backfill existing data based on published column
UPDATE public.stories 
SET publication_status_code = CASE 
  WHEN published = 'Y' THEN 2
  WHEN published = 'N' THEN 4
  ELSE 5
END;

-- Update RLS policy for public viewing to use new status codes
DROP POLICY IF EXISTS "Public can view published stories" ON public.stories;

CREATE POLICY "Public can view published stories" 
ON public.stories 
FOR SELECT 
USING (publication_status_code IN (0, 1));