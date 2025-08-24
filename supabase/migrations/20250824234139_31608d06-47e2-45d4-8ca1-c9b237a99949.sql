-- Create monthly_country_visits table with composite primary key
CREATE TABLE public.monthly_country_visits (
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  country_code CHAR(2) NOT NULL DEFAULT 'XX',
  country_name TEXT NOT NULL DEFAULT 'Unknown',
  visit_count INTEGER NOT NULL DEFAULT 0,
  last_visit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (year, month, country_code),
  CONSTRAINT valid_month CHECK (month >= 1 AND month <= 12),
  CONSTRAINT valid_year CHECK (year >= 2024),
  CONSTRAINT valid_country_code CHECK (length(country_code) = 2)
);

-- Create trigger to normalize country codes and handle blanks
CREATE OR REPLACE FUNCTION public.normalize_country_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle blank or null country codes
  IF NEW.country_code IS NULL OR trim(NEW.country_code) = '' THEN
    NEW.country_code := 'XX';
    NEW.country_name := 'Unknown';
  ELSE
    -- Ensure uppercase country code
    NEW.country_code := upper(trim(NEW.country_code));
    
    -- If country name is blank, set to Unknown
    IF NEW.country_name IS NULL OR trim(NEW.country_name) = '' THEN
      NEW.country_name := 'Unknown';
    END IF;
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_country_data_trigger
  BEFORE INSERT OR UPDATE ON public.monthly_country_visits
  FOR EACH ROW EXECUTE FUNCTION public.normalize_country_data();

-- Enable RLS
ALTER TABLE public.monthly_country_visits ENABLE ROW LEVEL SECURITY;

-- Public can view country visit statistics
CREATE POLICY "Anyone can view monthly country visits"
ON public.monthly_country_visits
FOR SELECT
USING (true);

-- System can manage country visits
CREATE POLICY "System can manage monthly country visits"
ON public.monthly_country_visits
FOR ALL
USING (is_trusted_client())
WITH CHECK (is_trusted_client());

-- Create private geoip storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('geoip', 'geoip', false);

-- Create storage policies for geoip bucket (Edge Functions only)
CREATE POLICY "System can read geoip files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'geoip' AND is_trusted_client());

CREATE POLICY "System can upload geoip files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'geoip' AND is_trusted_client());

CREATE POLICY "System can update geoip files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'geoip' AND is_trusted_client());

CREATE POLICY "System can delete geoip files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'geoip' AND is_trusted_client());