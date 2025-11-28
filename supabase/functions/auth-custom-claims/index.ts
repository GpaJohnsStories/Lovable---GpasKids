import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔐 Auth custom claims function called');
    
    // Parse request body
    const body = await req.json();
    const { type: event, record: user } = body;
    
    console.log('📋 Auth event details:', { event, userId: user?.id });
    
    // Only proceed for relevant auth events
    if (!['INSERT', 'UPDATE'].includes(event)) {
      console.log('⏭️ Skipping non-relevant auth event:', event);
      return new Response(
        JSON.stringify({ message: 'Not a relevant auth event' }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    if (!user?.id) {
      console.error('❌ No user ID found in request');
      return new Response(
        JSON.stringify({ error: 'No user ID provided' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    // Create Supabase admin client using service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    
    console.log('🔍 Fetching user profile for:', user.id);
    
    // Fetch user's role from the existing profiles table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('❌ Error fetching user profile:', profileError);
      // Don't fail the auth process, just log the error
      return new Response(
        JSON.stringify({ warning: 'Could not fetch user profile', error: profileError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    // Default role if none found (new users get 'user' role)
    const userRole = profileData?.role || 'user';
    console.log('👤 User role determined:', userRole);
    
    // Define permissions based on role
    let permissions: string[] = [];
    switch (userRole) {
      case 'admin':
        permissions = ['read:all', 'write:all', 'delete:all', 'admin:access'];
        break;
      case 'viewer':
        permissions = ['read:all', 'admin:view'];
        break;
      case 'user':
      default:
        permissions = ['read:own', 'write:own'];
        break;
    }
    
    console.log('🔑 Updating user metadata with custom claims');
    
    // Add custom claims to the user's JWT
    const { error: claimsError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        app_metadata: { 
          role: userRole,
          permissions: permissions,
          admin_access: ['admin', 'viewer'].includes(userRole),
          updated_at: new Date().toISOString()
        }
      }
    );
    
    if (claimsError) {
      console.error('❌ Error updating user claims:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Failed to update user claims', details: claimsError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    console.log('✅ Custom claims added successfully for user:', user.id);
    
    return new Response(
      JSON.stringify({ 
        message: 'Custom claims added successfully',
        role: userRole,
        permissions: permissions,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (err) {
    console.error('💥 Error processing auth webhook:', err);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: err.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});