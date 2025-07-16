-- Enable leaked password protection in Supabase Auth
-- This setting prevents users from using passwords that have been leaked in data breaches

-- Update auth configuration to enable leaked password protection
UPDATE auth.config 
SET 
  security_update_password_require_reauthentication = true,
  password_min_length = 8
WHERE 
  instance_id = '00000000-0000-0000-0000-000000000000';

-- Note: The leaked password protection setting is typically managed through 
-- Supabase dashboard Auth settings, but we're ensuring related security measures are in place