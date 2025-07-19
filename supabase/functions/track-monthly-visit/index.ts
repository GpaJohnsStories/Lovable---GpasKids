
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    console.log('Processing monthly visit tracking request')

    // Check if user is authenticated and admin
    let isAdmin = false
    const authHeader = req.headers.get('Authorization')
    
    if (authHeader) {
      try {
        // Get the session from the auth header
        const { data: { user }, error: authError } = await supabase.auth.getUser(
          authHeader.replace('Bearer ', '')
        )
        
        if (!authError && user) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          
          isAdmin = profile?.role === 'admin'
        }
      } catch (error) {
        console.log('Error checking admin status:', error)
        // Continue with non-admin flow if auth check fails
      }
    }

    // Skip tracking if user is admin
    if (isAdmin) {
      console.log('Skipping visit tracking for admin user')
      return new Response(
        JSON.stringify({ success: true, message: 'Admin visit excluded from tracking' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Get current year and month
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1 // JavaScript months are 0-indexed

    console.log(`Tracking visit for ${year}-${month}`)

    // Try to increment visit count for current month
    // First, try to get existing record
    const { data: existingRecord } = await supabase
      .from('monthly_visits')
      .select('visit_count')
      .eq('year', year)
      .eq('month', month)
      .single()

    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('monthly_visits')
        .update({ 
          visit_count: existingRecord.visit_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('year', year)
        .eq('month', month)

      if (updateError) {
        console.error('Error updating monthly visit:', updateError)
        throw updateError
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('monthly_visits')
        .insert({
          year,
          month,
          visit_count: 1
        })

      if (insertError) {
        console.error('Error inserting monthly visit:', insertError)
        throw insertError
      }
    }

    console.log('Successfully tracked monthly visit')

    return new Response(
      JSON.stringify({ success: true, year, month }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in track-monthly-visit function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
