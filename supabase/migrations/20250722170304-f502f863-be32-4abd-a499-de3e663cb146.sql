
-- Remove the buddys_comments field from author_bios table
ALTER TABLE public.author_bios 
DROP COLUMN IF EXISTS buddys_comments;

-- Add audio-related fields to the author_bios table to mirror story audio storage
ALTER TABLE public.author_bios 
ADD COLUMN bio_audio_url text,
ADD COLUMN bio_audio_generated_at timestamp with time zone,
ADD COLUMN bio_audio_segments integer DEFAULT 1,
ADD COLUMN bio_audio_duration_seconds integer;

-- Add comments for documentation
COMMENT ON COLUMN public.author_bios.bio_audio_url IS 'URL to the generated audio file for the biography';
COMMENT ON COLUMN public.author_bios.bio_audio_generated_at IS 'Timestamp when the bio audio was generated';
COMMENT ON COLUMN public.author_bios.bio_audio_segments IS 'Number of audio segments for the biography';
COMMENT ON COLUMN public.author_bios.bio_audio_duration_seconds IS 'Duration of the bio audio in seconds';
