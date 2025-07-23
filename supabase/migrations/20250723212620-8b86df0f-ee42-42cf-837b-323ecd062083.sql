-- Phase 2: Remove database components for menu buttons (fixed)
-- First remove all objects from the menu-icons bucket
DELETE FROM storage.objects WHERE bucket_id = 'menu-icons';

-- Drop the foreign key constraint first
ALTER TABLE public.menu_subitems DROP CONSTRAINT IF EXISTS menu_subitems_parent_button_code_fkey;

-- Drop the tables
DROP TABLE IF EXISTS public.menu_subitems;
DROP TABLE IF EXISTS public.menu_buttons;

-- Now drop the storage bucket
DELETE FROM storage.buckets WHERE id = 'menu-icons';