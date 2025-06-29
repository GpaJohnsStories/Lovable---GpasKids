
-- Update RLS policies for story-videos bucket to allow public uploads
-- This is appropriate for the children's website context where ease of use is prioritized

-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated users to upload story videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update story videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete story videos" ON storage.objects;

-- Create new policies that allow public access
CREATE POLICY "Allow public uploads to story videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'story-videos');

CREATE POLICY "Allow public updates to story videos" ON storage.objects
FOR UPDATE USING (bucket_id = 'story-videos');

CREATE POLICY "Allow public deletes of story videos" ON storage.objects
FOR DELETE USING (bucket_id = 'story-videos');
