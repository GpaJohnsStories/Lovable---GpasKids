-- Create color_presets table
CREATE TABLE public.color_presets (
  id VARCHAR(1) PRIMARY KEY,
  name TEXT NOT NULL,
  box_border_color_name TEXT,
  box_border_color_hex VARCHAR(7),
  photo_border_color_name TEXT,
  photo_border_color_hex VARCHAR(7),
  background_color_name TEXT,
  background_color_hex VARCHAR(50),
  font_color_name TEXT,
  font_color_hex VARCHAR(7),
  pages TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.color_presets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view color presets" 
ON public.color_presets 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage color presets" 
ON public.color_presets 
FOR ALL 
USING (is_admin_safe())
WITH CHECK (is_admin_safe());

-- Insert hardcoded data from the admin reference page
INSERT INTO public.color_presets (id, name, box_border_color_name, box_border_color_hex, photo_border_color_name, photo_border_color_hex, background_color_name, background_color_hex, font_color_name, font_color_hex, pages) VALUES
('1', 'Orange', 'Border', '#F97316', 'Photo Border', '#F97316', 'Background', 'rgba(249, 115, 22, 0.2)', 'Font', '#333333', '/guide - SYS-GeA'),
('2', 'Green', 'Border', '#16a34a', 'Photo Border', '#16a34a', 'Background', 'rgba(22, 163, 74, 0.2)', 'Font', '#333333', '/guide - SYS-G1A'),
('3', 'Blue', 'Border', '#3b82f6', 'Photo Border', '#3b82f6', 'Background', 'rgba(59, 130, 246, 0.2)', 'Font', '#333333', '/guide - SYS-G3B'),
('4', 'Purple', 'Border', '#6366f1', 'Photo Border', '#6366f1', 'Background', 'rgba(99, 102, 241, 0.2)', 'Font', '#333333', '/privacy - SYS-PR3'),
('5', 'To be set', 'Border', '#9ca3af', 'Photo Border', '#9ca3af', 'Background', 'rgba(156, 163, 175, 0.2)', 'Font', '#333333', ''),
('6', 'To be set', 'Border', '#9ca3af', 'Photo Border', '#9ca3af', 'Background', 'rgba(156, 163, 175, 0.2)', 'Font', '#333333', ''),
('7', 'To be set', 'Border', '#9ca3af', 'Photo Border', '#9ca3af', 'Background', 'rgba(156, 163, 175, 0.2)', 'Font', '#333333', ''),
('8', 'To be set', 'Border', '#9ca3af', 'Photo Border', '#9ca3af', 'Background', 'rgba(156, 163, 175, 0.2)', 'Font', '#333333', '');

-- Add trigger for updated_at
CREATE TRIGGER update_color_presets_updated_at
BEFORE UPDATE ON public.color_presets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Remove the 8 color fields from stories table
ALTER TABLE public.stories 
DROP COLUMN IF EXISTS box_border_color_name,
DROP COLUMN IF EXISTS box_border_color_hex,
DROP COLUMN IF EXISTS photo_border_color_name,
DROP COLUMN IF EXISTS photo_border_color_hex,
DROP COLUMN IF EXISTS background_color_name,
DROP COLUMN IF EXISTS background_color_hex,
DROP COLUMN IF EXISTS title_font_color_name,
DROP COLUMN IF EXISTS title_font_color_hex;