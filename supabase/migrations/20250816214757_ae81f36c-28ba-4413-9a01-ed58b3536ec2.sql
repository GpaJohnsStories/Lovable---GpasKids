-- Fix function search path security warnings for the new comment functions

-- Update the public comment functions to have secure search paths
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
SET search_path = public
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
SET search_path = public
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