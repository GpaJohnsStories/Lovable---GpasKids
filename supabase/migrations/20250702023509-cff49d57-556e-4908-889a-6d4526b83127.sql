-- STAGE 2: Secure Storage Buckets
-- Make storage buckets more secure while maintaining functionality

-- Update storage bucket policies to be more restrictive
-- First, let's see what policies exist
-- (Note: This will fail if policies don't exist, but that's okay)

-- Drop existing policies on story-photos bucket if they exist
DROP POLICY IF EXISTS "Anyone can view story photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload story photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Drop existing policies on story-videos bucket if they exist  
DROP POLICY IF EXISTS "Anyone can view story videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload story videos" ON storage.objects;

-- Create more secure policies for story-photos bucket
CREATE POLICY "Public can view story photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'story-photos');

CREATE POLICY "Admins can upload story photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'story-photos' AND public.is_admin_safe());

CREATE POLICY "Admins can update story photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'story-photos' AND public.is_admin_safe())
  WITH CHECK (bucket_id = 'story-photos' AND public.is_admin_safe());

CREATE POLICY "Admins can delete story photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'story-photos' AND public.is_admin_safe());

-- Create more secure policies for story-videos bucket
CREATE POLICY "Public can view story videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'story-videos');

CREATE POLICY "Admins can upload story videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'story-videos' AND public.is_admin_safe());

CREATE POLICY "Admins can update story videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'story-videos' AND public.is_admin_safe())
  WITH CHECK (bucket_id = 'story-videos' AND public.is_admin_safe());

CREATE POLICY "Admins can delete story videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'story-videos' AND public.is_admin_safe());