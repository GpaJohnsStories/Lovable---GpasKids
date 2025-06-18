
-- Delete all test/sample stories from the database
-- This will remove any stories that might be test data
DELETE FROM public.stories 
WHERE title IN (
  'Grandpa''s Old Toolbox',
  'The Christmas Star', 
  'The Little Teacher',
  'The Giggling Cookies',
  'The Day I Lost My Voice',
  'Santa''s Secret Helper',
  'The Boy Who Planted Hope'
) OR story_code LIKE 'TEST%' OR story_code LIKE 'SAMPLE%';

-- Also delete any stories that might be obvious test data based on author names
DELETE FROM public.stories 
WHERE author IN (
  'Michael Chen',
  'Sarah Williams', 
  'David Rodriguez',
  'Lisa Park',
  'James Foster',
  'Maria Garcia',
  'Robert Kim'
);
