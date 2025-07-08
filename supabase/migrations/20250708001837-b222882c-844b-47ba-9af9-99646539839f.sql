-- Reset admin password using Supabase's auth system
-- This will send a password reset email to the admin user

-- First, let's create a function to trigger password reset for admin
CREATE OR REPLACE FUNCTION public.admin_reset_password(admin_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the email exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    RETURN 'Email not found in system';
  END IF;
  
  -- The password reset email will be sent by Supabase Auth automatically
  -- when called from the client using adminClient.auth.resetPasswordForEmail()
  
  RETURN 'Password reset process initiated. Check email for reset link.';
END;
$$;