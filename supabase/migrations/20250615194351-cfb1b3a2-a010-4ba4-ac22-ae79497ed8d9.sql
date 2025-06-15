
-- Add missing columns for personal_id and subject to the comments table
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS personal_id TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS subject TEXT;

-- Now, let's make sure they are NOT NULL for new entries,
-- after populating any existing NULLs to avoid errors.
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='comments' and column_name='personal_id') THEN
    UPDATE public.comments SET personal_id = 'placeholder' WHERE personal_id IS NULL;
    ALTER TABLE public.comments ALTER COLUMN personal_id SET NOT NULL;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='comments' and column_name='subject') THEN
    UPDATE public.comments SET subject = 'No Subject' WHERE subject IS NULL;
    ALTER TABLE public.comments ALTER COLUMN subject SET NOT NULL;
  END IF;
END $$;
