-- Temporarily allow story updates without authentication for development
-- This removes the admin requirement so story editing works without login

DROP POLICY IF EXISTS "Admins can update stories" ON public.stories;
DROP POLICY IF EXISTS "Admins can create stories" ON public.stories;
DROP POLICY IF EXISTS "Admins can delete stories" ON public.stories;

-- Create temporary permissive policies for development
CREATE POLICY "Allow all story updates for development" 
ON public.stories 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all story inserts for development" 
ON public.stories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all story deletes for development" 
ON public.stories 
FOR DELETE 
USING (true);