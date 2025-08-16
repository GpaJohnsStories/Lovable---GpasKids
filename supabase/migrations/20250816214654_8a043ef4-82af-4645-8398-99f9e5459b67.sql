-- Fix security vulnerability: Hide personal_id from public comment access

-- First, create a secure view for public comment access that excludes personal_id
CREATE OR REPLACE VIEW public.public_comments AS
SELECT 
  id,
  subject,
  content,
  status,
  created_at,
  updated_at,
  parent_id
FROM public.comments 
WHERE status = 'approved';

-- Enable RLS on the view
ALTER VIEW public.public_comments SET (security_barrier = true);

-- Create RLS policy for the secure view
CREATE POLICY "Anyone can view public comments via view" 
ON public.public_comments 
FOR SELECT 
USING (true);

-- Update the main comments table policies to be more restrictive
-- Remove the existing public view policy
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;

-- Create a more restrictive policy that only allows admins and viewers to see personal_id
CREATE POLICY "Only admins and viewers can view comments with personal_id" 
ON public.comments 
FOR SELECT 
USING (has_admin_access());

-- Public access should now only go through the secure view
-- Add a policy for public to use the view (this is handled by the view's own policy)

-- Create a function to get approved comments safely for public use
CREATE OR REPLACE FUNCTION public.get_approved_comments()
RETURNS TABLE (
  id uuid,
  subject text,
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  parent_id uuid
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    id,
    subject,
    content,
    created_at,
    updated_at,
    parent_id
  FROM public.comments 
  WHERE status = 'approved'
  ORDER BY created_at DESC;
$$;

-- Grant execute permission on the function to public
GRANT EXECUTE ON FUNCTION public.get_approved_comments() TO anon;
GRANT EXECUTE ON FUNCTION public.get_approved_comments() TO authenticated;