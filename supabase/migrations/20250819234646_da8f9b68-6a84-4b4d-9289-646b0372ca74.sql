
-- 1) Harden privileged_admins: enforce uniqueness on email (case-insensitive) and user_id
CREATE UNIQUE INDEX IF NOT EXISTS privileged_admins_email_lower_idx
  ON public.privileged_admins ((lower(email)));

CREATE UNIQUE INDEX IF NOT EXISTS privileged_admins_user_id_idx
  ON public.privileged_admins (user_id);

-- 2) Normalize any existing emails to lowercase (no-op if table is empty)
UPDATE public.privileged_admins
SET email = lower(email)
WHERE email IS NOT NULL AND email <> lower(email);

-- 3) Seed privileged_admins strictly with your two admin emails by resolving their user_id from auth.users
WITH user_lookup AS (
  SELECT id AS user_id, lower(email) AS email
  FROM auth.users
  WHERE lower(email) IN ('gpajohn.buddy@gmail.com','johnm.chilson@gmail.com')
)
INSERT INTO public.privileged_admins (id, email, user_id, created_at, updated_at)
SELECT gen_random_uuid(), ul.email, ul.user_id, now(), now()
FROM user_lookup ul
ON CONFLICT (user_id) DO NOTHING;

-- 4) Remove any privileged_admins entries not in your allowed two (safety check going forward)
DELETE FROM public.privileged_admins
WHERE lower(email) NOT IN ('gpajohn.buddy@gmail.com','johnm.chilson@gmail.com');

-- 5) Ensure those two users are admins in profiles (upsert)
INSERT INTO public.profiles (id, role, created_at, updated_at)
SELECT u.id, 'admin', now(), now()
FROM auth.users u
WHERE lower(u.email) IN ('gpajohn.buddy@gmail.com','johnm.chilson@gmail.com')
ON CONFLICT (id) DO UPDATE
SET role = 'admin', updated_at = now();
