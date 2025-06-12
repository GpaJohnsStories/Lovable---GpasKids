
-- Add a content field to store the full story text with formatting
ALTER TABLE public.stories 
ADD COLUMN content TEXT;
