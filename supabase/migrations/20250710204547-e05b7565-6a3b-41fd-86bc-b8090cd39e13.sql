-- Update the Supabase Auth user password to match our admin_users password
-- We'll use the admin function to reset the password safely
SELECT change_admin_password('gpajohn.buddy@gmail.com', 'SecureAdmin2025!') as password_update_result;