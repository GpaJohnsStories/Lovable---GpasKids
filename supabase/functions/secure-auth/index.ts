import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Allowlisted domains for admin access
const ALLOWED_ORIGINS = [
  'https://hlywucxwpzbqmzssmwpj.lovableproject.com',
  'http://localhost:3000',
  'http://localhost:5173'
];

// Emergency fallback admin emails (only used if DB query fails)
const EMERGENCY_FALLBACK_EMAILS = [
  'johnm.chilson@gmail.com',  // Primary admin
  'paul.chilson@gmail.com',   // Secondary admin
  'gpajohn.buddy@gmail.com'   // Grandpa John's admin account
];

// Get allowed admin email hashes from database  
async function getAllowedAdminEmailHashes(supabaseClient: any): Promise<string[]> {
  try {
    console.log('Fetching allowed admin email hashes from database...');
    const { data, error } = await supabaseClient.rpc('get_allowed_admin_email_hashes');
    
    if (error) {
      console.error('DB query for allowed email hashes failed:', error);
      console.log('Using emergency fallback emails (computing hashes)');
      // Compute hashes for fallback emails
      const fallbackHashes = await Promise.all(
        EMERGENCY_FALLBACK_EMAILS.map(async email => {
          const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase()));
          return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        })
      );
      return fallbackHashes;
    }
    
    console.log('Successfully fetched allowed email hashes from DB:', data?.length || 0, 'hashes');
    return data || [];
  } catch (err) {
    console.error('Exception during DB query for allowed email hashes:', err);
    console.log('Using emergency fallback emails (computing hashes)');
    // Compute hashes for fallback emails
    const fallbackHashes = await Promise.all(
      EMERGENCY_FALLBACK_EMAILS.map(async email => {
        const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase()));
        return Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      })
    );
    return fallbackHashes;
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Enhanced origin checking
    const origin = req.headers.get('origin') || '';
    console.log('Request origin:', origin);

    let isAllowed = false;
    try {
      if (!origin) {
        isAllowed = true; // allow non-browser or missing origin
      } else {
        const url = new URL(origin);
        const host = url.hostname;
        isAllowed =
          ALLOWED_ORIGINS.includes(origin) ||
          host.endsWith('.lovable.dev') ||
          host.endsWith('.lovableproject.com') ||
          host === 'localhost';
      }
    } catch (_e) {
      // Fallback: only allow explicit allowlist when URL parsing fails
      isAllowed = ALLOWED_ORIGINS.includes(origin);
    }

    if (origin && !isAllowed) {
      console.log('Origin not allowed:', origin);
      return new Response(
        JSON.stringify({ error: 'Origin not allowed' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, action } = await req.json()

    // Get allowed admin email hashes from database
    const allowedEmailHashes = await getAllowedAdminEmailHashes(supabaseClient);
    
    // Compute hash for provided email
    const emailBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase()));
    const emailHash = Array.from(new Uint8Array(emailBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log('Checking email hash against allowlist. Hash preview:', emailHash.substring(0, 8) + '...');

    // Email validation - check hash against database-driven allowlist
    if (!allowedEmailHashes.includes(emailHash)) {
      console.log('Email hash not in allowlist. Hash:', emailHash.substring(0, 8) + '...');
      return new Response(
        JSON.stringify({ 
          error: 'Email not authorized for admin access. Contact a privileged admin to be added to the system.' 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'signin') {
      console.log('Processing signin for:', email);
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.log('Signin error:', error.message);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Ensure profile exists after successful login
      if (data.user) {
        console.log('Ensuring profile exists for user:', data.user.id);
        
        // Check if profile already exists
        const { data: existingProfile } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (!existingProfile) {
          // Create new profile with admin role for allowlisted emails
          const { error: profileError } = await supabaseClient
            .from('profiles')
            .insert([{
              id: data.user.id,
              role: 'admin'
            }]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          } else {
            console.log('New admin profile created for user');
          }
        } else {
          console.log('Profile already exists with role:', existingProfile.role);
        }
      }

      console.log('Signin successful for:', email);
      return new Response(
        JSON.stringify({ session: data.session, user: data.user }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'signup') {
      console.log('Processing signup for:', email);
      
      const redirectUrl = `${req.headers.get('origin') || 'http://localhost:3000'}/`
      
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      if (error) {
        console.log('Signup error:', error.message);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create profile for new admin user
      if (data.user) {
        console.log('Creating profile for new user:', data.user.id);
        
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .insert([{
            id: data.user.id,
            role: 'admin'  // Default role for allowlisted emails
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        } else {
          console.log('Profile created for new user');
        }
      }

      console.log('Signup successful for:', email);
      return new Response(
        JSON.stringify({ session: data.session, user: data.user }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Auth function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})