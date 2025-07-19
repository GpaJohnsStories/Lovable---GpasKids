-- Add columns to track different types of visits
ALTER TABLE public.monthly_visits 
ADD COLUMN IF NOT EXISTS bot_visits_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS admin_visits_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_excluded_count integer NOT NULL DEFAULT 0;

-- Add helpful comment
COMMENT ON COLUMN public.monthly_visits.visit_count IS 'Count of approved/legitimate visitor visits';
COMMENT ON COLUMN public.monthly_visits.bot_visits_count IS 'Count of visits excluded as bot traffic';
COMMENT ON COLUMN public.monthly_visits.admin_visits_count IS 'Count of visits excluded as admin traffic';
COMMENT ON COLUMN public.monthly_visits.other_excluded_count IS 'Count of visits excluded for other reasons';