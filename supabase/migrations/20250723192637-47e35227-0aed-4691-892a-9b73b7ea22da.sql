-- Add new fields for enhanced menu button functionality
ALTER TABLE public.menu_buttons 
ADD COLUMN button_width integer DEFAULT 60,
ADD COLUMN button_height integer DEFAULT 60,
ADD COLUMN top_color text DEFAULT '#3B82F6',
ADD COLUMN bottom_color text DEFAULT '#3B82F6',
ADD COLUMN button_shape text DEFAULT 'button';

-- Remove the old button_size field
ALTER TABLE public.menu_buttons 
DROP COLUMN button_size;

-- Update existing buttons to use new color system
UPDATE public.menu_buttons 
SET top_color = '#3B82F6', bottom_color = '#3B82F6' 
WHERE top_color IS NULL;