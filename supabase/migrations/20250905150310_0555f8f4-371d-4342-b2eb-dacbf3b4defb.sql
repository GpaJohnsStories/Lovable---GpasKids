
-- 1) Drop functions that depend on tables we will remove
DROP FUNCTION IF EXISTS public.get_public_orange_gang_photos() CASCADE;
DROP FUNCTION IF EXISTS public.get_public_approved_comments() CASCADE;
DROP FUNCTION IF EXISTS public.get_public_approved_comment_by_id(comment_id uuid) CASCADE;
DROP FUNCTION IF EXISTS public.check_personal_id_exists(p_personal_id text) CASCADE;

-- Nickname/personal ID related functions
DROP FUNCTION IF EXISTS public.get_nickname_pepper() CASCADE;
DROP FUNCTION IF EXISTS public.derive_nickname_key(personal_id text) CASCADE;
DROP FUNCTION IF EXISTS public.derive_personal_id_hash(personal_id text) CASCADE;
DROP FUNCTION IF EXISTS public.get_or_create_nickname(personal_id text, desired_nickname text) CASCADE;
DROP FUNCTION IF EXISTS public.update_nickname(personal_id text, new_nickname text) CASCADE;
DROP FUNCTION IF EXISTS public.get_nickname_by_personal_id(personal_id text) CASCADE;

-- 2) Drop tables (also drops their RLS policies)
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.used_personal_ids CASCADE;
DROP TABLE IF EXISTS public.friend_names CASCADE;

-- 3) Drop the comment status enum type if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comment_status') THEN
    DROP TYPE public.comment_status CASCADE;
  END IF;
END
$$;
