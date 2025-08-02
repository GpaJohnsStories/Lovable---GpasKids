-- Upload missing menu icons to storage bucket
-- Note: This creates placeholder entries - actual files need to be uploaded via the Supabase dashboard

-- Ensure the icons bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('icons', 'icons', true) 
ON CONFLICT (id) DO NOTHING;

-- Create policies for public access to icons
CREATE POLICY IF NOT EXISTS "Public can view icons" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'icons');

CREATE POLICY IF NOT EXISTS "Public can download icons" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'icons');

-- Allow authenticated users to upload icons (for admin use)
CREATE POLICY IF NOT EXISTS "Authenticated users can upload icons" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'icons' AND auth.role() = 'authenticated');