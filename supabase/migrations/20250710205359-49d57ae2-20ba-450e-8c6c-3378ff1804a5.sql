-- Create a secure admin function to update Supabase Auth passwords
-- This bypasses the need for an active session by using admin privileges
CREATE OR REPLACE FUNCTION public.admin_sync_auth_password(
  admin_email TEXT,
  admin_password TEXT,
  new_auth_password TEXT
)
RETURNS JSON AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
  auth_user_id UUID;
BEGIN
  -- First verify the admin credentials using our secure system
  SELECT * INTO admin_record 
  FROM public.admin_users 
  WHERE email = admin_email;

  -- Check if admin exists
  IF admin_record.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Admin not found');
  END IF;

  -- Verify admin password
  IF NOT verify_password(admin_password, admin_record.password_hash) THEN
    RETURN json_build_object('success', false, 'error', 'Invalid admin credentials');
  END IF;

  -- Get the Supabase Auth user ID
  SELECT id INTO auth_user_id 
  FROM auth.users 
  WHERE email = admin_email;

  IF auth_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Auth user not found');
  END IF;

  -- Update the auth.users password directly using admin privileges
  -- This uses crypt with a new salt for the auth system
  UPDATE auth.users 
  SET 
    encrypted_password = crypt(new_auth_password, gen_salt('bf')),
    updated_at = now()
  WHERE id = auth_user_id;

  -- Log this admin action
  INSERT INTO public.admin_audit (action, admin_id, ip_address, user_agent)
  VALUES ('password_sync', admin_record.id, inet_client_addr(), 'password-sync-tool');

  RETURN json_build_object(
    'success', true, 
    'message', 'Password synchronized successfully',
    'email', admin_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;