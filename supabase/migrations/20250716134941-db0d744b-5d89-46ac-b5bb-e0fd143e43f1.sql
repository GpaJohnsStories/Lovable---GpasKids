-- Set all System category stories to copyright status ©
UPDATE public.stories 
SET copyright_status = '©' 
WHERE category = 'System';