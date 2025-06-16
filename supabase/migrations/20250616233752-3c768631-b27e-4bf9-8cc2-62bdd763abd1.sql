
-- Add published column to stories table
ALTER TABLE public.stories 
ADD COLUMN published CHAR(1) NOT NULL DEFAULT 'N' CHECK (published IN ('Y', 'N'));

-- Update existing stories to be published by default (you can change this if needed)
UPDATE public.stories SET published = 'Y';
