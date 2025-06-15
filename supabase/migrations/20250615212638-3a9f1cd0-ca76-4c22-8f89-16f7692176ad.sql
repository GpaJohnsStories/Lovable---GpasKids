
-- 1. Create a profiles table to store user data and roles.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable RLS for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Define RLS policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Create a helper function to check if a user is an admin.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 5. Add admin management policy for profiles.
CREATE POLICY "Admins can manage all profiles."
  ON public.profiles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. Create a trigger to automatically create a profile for new users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Enable RLS on the comments table.
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 8. Clean up old or conflicting policies on the comments table.
DROP POLICY IF EXISTS "Anyone can read approved comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;

-- 9. Create new RLS policies for the comments table.
CREATE POLICY "Public can view approved comments"
  ON public.comments FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage all comments"
  ON public.comments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

