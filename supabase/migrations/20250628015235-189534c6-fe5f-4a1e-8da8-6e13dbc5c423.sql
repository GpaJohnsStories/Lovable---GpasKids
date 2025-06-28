
-- Create a storage bucket for story videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'story-videos',
  'story-videos',
  true,
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
);

-- Create RLS policies for the story-videos bucket
CREATE POLICY "Allow public access to story videos" ON storage.objects
FOR SELECT USING (bucket_id = 'story-videos');

CREATE POLICY "Allow authenticated users to upload story videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'story-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update story videos" ON storage.objects
FOR UPDATE USING (bucket_id = 'story-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete story videos" ON storage.objects
FOR DELETE USING (bucket_id = 'story-videos' AND auth.role() = 'authenticated');

-- Add video_url column to stories table
ALTER TABLE public.stories 
ADD COLUMN video_url TEXT;
