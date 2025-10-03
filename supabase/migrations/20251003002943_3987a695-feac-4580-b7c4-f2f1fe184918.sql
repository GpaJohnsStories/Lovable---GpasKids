-- Add color_preset_id column to stories table
ALTER TABLE public.stories 
ADD COLUMN color_preset_id character varying REFERENCES public.color_presets(id);

-- Add index for better query performance
CREATE INDEX idx_stories_color_preset_id ON public.stories(color_preset_id);

-- Add comment explaining the column
COMMENT ON COLUMN public.stories.color_preset_id IS 'References color_presets.id (single alphanumeric character)';