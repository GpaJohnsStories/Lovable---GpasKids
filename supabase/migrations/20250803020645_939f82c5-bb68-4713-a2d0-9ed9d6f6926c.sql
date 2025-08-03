-- Insert 18 months of data starting from 2025-08 through 2027-01
-- This will create a complete timeline and force proper spacing in the chart

INSERT INTO public.monthly_visits (year, month, visit_count, bot_visits_count, admin_visits_count, search_engine_visits_count, other_excluded_count)
VALUES 
  -- 2025 months (Sep-Dec, Aug already exists)
  (2025, 9, 0, 0, 0, 0, 0),
  (2025, 10, 0, 0, 0, 0, 0),
  (2025, 11, 0, 0, 0, 0, 0),
  (2025, 12, 0, 0, 0, 0, 0),
  
  -- 2026 months (full year)
  (2026, 1, 0, 0, 0, 0, 0),
  (2026, 2, 0, 0, 0, 0, 0),
  (2026, 3, 0, 0, 0, 0, 0),
  (2026, 4, 0, 0, 0, 0, 0),
  (2026, 5, 0, 0, 0, 0, 0),
  (2026, 6, 0, 0, 0, 0, 0),
  (2026, 7, 0, 0, 0, 0, 0),
  (2026, 8, 0, 0, 0, 0, 0),
  (2026, 9, 0, 0, 0, 0, 0),
  (2026, 10, 0, 0, 0, 0, 0),
  (2026, 11, 0, 0, 0, 0, 0),
  (2026, 12, 0, 0, 0, 0, 0),
  
  -- 2027 month (Jan only)
  (2027, 1, 0, 0, 0, 0, 0)

ON CONFLICT (year, month) DO NOTHING;