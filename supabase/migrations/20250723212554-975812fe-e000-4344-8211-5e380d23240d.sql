-- Phase 2: Remove database components for menu buttons
-- Drop the menu tables and related policies

-- Drop the foreign key constraint first
ALTER TABLE public.menu_subitems DROP CONSTRAINT IF EXISTS menu_subitems_parent_button_code_fkey;

-- Drop the tables
DROP TABLE IF EXISTS public.menu_subitems;
DROP TABLE IF EXISTS public.menu_buttons;

-- Drop the storage bucket for menu icons
DELETE FROM storage.buckets WHERE id = 'menu-icons';