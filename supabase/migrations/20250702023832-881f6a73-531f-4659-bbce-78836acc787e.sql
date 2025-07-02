-- Configure Supabase Auth security settings
-- These are typically handled via dashboard, but we can set some via SQL

-- Note: Most auth security settings like OTP expiry and leaked password protection
-- are configured in the Supabase dashboard under Authentication > Settings
-- However, we can ensure our system works properly by testing our functions

-- Test our admin functions are working
SELECT public.is_admin_safe() as admin_check;

-- Verify our emergency functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('is_admin_safe', 'emergency_admin_reset', 'emergency_promote_admin');