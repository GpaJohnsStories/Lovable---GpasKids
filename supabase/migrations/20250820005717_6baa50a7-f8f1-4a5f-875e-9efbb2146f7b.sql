
-- Remove personally identifying columns from profiles
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS avatar_url,
  DROP COLUMN IF EXISTS display_name;
