-- Add photo_alt_text column to deployed_content table
ALTER TABLE public.deployed_content 
ADD COLUMN photo_alt_text text;