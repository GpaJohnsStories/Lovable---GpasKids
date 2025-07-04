-- Add audio storage fields to stories table
ALTER TABLE public.stories 
ADD COLUMN audio_url TEXT,
ADD COLUMN audio_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN audio_segments INTEGER DEFAULT 1,
ADD COLUMN audio_duration_seconds INTEGER;

-- Create storage bucket for story audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('story-audio', 'story-audio', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav']);

-- Create RLS policies for story audio bucket
CREATE POLICY "Anyone can view story audio files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'story-audio');

CREATE POLICY "Admins can upload story audio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'story-audio' AND is_admin_safe());

CREATE POLICY "Admins can update story audio files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'story-audio' AND is_admin_safe());

CREATE POLICY "Admins can delete story audio files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'story-audio' AND is_admin_safe());