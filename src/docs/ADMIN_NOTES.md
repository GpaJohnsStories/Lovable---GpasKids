# Admin Configuration Notes

## Required Environment Variables

### Supabase Service Role Key
For admin functions to work properly, you need to set the `SUPABASE_SERVICE_ROLE_KEY` in your Supabase project settings:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the `service_role` key (NOT the `anon` key)
4. Add it as a secret in your project environment

### Edge Function Configuration
The following edge functions are configured as public (no JWT verification):
- `auth-custom-claims` - Handles user role assignments
- `check-password-strength` - Validates password strength

## Auth Webhook Setup
To enable automatic role assignment for new users:

1. Go to Supabase Dashboard > Authentication > Settings
2. Find "Webhook" section
3. Set webhook URL to: `https://[your-project-id].supabase.co/functions/v1/auth-custom-claims`
4. Select events: `user.created`
5. Set HTTP method: `POST`
6. Save the webhook configuration

This ensures new users get proper roles assigned automatically when they register.

## Security Notes
- The `auth-custom-claims` function is public but validates requests internally
- The `check-password-strength` function is public for registration flow
- All other admin functions require proper JWT authentication
- Monitor edge function logs regularly for any unauthorized access attempts