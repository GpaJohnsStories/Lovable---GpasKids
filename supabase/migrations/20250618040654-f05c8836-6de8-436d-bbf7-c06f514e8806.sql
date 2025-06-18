
-- Delete all stories except Helen Keller and Francis Scott Key
DELETE FROM public.stories 
WHERE title NOT IN (
  'Helen Keller — An Inspiring Life',
  'Francis Scott Key — The Reluctant Patriot'
);

-- Also delete any stories that might have slight variations in title or are obvious test data
DELETE FROM public.stories 
WHERE 
  -- Remove any stories with common test patterns
  (title ILIKE '%test%' OR title ILIKE '%sample%' OR title ILIKE '%dummy%')
  OR
  -- Remove stories with common test author names
  (author IN ('Test Author', 'Sample Author', 'John Doe', 'Jane Doe'))
  OR
  -- Remove stories with test story codes
  (story_code ILIKE 'TEST%' OR story_code ILIKE 'SAMPLE%' OR story_code ILIKE 'DEMO%')
  OR
  -- Remove any unpublished stories that aren't our two main stories
  (published = 'N' AND title NOT IN (
    'Helen Keller — An Inspiring Life',
    'Francis Scott Key — The Reluctant Patriot'
  ));
