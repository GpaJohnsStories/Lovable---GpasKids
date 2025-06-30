
-- Add photo alt text columns to the stories table
ALTER TABLE public.stories 
ADD COLUMN photo_alt_1 text,
ADD COLUMN photo_alt_2 text,
ADD COLUMN photo_alt_3 text;
