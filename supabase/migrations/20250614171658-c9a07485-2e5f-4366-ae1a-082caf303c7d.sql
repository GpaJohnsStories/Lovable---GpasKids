
-- Fix the search path issue for the increment_story_read_count function
CREATE OR REPLACE FUNCTION public.increment_story_read_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    UPDATE public.stories 
    SET read_count = read_count + 1 
    WHERE id = NEW.story_id;
    RETURN NEW;
END;
$function$
