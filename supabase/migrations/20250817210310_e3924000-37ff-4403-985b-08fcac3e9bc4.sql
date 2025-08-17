
-- 1) Add optional attachment fields to comments
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS attachment_bucket text,
  ADD COLUMN IF NOT EXISTS attachment_path text,
  ADD COLUMN IF NOT EXISTS attachment_mime text,
  ADD COLUMN IF NOT EXISTS attachment_caption text;

-- 2) Create storage buckets for Orange Shirt Gang photos
-- Public bucket for approved photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('orange-gang', 'orange-gang', true)
ON CONFLICT (id) DO NOTHING;

-- Private bucket for pending photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('orange-gang-pending', 'orange-gang-pending', false)
ON CONFLICT (id) DO NOTHING;

-- 3) Storage policies

-- Allow public read of ONLY approved photos in the public bucket
CREATE POLICY "Public can view approved orange gang photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'orange-gang'
  AND name LIKE 'approved/%'
);

-- Allow admins to view any object in the public bucket
CREATE POLICY "Admins can view any orange gang photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'orange-gang'
  AND is_admin()
);

-- Allow admins to manage (insert/update/delete) any object in the public bucket
CREATE POLICY "Admins can manage orange gang photos"
ON storage.objects FOR ALL
USING (
  bucket_id = 'orange-gang'
  AND is_admin()
)
WITH CHECK (
  bucket_id = 'orange-gang'
  AND is_admin()
);

-- Pending bucket: only admins can read
CREATE POLICY "Admins can view pending orange gang photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'orange-gang-pending'
  AND is_admin()
);

-- Pending bucket: only admins can manage
CREATE POLICY "Admins can manage pending orange gang photos"
ON storage.objects FOR ALL
USING (
  bucket_id = 'orange-gang-pending'
  AND is_admin()
)
WITH CHECK (
  bucket_id = 'orange-gang-pending'
  AND is_admin()
);
