-- Add color fields to stories table
ALTER TABLE public.stories 
ADD COLUMN box_border_color_name text,
ADD COLUMN box_border_color_hex varchar(7),
ADD COLUMN photo_border_color_name text,
ADD COLUMN photo_border_color_hex varchar(7),
ADD COLUMN background_color_name text NOT NULL DEFAULT 'Default',
ADD COLUMN background_color_hex varchar(9) NOT NULL DEFAULT '#FFFFFFFF',
ADD COLUMN title_font_color_name text,
ADD COLUMN title_font_color_hex varchar(7);

-- Add constraints to validate hex color formats
ALTER TABLE public.stories 
ADD CONSTRAINT check_box_border_hex_format 
CHECK (box_border_color_hex IS NULL OR box_border_color_hex ~ '^#[0-9A-Fa-f]{6}$'),
ADD CONSTRAINT check_photo_border_hex_format 
CHECK (photo_border_color_hex IS NULL OR photo_border_color_hex ~ '^#[0-9A-Fa-f]{6}$'),
ADD CONSTRAINT check_background_hex_format 
CHECK (background_color_hex ~ '^#[0-9A-Fa-f]{8}$'),
ADD CONSTRAINT check_title_font_hex_format 
CHECK (title_font_color_hex IS NULL OR title_font_color_hex ~ '^#[0-9A-Fa-f]{6}$');