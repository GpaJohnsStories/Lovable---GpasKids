import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Allowlisted domains and emails for admin access
const ALLOWED_ORIGINS = [
  'https://hlywucxwpzbqmzssmwpj.lovableproject.com',
  'http://localhost:3000',
  'http://localhost:5173'
];

const HARDCODED_ADMIN_EMAILS = [
  'johnm.chilson@gmail.com',  // Primary admin
  'paul.chilson@gmail.com'    // Secondary admin (to be added)
];

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
    const origin = req.headers.get('origin');
    console.log('Request origin:', origin);
    
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
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

    // Email validation - only allow hardcoded admin emails
    if (!HARDCODED_ADMIN_EMAILS.includes(email.toLowerCase())) {
      console.log('Email not in allowlist:', email);
      return new Response(
        JSON.stringify({ error: 'Email not authorized for admin access' }),
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
        
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .upsert([{
            id: data.user.id,
            role: 'admin'  // Default role for allowlisted emails
          }], { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        } else {
          console.log('Profile ensured for user');
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