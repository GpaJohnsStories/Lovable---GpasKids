
-- Remove IP address and user agent columns from story_votes table
ALTER TABLE public.story_votes 
DROP COLUMN IF EXISTS ip_address,
DROP COLUMN IF EXISTS user_agent;

-- Drop the index that was based on IP address
DROP INDEX IF EXISTS idx_story_votes_story_ip;

-- Update the RLS policies to be simpler without IP-based restrictions
DROP POLICY IF EXISTS "Anyone can view story votes" ON public.story_votes;
DROP POLICY IF EXISTS "Anyone can create story votes" ON public.story_votes;

-- Create new simpler policies
CREATE POLICY "Anyone can view story votes" 
  ON public.story_votes 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Anyone can create story votes" 
  ON public.story_votes 
  FOR INSERT 
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update story votes" 
  ON public.story_votes 
  FOR UPDATE 
  TO public
  USING (true);
