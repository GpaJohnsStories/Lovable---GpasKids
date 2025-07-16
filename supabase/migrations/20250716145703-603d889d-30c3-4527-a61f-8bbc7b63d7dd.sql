-- First, add "WebText" to the story_category enum
ALTER TYPE story_category ADD VALUE 'WebText';

-- Then update all "System" categories to "WebText" in the stories table
UPDATE public.stories 
SET category = 'WebText' 
WHERE category = 'System';