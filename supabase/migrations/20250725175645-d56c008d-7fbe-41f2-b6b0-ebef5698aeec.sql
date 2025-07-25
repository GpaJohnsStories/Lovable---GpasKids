-- Delete ICO_BK1 from icon library
DELETE FROM public.icon_library WHERE icon_code = 'ICO_BK1';

-- Delete the associated file from storage bucket
DELETE FROM storage.objects WHERE bucket_id = 'icons' AND name = 'ICO_BK1.png';