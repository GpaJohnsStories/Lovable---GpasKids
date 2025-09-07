-- Add unique constraint on story_code to prevent duplicates
ALTER TABLE public.stories ADD CONSTRAINT stories_story_code_unique UNIQUE (story_code);

-- Create stricter storage policy for story-photos bucket to ensure photos only go to valid story code folders
CREATE POLICY "Photos must be uploaded to valid story code folders" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'story-photos' AND
  -- Ensure the folder name matches an existing story_code
  EXISTS (
    SELECT 1 FROM public.stories 
    WHERE story_code = split_part(name, '/', 1)
  )
);

-- Allow admins to manage story photos
CREATE POLICY "Admins can manage story photos" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'story-photos' AND public.is_admin_safe())
WITH CHECK (bucket_id = 'story-photos' AND public.is_admin_safe());

-- Allow public to view story photos (since they're in published stories)
CREATE POLICY "Public can view story photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'story-photos');