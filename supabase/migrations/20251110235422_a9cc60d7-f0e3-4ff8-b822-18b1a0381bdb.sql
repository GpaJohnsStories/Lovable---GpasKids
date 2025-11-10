-- Create function to increment story read count
-- This bypasses RLS so public users can increment read counts
CREATE OR REPLACE FUNCTION public.increment_story_read_count(story_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.stories 
  SET read_count = COALESCE(read_count, 0) + 1
  WHERE id = story_uuid;
END;
$$;