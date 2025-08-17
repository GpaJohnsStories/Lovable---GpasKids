-- Fix search path for the calculate_reading_time function
CREATE OR REPLACE FUNCTION public.calculate_reading_time(content_text text)
RETURNS integer
LANGUAGE plpgsql
SET search_path = public
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