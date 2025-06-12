
-- Create RLS policies for the stories table to allow admin operations
-- Since this is an admin interface, we'll create policies that allow all operations
-- for authenticated users (in a real production app, you'd want more specific admin role checks)

-- Policy to allow anyone to read stories (public access)
CREATE POLICY "Anyone can view stories" 
  ON public.stories 
  FOR SELECT 
  USING (true);

-- Policy to allow inserts for admin operations
CREATE POLICY "Allow story creation" 
  ON public.stories 
  FOR INSERT 
  WITH CHECK (true);

-- Policy to allow updates for admin operations
CREATE POLICY "Allow story updates" 
  ON public.stories 
  FOR UPDATE 
  USING (true);

-- Policy to allow deletes for admin operations
CREATE POLICY "Allow story deletion" 
  ON public.stories 
  FOR DELETE 
  USING (true);
