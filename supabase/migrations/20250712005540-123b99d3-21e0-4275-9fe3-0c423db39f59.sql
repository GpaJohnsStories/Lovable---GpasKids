-- Remove the old SYS-CC1 record since it's no longer needed
DELETE FROM public.stories 
WHERE story_code = 'SYS-CC1';