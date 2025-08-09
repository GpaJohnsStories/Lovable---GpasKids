-- Create donations_monthly table to track monthly donation totals
CREATE TABLE public.donations_monthly (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  donation_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(year, month)
);

-- Enable Row Level Security
ALTER TABLE public.donations_monthly ENABLE ROW LEVEL SECURITY;

-- Create policies for donation tracking
CREATE POLICY "Anyone can view monthly donation totals" 
ON public.donations_monthly 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage monthly donations" 
ON public.donations_monthly 
FOR ALL 
USING (is_trusted_client())
WITH CHECK (is_trusted_client());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_donations_monthly_updated_at
BEFORE UPDATE ON public.donations_monthly
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();