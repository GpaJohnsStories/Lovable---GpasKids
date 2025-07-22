
-- Add four new optional fields to the author_bios table
ALTER TABLE public.author_bios 
ADD COLUMN born_date DATE,
ADD COLUMN died_date DATE,
ADD COLUMN native_country_name TEXT,
ADD COLUMN native_language TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.author_bios.born_date IS 'Author birth date';
COMMENT ON COLUMN public.author_bios.died_date IS 'Author death date (if applicable)';
COMMENT ON COLUMN public.author_bios.native_country_name IS 'Author native country';
COMMENT ON COLUMN public.author_bios.native_language IS 'Author native language';
