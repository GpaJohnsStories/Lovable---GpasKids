
-- Add columns to track votes for each story
ALTER TABLE public.stories 
ADD COLUMN thumbs_up_count integer NOT NULL DEFAULT 0,
ADD COLUMN thumbs_down_count integer NOT NULL DEFAULT 0,
ADD COLUMN ok_count integer NOT NULL DEFAULT 0;

-- Create a table to track individual votes to prevent duplicate voting
CREATE TABLE public.story_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  ip_address inet,
  user_agent text,
  vote_type text NOT NULL CHECK (vote_type IN ('thumbs_up', 'thumbs_down', 'ok')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create an index for better performance when checking for existing votes
CREATE INDEX idx_story_votes_story_ip ON public.story_votes(story_id, ip_address);

-- Enable RLS on story_votes table (making it publicly readable since it's for anonymous voting)
ALTER TABLE public.story_votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read votes (for checking duplicates)
CREATE POLICY "Anyone can view story votes" 
  ON public.story_votes 
  FOR SELECT 
  TO public
  USING (true);

-- Allow anyone to insert votes
CREATE POLICY "Anyone can create story votes" 
  ON public.story_votes 
  FOR INSERT 
  TO public
  WITH CHECK (true);
