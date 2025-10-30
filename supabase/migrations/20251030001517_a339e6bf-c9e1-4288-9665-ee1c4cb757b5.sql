-- Add font_name column to color_presets table
ALTER TABLE public.color_presets 
ADD COLUMN font_name text;

COMMENT ON COLUMN public.color_presets.font_name IS 'Font family name: Kalam, Georgia, or Lexend';