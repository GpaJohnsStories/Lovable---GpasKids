-- Update icon_code for priority icons to match file_path format
UPDATE icon_library 
SET icon_code = REPLACE(icon_code, 'ICO-', '!CO-') 
WHERE file_path LIKE '!CO-%';