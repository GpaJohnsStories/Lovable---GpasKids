-- Create Icon Library Table
CREATE TABLE public.icon_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_code TEXT NOT NULL UNIQUE CHECK (LENGTH(icon_code) = 7),
  icon_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.icon_library ENABLE ROW LEVEL SECURITY;

-- Create policies for icon library
CREATE POLICY "Anyone can view icon library" 
ON public.icon_library 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage icon library" 
ON public.icon_library 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_icon_library_updated_at
BEFORE UPDATE ON public.icon_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();