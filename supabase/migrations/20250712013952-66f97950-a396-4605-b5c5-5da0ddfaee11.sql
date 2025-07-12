-- Create table for deployed content
CREATE TABLE public.deployed_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_code TEXT NOT NULL UNIQUE,
  content TEXT,
  photo_url TEXT,
  audio_url TEXT,
  title TEXT,
  author TEXT,
  deployed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deployed_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is for public content)
CREATE POLICY "Deployed content is viewable by everyone" 
ON public.deployed_content 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage deployed content
CREATE POLICY "Only admins can insert deployed content" 
ON public.deployed_content 
FOR INSERT 
WITH CHECK (public.is_admin_safe());

CREATE POLICY "Only admins can update deployed content" 
ON public.deployed_content 
FOR UPDATE 
USING (public.is_admin_safe());

CREATE POLICY "Only admins can delete deployed content" 
ON public.deployed_content 
FOR DELETE 
USING (public.is_admin_safe());

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_deployed_content_updated_at
BEFORE UPDATE ON public.deployed_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();