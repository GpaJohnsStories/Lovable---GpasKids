-- Create author_bios table
CREATE TABLE public.author_bios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL UNIQUE,
  bio_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.author_bios ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to view bios
CREATE POLICY "Anyone can view author bios" 
ON public.author_bios 
FOR SELECT 
USING (true);

-- Create policies for admin management
CREATE POLICY "Admins can manage author bios" 
ON public.author_bios 
FOR ALL 
USING (is_admin_safe())
WITH CHECK (is_admin_safe());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_author_bios_updated_at
BEFORE UPDATE ON public.author_bios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on author_name for fast lookups
CREATE INDEX idx_author_bios_author_name ON public.author_bios(author_name);

-- Add audit logging trigger
CREATE TRIGGER audit_author_bios_changes
AFTER INSERT OR UPDATE OR DELETE ON public.author_bios
FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();