-- Reset all story counters to zero for fresh launch analytics
UPDATE public.stories 
SET 
  read_count = 0,
  thumbs_up_count = 0,
  thumbs_down_count = 0,
  ok_count = 0,
  updated_at = now()
WHERE 
  read_count > 0 
  OR thumbs_up_count > 0 
  OR thumbs_down_count > 0 
  OR ok_count > 0;