-- Update any remaining stories with old categories to WebText
UPDATE public.stories 
SET category = 'WebText'
WHERE category NOT IN ('Fun', 'Life', 'North Pole', 'World Changers', 'WebText');