
-- Add photo fields to the author_bios table
ALTER TABLE public.author_bios 
ADD COLUMN photo_url text,
ADD COLUMN photo_alt text;

-- Add comments for documentation
COMMENT ON COLUMN public.author_bios.photo_url IS 'URL to the author photo';
COMMENT ON COLUMN public.author_bios.photo_alt IS 'Alt text for the author photo';
