-- Fix the admin_login function - remove ::text casting that's causing the error
CREATE OR REPLACE FUNCTION public.admin_login(email_input TEXT, password_input TEXT, device_info TEXT DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
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

  -- Log successful admin login (fix: don't cast UUID to text)
  INSERT INTO public.admin_audit (action, admin_id, ip_address, user_agent)
  VALUES ('admin_login', admin_record.id, inet_client_addr(), device_info);

  RETURN json_build_object(
    'success', true, 
    'admin_id', admin_record.id,
    'email', admin_record.email,
    'role', admin_record.role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;