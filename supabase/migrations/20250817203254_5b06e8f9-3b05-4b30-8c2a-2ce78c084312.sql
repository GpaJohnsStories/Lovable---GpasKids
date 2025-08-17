-- Create app_settings table for storing application-wide configuration
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for app_settings
CREATE POLICY "Only admins can manage app settings" 
ON public.app_settings 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Create friend_names table for storing Personal ID to nickname mappings
CREATE TABLE public.friend_names (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  personal_id_hash TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on friend_names
ALTER TABLE public.friend_names ENABLE ROW LEVEL SECURITY;

-- Create policies for friend_names
CREATE POLICY "Anyone can read friend names" 
ON public.friend_names 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert friend names" 
ON public.friend_names 
FOR INSERT 
WITH CHECK (
  personal_id_hash IS NOT NULL 
  AND nickname IS NOT NULL 
  AND length(nickname) >= 3 
  AND length(nickname) <= 10
);

CREATE POLICY "Anyone can update friend names by hash" 
ON public.friend_names 
FOR UPDATE 
USING (true)
WITH CHECK (
  nickname IS NOT NULL 
  AND length(nickname) >= 3 
  AND length(nickname) <= 10
);

-- Insert the NICKNAME_PEPPER setting
INSERT INTO public.app_settings (setting_key, setting_value, description)
VALUES ('NICKNAME_PEPPER', encode(gen_random_bytes(32), 'hex'), 'Secret pepper for deriving nickname keys from Personal IDs');

-- Create function to get nickname pepper (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_nickname_pepper()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pepper_value TEXT;
BEGIN
  SELECT setting_value INTO pepper_value
  FROM public.app_settings
  WHERE setting_key = 'NICKNAME_PEPPER';
  
  IF pepper_value IS NULL THEN
    RAISE EXCEPTION 'NICKNAME_PEPPER not found in app_settings';
  END IF;
  
  RETURN pepper_value;
END;
$$;

-- Create function to derive nickname key from Personal ID
CREATE OR REPLACE FUNCTION public.derive_nickname_key(personal_id TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pepper TEXT;
  nickname_key TEXT;
BEGIN
  -- Get the pepper
  pepper := public.get_nickname_pepper();
  
  -- Derive NICKNAME_KEY using HMAC-SHA256
  nickname_key := encode(
    hmac(personal_id::bytea, pepper::bytea, 'sha256'),
    'hex'
  );
  
  RETURN nickname_key;
END;
$$;

-- Create function to derive Personal ID hash for storage
CREATE OR REPLACE FUNCTION public.derive_personal_id_hash(personal_id TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  nickname_key TEXT;
  pid_hash TEXT;
BEGIN
  -- First derive the nickname key
  nickname_key := public.derive_nickname_key(personal_id);
  
  -- Then hash the Personal ID with the nickname key using SHA-512
  pid_hash := encode(
    digest(personal_id || nickname_key, 'sha512'),
    'hex'
  );
  
  RETURN pid_hash;
END;
$$;

-- Create function to get or create nickname for Personal ID
CREATE OR REPLACE FUNCTION public.get_or_create_nickname(personal_id TEXT, desired_nickname TEXT DEFAULT 'Friend')
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pid_hash TEXT;
  existing_nickname TEXT;
BEGIN
  -- Validate Personal ID format (6 characters, alphanumeric)
  IF personal_id IS NULL OR length(personal_id) != 6 OR personal_id !~ '^[A-Z0-9]+$' THEN
    RAISE EXCEPTION 'Invalid Personal ID format';
  END IF;
  
  -- Validate nickname length
  IF desired_nickname IS NULL OR length(desired_nickname) < 3 OR length(desired_nickname) > 10 THEN
    RAISE EXCEPTION 'Nickname must be between 3 and 10 characters';
  END IF;
  
  -- Derive the hash for this Personal ID
  pid_hash := public.derive_personal_id_hash(personal_id);
  
  -- Check if nickname already exists for this Personal ID
  SELECT nickname INTO existing_nickname
  FROM public.friend_names
  WHERE personal_id_hash = pid_hash;
  
  IF existing_nickname IS NOT NULL THEN
    RETURN existing_nickname;
  END IF;
  
  -- Insert new nickname
  INSERT INTO public.friend_names (personal_id_hash, nickname)
  VALUES (pid_hash, desired_nickname);
  
  RETURN desired_nickname;
END;
$$;

-- Create function to update nickname for Personal ID
CREATE OR REPLACE FUNCTION public.update_nickname(personal_id TEXT, new_nickname TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pid_hash TEXT;
  updated_rows INTEGER;
BEGIN
  -- Validate Personal ID format
  IF personal_id IS NULL OR length(personal_id) != 6 OR personal_id !~ '^[A-Z0-9]+$' THEN
    RAISE EXCEPTION 'Invalid Personal ID format';
  END IF;
  
  -- Validate nickname length
  IF new_nickname IS NULL OR length(new_nickname) < 3 OR length(new_nickname) > 10 THEN
    RAISE EXCEPTION 'Nickname must be between 3 and 10 characters';
  END IF;
  
  -- Derive the hash for this Personal ID
  pid_hash := public.derive_personal_id_hash(personal_id);
  
  -- Update the nickname
  UPDATE public.friend_names
  SET nickname = new_nickname, updated_at = now()
  WHERE personal_id_hash = pid_hash;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  IF updated_rows = 0 THEN
    -- Insert if doesn't exist
    INSERT INTO public.friend_names (personal_id_hash, nickname)
    VALUES (pid_hash, new_nickname);
  END IF;
  
  RETURN new_nickname;
END;
$$;

-- Create function to get nickname by Personal ID
CREATE OR REPLACE FUNCTION public.get_nickname_by_personal_id(personal_id TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pid_hash TEXT;
  found_nickname TEXT;
BEGIN
  -- Validate Personal ID format
  IF personal_id IS NULL OR length(personal_id) != 6 OR personal_id !~ '^[A-Z0-9]+$' THEN
    RETURN NULL;
  END IF;
  
  -- Derive the hash for this Personal ID
  pid_hash := public.derive_personal_id_hash(personal_id);
  
  -- Get the nickname
  SELECT nickname INTO found_nickname
  FROM public.friend_names
  WHERE personal_id_hash = pid_hash;
  
  RETURN found_nickname;
END;
$$;

-- Create updated_at trigger for app_settings
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for friend_names
CREATE TRIGGER update_friend_names_updated_at
BEFORE UPDATE ON public.friend_names
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();