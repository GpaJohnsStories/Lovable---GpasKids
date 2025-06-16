
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get visitor IP from headers
    const forwardedFor = req.headers.get('x-forwarded-for')
    const realIP = req.headers.get('x-real-ip')
    let visitorIP = forwardedFor?.split(',')[0] || realIP || 'unknown'
    
    // For local development, use a test IP
    if (visitorIP === '127.0.0.1' || visitorIP === 'localhost' || visitorIP === 'unknown') {
      visitorIP = '8.8.8.8' // Google DNS for testing
    }

    console.log('Tracking visitor with IP:', visitorIP)

    // Get geolocation data from ip-api.com (free service)
    const geoResponse = await fetch(`http://ip-api.com/json/${visitorIP}?fields=status,country,countryCode`)
    const geoData = await geoResponse.json()

    console.log('Geolocation data:', geoData)

    if (geoData.status !== 'success') {
      throw new Error('Failed to get geolocation data')
    }

    const countryCode = geoData.countryCode
    const countryName = geoData.country

    // Create a hash of the IP for privacy (simple hash for demo)
    const encoder = new TextEncoder()
    const data = encoder.encode(visitorIP + new Date().toDateString())
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const ipHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Try to insert visitor session (will fail if already exists for today)
    const { error: sessionError } = await supabase
      .from('visitor_sessions')
      .insert({
        ip_hash: ipHash,
        country_code: countryCode,
        visit_date: new Date().toISOString().split('T')[0]
      })

    // If session insert was successful (new visitor today), update country stats
    if (!sessionError) {
      console.log('New visitor session created')
      
      // Try to increment existing country record
      const { data: existingCountry } = await supabase
        .from('visitor_countries')
        .select('*')
        .eq('country_code', countryCode)
        .single()

      if (existingCountry) {
        // Update existing country record
        await supabase
          .from('visitor_countries')
          .update({
            visit_count: existingCountry.visit_count + 1,
            last_visit: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('country_code', countryCode)
      } else {
        // Create new country record
        await supabase
          .from('visitor_countries')
          .insert({
            country_code: countryCode,
            country_name: countryName,
            visit_count: 1
          })
      }
    } else {
      console.log('Visitor already tracked today:', sessionError.message)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        country: countryName,
        countryCode: countryCode,
        newVisitor: !sessionError
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error tracking visitor:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
