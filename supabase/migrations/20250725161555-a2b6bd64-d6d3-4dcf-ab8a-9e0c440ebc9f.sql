-- Remove the ICO-N2K icon from the icon library
DELETE FROM icon_library WHERE icon_code = 'ICO-N2K';

-- Remove the file from storage
SELECT storage.delete_object('icons', 'ICO-N2K.png');