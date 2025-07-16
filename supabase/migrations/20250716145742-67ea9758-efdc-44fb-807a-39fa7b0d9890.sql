-- Update all "System" categories to "WebText" in the stories table
UPDATE public.stories 
SET category = 'WebText' 
WHERE category = 'System';