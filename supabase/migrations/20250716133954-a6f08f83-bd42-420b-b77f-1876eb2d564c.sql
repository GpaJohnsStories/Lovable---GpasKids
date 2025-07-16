-- Add copyright status field to stories table
ALTER TABLE public.stories 
ADD COLUMN copyright_status character(1) DEFAULT 'P' CHECK (copyright_status IN ('P', 'O', 'S'));

-- Add comment for documentation
COMMENT ON COLUMN public.stories.copyright_status IS 'Copyright status: P=Protected Full Copyright, O=Open No Copyright, S=Limited Sharing Gpa Johns Copyright';