
-- Step 1: Standardize on publication_status_code and remove legacy "published" column

-- 1) Set all publication_status_code values to 1
UPDATE public.stories
SET publication_status_code = 1
WHERE publication_status_code IS DISTINCT FROM 1;

-- 2) Update RLS policies that referenced "published" to use publication_status_code IN (0,1)

-- story_reads: Public can track reads for published stories
ALTER POLICY "Public can track reads for published stories"
ON public.story_reads
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.stories
    WHERE stories.id = story_reads.story_id
      AND stories.publication_status_code IN (0, 1)
  )
);

-- story_votes: Public can vote on published stories
ALTER POLICY "Public can vote on published stories"
ON public.story_votes
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.stories
    WHERE stories.id = story_votes.story_id
      AND stories.publication_status_code IN (0, 1)
  )
);

-- 3) Drop the legacy "published" column from stories
ALTER TABLE public.stories
DROP COLUMN IF EXISTS published;
