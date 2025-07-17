-- Remove legacy visitor tracking tables
DROP TABLE IF EXISTS public.visitor_countries CASCADE;
DROP TABLE IF EXISTS public.visitor_sessions CASCADE;

-- Create monthly visits tracking table
CREATE TABLE public.monthly_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  visit_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_year_month UNIQUE (year, month),
  CONSTRAINT valid_month CHECK (month >= 1 AND month <= 12)
);

-- Enable RLS
ALTER TABLE public.monthly_visits ENABLE ROW LEVEL SECURITY;

-- Allow public read access for stats display
CREATE POLICY "Anyone can view monthly visits" 
ON public.monthly_visits 
FOR SELECT 
USING (true);

-- Only allow system/edge functions to insert/update
CREATE POLICY "System can manage monthly visits" 
ON public.monthly_visits 
FOR ALL 
USING (is_trusted_client())
WITH CHECK (is_trusted_client());

-- Create trigger for updated_at
CREATE TRIGGER update_monthly_visits_updated_at
  BEFORE UPDATE ON public.monthly_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();