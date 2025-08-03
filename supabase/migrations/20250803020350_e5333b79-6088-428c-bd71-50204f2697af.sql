-- Remove fake July 2025 data before going live
DELETE FROM public.monthly_visits 
WHERE year = 2025 AND month = 7;