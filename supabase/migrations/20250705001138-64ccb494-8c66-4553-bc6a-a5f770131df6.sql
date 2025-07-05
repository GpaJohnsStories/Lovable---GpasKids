-- Create admin_users table for secure admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  device_fingerprint TEXT,
  trusted_devices TEXT[] DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow admin users to access admin data
CREATE POLICY "Admin users can view their own data" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid()::text = id::text OR is_admin());

CREATE POLICY "Admin users can update their own data" 
ON public.admin_users 
FOR UPDATE 
USING (auth.uid()::text = id::text OR is_admin());

-- Create function to hash passwords securely
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 12));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN crypt(password, hash) = hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for secure admin login
CREATE OR REPLACE FUNCTION public.admin_login(email_input TEXT, password_input TEXT, device_info TEXT DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
  login_result JSON;
BEGIN
  -- Get admin record
  SELECT * INTO admin_record 
  FROM public.admin_users 
  WHERE email = email_input;

  -- Check if admin exists
  IF admin_record.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;

  -- Check if account is locked
  IF admin_record.locked_until IS NOT NULL AND admin_record.locked_until > now() THEN
    RETURN json_build_object('success', false, 'error', 'Account temporarily locked');
  END IF;

  -- Verify password
  IF NOT verify_password(password_input, admin_record.password_hash) THEN
    -- Increment failed attempts
    UPDATE public.admin_users 
    SET failed_login_attempts = failed_login_attempts + 1,
        locked_until = CASE 
          WHEN failed_login_attempts >= 4 THEN now() + interval '15 minutes'
          ELSE NULL 
        END
    WHERE id = admin_record.id;
    
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;

  -- Successful login - reset failed attempts and update last login
  UPDATE public.admin_users 
  SET failed_login_attempts = 0,
      locked_until = NULL,
      last_login = now(),
      device_fingerprint = COALESCE(device_info, device_fingerprint)
  WHERE id = admin_record.id;

  -- Log successful admin login
  INSERT INTO public.admin_audit (action, admin_id, ip_address, user_agent)
  VALUES ('admin_login', admin_record.id::text, inet_client_addr(), device_info);

  RETURN json_build_object(
    'success', true, 
    'admin_id', admin_record.id,
    'email', admin_record.email,
    'role', admin_record.role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert your admin account (replace with your actual email and a strong password)
INSERT INTO public.admin_users (email, password_hash, role)
VALUES ('gpajohn.buddy@gmail.com', hash_password('your_secure_password_here'), 'super_admin');

-- Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();