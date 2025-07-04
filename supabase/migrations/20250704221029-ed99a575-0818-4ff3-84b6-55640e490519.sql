-- Add AI voice fields to stories table
ALTER TABLE public.stories 
ADD COLUMN ai_voice_name TEXT DEFAULT 'Nova',
ADD COLUMN ai_voice_model TEXT DEFAULT 'tts-1';