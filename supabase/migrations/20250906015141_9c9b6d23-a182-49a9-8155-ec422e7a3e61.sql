
-- 1) Add the page_path column to stories
ALTER TABLE public.stories
ADD COLUMN IF NOT EXISTS page_path text;

COMMENT ON COLUMN public.stories.page_path IS
'Canonical route where this WebText is used (e.g., /library). Optional; null for multi-use blocks or non-WebText.';

-- 2) Backfill known WebText story codes to their current page locations

-- Home page (/)
UPDATE public.stories
SET page_path = '/'
WHERE category = 'WebText'
  AND story_code IN ('SYS-WEL','SYS-LAA','SYS-CEM','SYS-CES');

-- Library (/library)
UPDATE public.stories
SET page_path = '/library'
WHERE category = 'WebText'
  AND story_code IN ('SYS-LIB','HLP-LIB');

-- About (/about)
UPDATE public.stories
SET page_path = '/about'
WHERE category = 'WebText'
  AND story_code IN ('SYS-AGJ','SYS-BDY','SYS-THY');

-- Guide (/guide)
UPDATE public.stories
SET page_path = '/guide'
WHERE category = 'WebText'
  AND story_code IN ('SYS-G1A','SYS-G2A','SYS-G3A','SYS-G3B','SYS-G6A','SYS-G7A');

-- Help Grandpa John (/help-gpa)
UPDATE public.stories
SET page_path = '/help-gpa'
WHERE category = 'WebText'
  AND story_code IN ('SYS-HGJ','SYS-CGJ','SYS-CCR','SYS-CCW');

-- Orange Gang Photos (/orange-gang-photos)
UPDATE public.stories
SET page_path = '/orange-gang-photos'
WHERE category = 'WebText'
  AND story_code IN ('SYS-OSP');

-- Writing (/writing)
UPDATE public.stories
SET page_path = '/writing'
WHERE category = 'WebText'
  AND story_code IN ('SYS-CPR','SYS-CP2');

-- Privacy (/privacy)
UPDATE public.stories
SET page_path = '/privacy'
WHERE category = 'WebText'
  AND story_code IN ('SYS-P2Y','SYS-PR1','SYS-PR2','SYS-PR3','SYS-PR4','SYS-PR4A','SYS-PR5','SYS-PR6','SYS-PR7');

-- Story / Print context (/story)
UPDATE public.stories
SET page_path = '/story'
WHERE category = 'WebText'
  AND story_code IN ('PRT-COF','PRT-CRO');

-- Fallbacks (optional): if you want a default for any WebText with NULL page_path,
-- uncomment the line below (or we can leave them NULL to fill later).
-- UPDATE public.stories SET page_path = '/' WHERE category = 'WebText' AND page_path IS NULL;

-- 3) Helpful index for sorting/filtering by page_path
CREATE INDEX IF NOT EXISTS stories_page_path_idx
ON public.stories (page_path);
