-- Recreate the menu-icons bucket for general icon management
-- (not related to menu buttons, but for general icon library)

-- Create the icons storage bucket  
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'icons',
  'icons', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
);

-- Create RLS policies for the icons bucket
CREATE POLICY "Anyone can view icons" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'icons');

CREATE POLICY "Admins can upload icons" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'icons' AND is_admin_safe());

CREATE POLICY "Admins can update icons" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'icons' AND is_admin_safe());

CREATE POLICY "Admins can delete icons" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'icons' AND is_admin_safe());