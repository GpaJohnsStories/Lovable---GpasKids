-- Drop existing story-audio related policies
DROP POLICY IF EXISTS "Anyone can view story audio files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload story audio files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload story audio with strict naming" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update story audio files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete story audio files" ON storage.objects;

-- Delete all objects in the story-audio bucket
DELETE FROM storage.objects WHERE bucket_id = 'story-audio';

-- Clean up any storage prefixes referencing the story-audio bucket  
DELETE FROM storage.prefixes WHERE bucket_id = 'story-audio';

-- Delete the bucket
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

-- Create NEW RLS policies for the recreated story-audio bucket with strict naming
CREATE POLICY "Public can view story audio files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'story-audio');

CREATE POLICY "Strict story audio upload policy"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'story-audio' 
  AND (public.is_admin_safe() OR public.is_trusted_client())
  AND name ~ '^[A-Z]{3}-[A-Z]{3}\.mp3$'
);

CREATE POLICY "Admins can modify story audio files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'story-audio' 
  AND (public.is_admin_safe() OR public.is_trusted_client())
);

CREATE POLICY "Admins can remove story audio files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'story-audio' 
  AND (public.is_admin_safe() OR public.is_trusted_client())
);