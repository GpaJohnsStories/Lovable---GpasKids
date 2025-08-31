-- Create private backups storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('backups', 'backups', false);

-- Create RLS policies for backups bucket (admin-only access)
CREATE POLICY "Only admins can view backup files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'backups' AND is_admin_safe());

CREATE POLICY "Only admins can upload backup files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'backups' AND is_admin_safe());

CREATE POLICY "Only admins can update backup files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'backups' AND is_admin_safe());

CREATE POLICY "Only admins can delete backup files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'backups' AND is_admin_safe());