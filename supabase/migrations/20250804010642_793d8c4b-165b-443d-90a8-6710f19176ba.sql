-- Remove unused categories from the story_category enum
-- First, create a new enum without the unused categories
CREATE TYPE story_category_new AS ENUM ('Fun', 'Life', 'North Pole', 'World Changers', 'WebText');

-- Update the stories table to use the new enum
ALTER TABLE public.stories 
ALTER COLUMN category TYPE story_category_new 
USING category::text::story_category_new;

-- Drop the old enum and rename the new one
DROP TYPE story_category;
ALTER TYPE story_category_new RENAME TO story_category;