
-- Add book-related fields to the stories table
ALTER TABLE public.stories 
ADD COLUMN book_title text,
ADD COLUMN chapter_number integer,
ADD COLUMN chapter_title text;

-- Add a comment for documentation
COMMENT ON COLUMN public.stories.book_title IS 'Title of the book this story/chapter belongs to (nullable)';
COMMENT ON COLUMN public.stories.chapter_number IS 'Chapter number within the book (nullable)';
COMMENT ON COLUMN public.stories.chapter_title IS 'Title of the specific chapter (nullable)';
