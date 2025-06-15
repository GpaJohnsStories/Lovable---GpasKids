
-- Create a storage bucket for story photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('story-photos', 'story-photos', true);

-- Create storage policies to allow public access for reading
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'story-photos');

-- Create policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload story photos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'story-photos');

-- Create policy to allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update story photos" ON storage.objects 
FOR UPDATE USING (bucket_id = 'story-photos');

-- Create policy to allow authenticated users to delete story photos
CREATE POLICY "Authenticated users can delete story photos" ON storage.objects 
FOR DELETE USING (bucket_id = 'story-photos');
