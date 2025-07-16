-- Update copyright status field to use copyright symbol instead of P
ALTER TABLE public.stories 
DROP CONSTRAINT IF EXISTS stories_copyright_status_check;

ALTER TABLE public.stories 
ADD CONSTRAINT stories_copyright_status_check 
CHECK (copyright_status IN ('©', 'O', 'S'));

-- Update default value to copyright symbol
ALTER TABLE public.stories 
ALTER COLUMN copyright_status SET DEFAULT '©';

-- Update existing 'P' values to '©'
UPDATE public.stories 
SET copyright_status = '©' 
WHERE copyright_status = 'P' OR copyright_status IS NULL;

-- Update comment for documentation
COMMENT ON COLUMN public.stories.copyright_status IS 'Copyright status: ©=Full Copyright, O=Open No Copyright, S=Limited Sharing Gpa Johns Copyright';