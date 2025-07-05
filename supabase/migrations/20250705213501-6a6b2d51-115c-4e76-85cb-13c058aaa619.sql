-- Check if profile exists and promote to admin
INSERT INTO public.profiles (id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'gpajohn.buddy@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';