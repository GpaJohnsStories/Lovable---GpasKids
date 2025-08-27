
-- Add a column to store video duration (in seconds) on stories
ALTER TABLE public.stories
ADD COLUMN IF NOT EXISTS video_duration_seconds integer;
