
-- Add "BioText" to the story_category enum
ALTER TYPE story_category ADD VALUE 'BioText';

-- Add bio-specific columns to the stories table
ALTER TABLE public.stories 
ADD COLUMN bio_subject_name TEXT,
ADD COLUMN born_date DATE,
ADD COLUMN died_date DATE,
ADD COLUMN native_country TEXT,
ADD COLUMN native_language TEXT;

-- Add comments to document the new columns
COMMENT ON COLUMN public.stories.bio_subject_name IS 'The person this biography is about (only used when category = BioText)';
COMMENT ON COLUMN public.stories.born_date IS 'Birth date of the biography subject (only used when category = BioText)';
COMMENT ON COLUMN public.stories.died_date IS 'Death date of the biography subject (only used when category = BioText)';
COMMENT ON COLUMN public.stories.native_country IS 'Native country of the biography subject (only used when category = BioText)';
COMMENT ON COLUMN public.stories.native_language IS 'Native language of the biography subject (only used when category = BioText)';
