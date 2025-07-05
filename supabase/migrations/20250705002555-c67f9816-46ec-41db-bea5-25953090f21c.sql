-- Create your admin account with a temporary password
-- You'll need to change this to your actual secure password
INSERT INTO public.admin_users (email, password_hash, role)
VALUES ('gpajohn.buddy@gmail.com', hash_password('TempPassword123!'), 'super_admin')
ON CONFLICT (email) DO UPDATE SET
password_hash = hash_password('TempPassword123!'),
role = 'super_admin';

-- Create function to change admin password (run this once with your real password)
CREATE OR REPLACE FUNCTION public.change_admin_password(admin_email TEXT, new_password TEXT)
RETURNS TEXT AS $$
BEGIN
  UPDATE public.admin_users 
  SET password_hash = hash_password(new_password),
      updated_at = now()
  WHERE email = admin_email;
  
  IF FOUND THEN
    RETURN 'Password updated successfully';
  ELSE
    RETURN 'Admin not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;