-- Check storage.objects table structure to see available columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'storage' 
AND table_name = 'objects' 
ORDER BY ordinal_position;