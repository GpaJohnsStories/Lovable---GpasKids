
-- Update the July 2025 visit count to match Lovable's count of 47
UPDATE public.monthly_visits 
SET visit_count = 47, updated_at = now() 
WHERE year = 2025 AND month = 7;

-- If no record exists for July 2025, insert it
INSERT INTO public.monthly_visits (year, month, visit_count)
SELECT 2025, 7, 47
WHERE NOT EXISTS (
  SELECT 1 FROM public.monthly_visits 
  WHERE year = 2025 AND month = 7
);
