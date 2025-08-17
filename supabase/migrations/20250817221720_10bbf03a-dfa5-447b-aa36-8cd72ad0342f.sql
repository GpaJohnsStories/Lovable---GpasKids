-- Create a secure RPC to expose only approved Orange Shirt Gang photos to the public
CREATE OR REPLACE FUNCTION public.get_public_orange_gang_photos()
RETURNS TABLE (
  id uuid,
  attachment_path text,
  attachment_caption text,
  created_at timestamptz,
  display_name text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.attachment_path,
    c.attachment_caption,
    c.created_at,
    COALESCE(public.get_nickname_by_personal_id(c.personal_id),
             substring(c.personal_id from 1 for 2) || '***' || substring(c.personal_id from 6 for 1)) AS display_name
  FROM public.comments c
  WHERE c.status = 'approved'
    AND c.attachment_bucket = 'orange-gang'
    AND c.attachment_path IS NOT NULL
  ORDER BY c.created_at DESC;
END;
$$;

-- Allow public and authenticated users to execute this function
GRANT EXECUTE ON FUNCTION public.get_public_orange_gang_photos() TO anon, authenticated;