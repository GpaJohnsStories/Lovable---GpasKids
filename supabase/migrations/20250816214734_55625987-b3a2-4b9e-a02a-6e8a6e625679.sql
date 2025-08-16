-- Fix security vulnerability: Hide personal_id from public comment access
-- Remove the old public access policy that exposes personal_id

DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;

-- Create a more restrictive policy that only allows admins and viewers to see all comment data
CREATE POLICY "Only admins and viewers can view all comment data" 
ON public.comments 
FOR SELECT 
USING (has_admin_access());

-- Create a secure function for public access that excludes personal_id
CREATE OR REPLACE FUNCTION public.get_public_approved_comments()
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
GRANT EXECUTE ON FUNCTION public.get_public_approved_comments() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_approved_comments() TO authenticated;

-- Create a function to get a specific approved comment by ID (also secure)
CREATE OR REPLACE FUNCTION public.get_public_approved_comment_by_id(comment_id uuid)
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
  WHERE id = comment_id AND status = 'approved'
  LIMIT 1;
$$;

-- Grant execute permission on this function too
GRANT EXECUTE ON FUNCTION public.get_public_approved_comment_by_id(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_approved_comment_by_id(uuid) TO authenticated;