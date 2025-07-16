-- Remove the constraint temporarily
ALTER TABLE public.stories 
DROP CONSTRAINT IF EXISTS stories_copyright_status_check;

-- Update all existing values to valid ones
UPDATE public.stories 
SET copyright_status = CASE 
  WHEN copyright_status = 'P' OR copyright_status IS NULL THEN '©'
  WHEN copyright_status = 'O' THEN 'O'
  WHEN copyright_status = 'S' THEN 'S'
  ELSE '©'
END;

-- Now add the constraint with copyright symbol
ALTER TABLE public.stories 
ADD CONSTRAINT stories_copyright_status_check 
CHECK (copyright_status IN ('©', 'O', 'S'));

-- Update default value to copyright symbol
ALTER TABLE public.stories 
ALTER COLUMN copyright_status SET DEFAULT '©';

-- Update comment for documentation
COMMENT ON COLUMN public.stories.copyright_status IS 'Copyright status: ©=Full Copyright, O=Open No Copyright, S=Limited Sharing Gpa Johns Copyright';