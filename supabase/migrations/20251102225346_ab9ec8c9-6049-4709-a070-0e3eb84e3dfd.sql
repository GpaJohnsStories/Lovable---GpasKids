-- Add photo_link_4 and photo_alt_4 columns to stories table
ALTER TABLE public.stories
ADD COLUMN IF NOT EXISTS photo_link_4 text,
ADD COLUMN IF NOT EXISTS photo_alt_4 text;