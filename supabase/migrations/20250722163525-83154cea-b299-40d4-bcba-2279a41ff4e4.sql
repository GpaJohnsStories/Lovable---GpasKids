-- Add Buddy's Comments field to author_bios table
ALTER TABLE public.author_bios 
ADD COLUMN buddys_comments text;