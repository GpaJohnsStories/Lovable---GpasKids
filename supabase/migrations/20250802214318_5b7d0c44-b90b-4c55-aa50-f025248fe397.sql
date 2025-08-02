-- Ensure the icons bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('icons', 'icons', true) 
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public can view icons" ON storage.objects;
DROP POLICY IF EXISTS "Public can download icons" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload icons" ON storage.objects;

-- Create policies for public access to icons
CREATE POLICY "Public can view icons" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'icons');

-- Allow authenticated users to upload icons (for admin use)
CREATE POLICY "Authenticated users can upload icons" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'icons' AND auth.role() = 'authenticated');