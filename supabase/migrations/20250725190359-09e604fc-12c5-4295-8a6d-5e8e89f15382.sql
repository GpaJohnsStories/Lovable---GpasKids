-- Delete the ICO-N2K entry from icon_library table to allow proper re-upload
DELETE FROM public.icon_library 
WHERE icon_code = 'ICO-N2K';