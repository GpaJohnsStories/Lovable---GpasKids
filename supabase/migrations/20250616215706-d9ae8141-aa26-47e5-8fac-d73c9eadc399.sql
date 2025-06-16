
-- Create a table to store visitor country data
CREATE TABLE public.visitor_countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code VARCHAR(2) NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  visit_count INTEGER NOT NULL DEFAULT 1,
  last_visit TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index on country_code to prevent duplicates
CREATE UNIQUE INDEX idx_visitor_countries_code ON public.visitor_countries(country_code);

-- Create a table to track individual visits (for deduplication)
CREATE TABLE public.visitor_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash VARCHAR(64) NOT NULL, -- Hashed IP for privacy
  country_code VARCHAR(2) NOT NULL,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index to prevent duplicate visits per IP per day
CREATE UNIQUE INDEX idx_visitor_sessions_unique ON public.visitor_sessions(ip_hash, visit_date);

-- Enable RLS on both tables (they'll be publicly readable but only writable via edge function)
ALTER TABLE public.visitor_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to visitor_countries
CREATE POLICY "Allow public read access to visitor countries" 
  ON public.visitor_countries 
  FOR SELECT 
  TO public
  USING (true);

-- Policy to prevent direct public write access (only via edge function)
CREATE POLICY "Prevent direct public write access to visitor countries" 
  ON public.visitor_countries 
  FOR ALL 
  TO public
  USING (false);

-- Policy to prevent direct public access to visitor sessions
CREATE POLICY "Prevent public access to visitor sessions" 
  ON public.visitor_sessions 
  FOR ALL 
  TO public
  USING (false);
