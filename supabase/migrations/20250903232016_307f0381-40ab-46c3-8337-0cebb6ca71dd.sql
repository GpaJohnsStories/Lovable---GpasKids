-- First, delete all objects in the story-audio bucket
DELETE FROM storage.objects WHERE bucket_id = 'story-audio';

-- Clean up any storage prefixes referencing the story-audio bucket  
DELETE FROM storage.prefixes WHERE bucket_id = 'story-audio';

-- Then delete the bucket
DELETE FROM storage.buckets WHERE id = 'story-audio';

-- Recreate story-audio bucket with new structure
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'story-audio',
  'story-audio', 
  true,
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav']
);

-- Create RLS policies for the new story-audio bucket
-- Policy 1: Anyone can view/download audio files
CREATE POLICY "Anyone can view story audio files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'story-audio');

-- Policy 2: Only admins and trusted clients can upload audio files with strict naming
CREATE POLICY "Admins can upload story audio with strict naming"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'story-audio' 
  AND (public.is_admin_safe() OR public.is_trusted_client())
  AND name ~ '^[A-Z]{3}-[A-Z]{3}\.mp3$'
);

-- Policy 3: Only admins and trusted clients can update audio files
CREATE POLICY "Admins can update story audio files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'story-audio' 
  AND (public.is_admin_safe() OR public.is_trusted_client())
);

-- Policy 4: Only admins and trusted clients can delete audio files
CREATE POLICY "Admins can delete story audio files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'story-audio' 
  AND (public.is_admin_safe() OR public.is_trusted_client())
);