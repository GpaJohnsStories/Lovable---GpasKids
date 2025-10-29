-- Create the site enum type
CREATE TYPE public.site_identifier AS ENUM ('KIDS', 'FAITH', 'SHOP', 'ADMIN');

-- Add site column to stories table
ALTER TABLE public.stories 
ADD COLUMN site public.site_identifier NOT NULL DEFAULT 'KIDS';

-- Add site column to color_presets table
ALTER TABLE public.color_presets 
ADD COLUMN site public.site_identifier NOT NULL DEFAULT 'KIDS';

-- Add site column to author_bios table
ALTER TABLE public.author_bios 
ADD COLUMN site public.site_identifier NOT NULL DEFAULT 'KIDS';

-- Add site column to app_settings table
ALTER TABLE public.app_settings 
ADD COLUMN site public.site_identifier NOT NULL DEFAULT 'KIDS';

-- Add indexes for efficient site filtering
CREATE INDEX idx_stories_site ON public.stories(site);
CREATE INDEX idx_color_presets_site ON public.color_presets(site);
CREATE INDEX idx_author_bios_site ON public.author_bios(site);
CREATE INDEX idx_app_settings_site ON public.app_settings(site);

-- Composite index for stories (most queried table)
CREATE INDEX idx_stories_site_publication ON public.stories(site, publication_status_code);