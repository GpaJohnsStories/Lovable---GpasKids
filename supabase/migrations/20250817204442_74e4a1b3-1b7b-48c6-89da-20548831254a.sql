-- Fix search path for existing functions that need it
CREATE OR REPLACE FUNCTION public.update_reading_time()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.reading_time_minutes := calculate_reading_time(NEW.content);
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_story_read_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.stories 
    SET read_count = read_count + 1 
    WHERE id = NEW.story_id;
    RETURN NEW;
END;
$$;