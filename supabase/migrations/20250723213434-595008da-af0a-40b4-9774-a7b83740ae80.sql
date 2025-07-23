-- Delete the duplicate icon entries that have no actual icon files
DELETE FROM public.icon_library 
WHERE icon_code IN ('ICO_Bk1', 'ICO_BK2');