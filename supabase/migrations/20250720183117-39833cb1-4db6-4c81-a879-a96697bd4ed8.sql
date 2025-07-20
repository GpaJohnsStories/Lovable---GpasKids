
-- Add reading_time_minutes column to stories table
ALTER TABLE public.stories 
ADD COLUMN reading_time_minutes integer DEFAULT 1;

-- Create a function to calculate reading time from content
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text text)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    word_count integer;
    reading_time integer;
BEGIN
    -- Count words (split by whitespace and filter out empty strings)
    SELECT array_length(
        array_remove(
            string_to_array(regexp_replace(COALESCE(content_text, ''), '[^\w\s]', ' ', 'g'), ' '), 
            ''
        ), 
        1
    ) INTO word_count;
    
    -- Calculate reading time (assuming 200 words per minute, minimum 1 minute)
    reading_time := GREATEST(1, CEIL(COALESCE(word_count, 0) / 200.0));
    
    RETURN reading_time;
END;
$$;

-- Create a trigger function to automatically calculate reading time on insert/update
CREATE OR REPLACE FUNCTION update_reading_time()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.reading_time_minutes := calculate_reading_time(NEW.content);
    RETURN NEW;
END;
$$;

-- Create trigger to automatically update reading time
CREATE TRIGGER stories_reading_time_trigger
    BEFORE INSERT OR UPDATE OF content ON public.stories
    FOR EACH ROW
    EXECUTE FUNCTION update_reading_time();

-- Populate reading_time_minutes for existing stories
UPDATE public.stories 
SET reading_time_minutes = calculate_reading_time(content)
WHERE reading_time_minutes IS NULL OR reading_time_minutes = 1;
