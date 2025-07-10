-- Create the first admin user with a secure initial password
-- This uses the existing admin functions to create a proper admin account
INSERT INTO public.admin_users (email, password_hash, role)
VALUES ('gpajohn.buddy@gmail.com', hash_password('SecureAdmin2025!'), 'super_admin')
ON CONFLICT (email) DO UPDATE SET
  password_hash = hash_password('SecureAdmin2025!'),
  role = 'super_admin',
  failed_login_attempts = 0,
  locked_until = NULL,
  updated_at = now();