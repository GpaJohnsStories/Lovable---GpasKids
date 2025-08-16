-- Fix stories table security issues
-- This migration restricts access to stories based on publication status and user authentication

-- Drop all existing overly permissive policies
DROP POLICY IF EXISTS "Allow all story deletes for development" ON public.stories;
DROP POLICY IF EXISTS "Allow all story inserts for development" ON public.stories;
DROP POLICY IF EXISTS "Allow all story updates for development" ON public.stories;
DROP POLICY IF EXISTS "Anyone can read stories" ON public.stories;
DROP POLICY IF EXISTS "Anyone can view published stories" ON public.stories;
DROP POLICY IF EXISTS "Anyone can view stories" ON public.stories;
DROP POLICY IF EXISTS "Authenticated users can manage stories" ON public.stories;

-- Create secure policies for stories table

-- Public can only view published stories
CREATE POLICY "Public can view published stories"
ON public.stories
FOR SELECT
TO public
USING (published = 'Y');

-- Admins can view all stories
CREATE POLICY "Admins can view all stories"
ON public.stories
FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can insert new stories
CREATE POLICY "Admins can insert stories"
ON public.stories
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Admins can update stories
CREATE POLICY "Admins can update stories"
ON public.stories
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Admins can delete stories
CREATE POLICY "Admins can delete stories"
ON public.stories
FOR DELETE
TO authenticated
USING (is_admin());

-- Allow public to increment read counts for published stories only
-- This is needed for the read tracking functionality
CREATE POLICY "Public can track reads for published stories"
ON public.story_reads
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stories 
    WHERE id = story_id AND published = 'Y'
  )
);

-- Allow public to vote on published stories only
CREATE POLICY "Public can vote on published stories"
ON public.story_votes
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stories 
    WHERE id = story_id AND published = 'Y'
  )
);

-- Ensure RLS is enabled on stories table
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;