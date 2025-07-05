-- Create table to store used Personal IDs to prevent duplicates
CREATE TABLE public.used_personal_ids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  personal_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_used_personal_ids_personal_id ON public.used_personal_ids(personal_id);

-- Enable RLS
ALTER TABLE public.used_personal_ids ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading for duplicate checking
CREATE POLICY "Anyone can check used personal ids" 
ON public.used_personal_ids 
FOR SELECT 
USING (true);

-- Create policy to allow inserting new personal ids
CREATE POLICY "Anyone can insert personal ids" 
ON public.used_personal_ids 
FOR INSERT 
WITH CHECK (true);