-- Update stories copyright_status check constraint to allow only ©, O, and L (and reject S)
-- 1) Drop existing constraint if present
ALTER TABLE public.stories
  DROP CONSTRAINT IF EXISTS stories_copyright_status_check;

-- 2) Add new constraint allowing ©, O, L; mark NOT VALID so existing rows with 'S' don't block, but all new/updated rows must comply
ALTER TABLE public.stories
  ADD CONSTRAINT stories_copyright_status_check
  CHECK (copyright_status IN ('©','O','L')) NOT VALID;

-- Note: NOT VALID means existing rows aren't validated immediately, but future INSERT/UPDATE operations must satisfy the constraint.
-- When you've manually updated remaining 'S' records to 'L', you can validate the constraint with:
-- ALTER TABLE public.stories VALIDATE CONSTRAINT stories_copyright_status_check;
