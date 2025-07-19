
-- Add column to track search engine bot visits separately
ALTER TABLE public.monthly_visits 
ADD COLUMN IF NOT EXISTS search_engine_visits_count integer NOT NULL DEFAULT 0;

-- Add helpful comment
COMMENT ON COLUMN public.monthly_visits.search_engine_visits_count IS 'Count of visits from legitimate search engine crawlers (Google, Bing, etc.)';
