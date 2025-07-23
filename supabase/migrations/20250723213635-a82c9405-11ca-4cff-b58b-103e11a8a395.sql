-- Delete the correct icon entries that are actually in the database
DELETE FROM public.icon_library 
WHERE icon_code IN ('ICO_BK1', 'ICO-BK2');