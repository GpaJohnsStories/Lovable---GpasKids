import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple GeoIP lookup using a basic IP geolocation service as fallback
// In production, we'll use the MaxMind MMDB file for better accuracy
async function getCountryFromIP(ip: string): Promise<{ country_code: string; country_name: string }> {
  try {
    // For localhost/private IPs, return unknown
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return { country_code: 'XX', country_name: 'Unknown' };
    }

    // Try to get country from a free geolocation service
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode,country`, {
      timeout: 5000
    });
    
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      if (geoData.status === 'success') {
        return {
          country_code: geoData.countryCode || 'XX',
          country_name: geoData.country || 'Unknown'
        };
      }
    }
  } catch (error) {
    console.warn('GeoIP lookup failed:', error);
  }
  
  // Default to unknown if lookup fails
  return { country_code: 'XX', country_name: 'Unknown' };
}

async function trackCountryVisit(supabase: any, year: number, month: number, countryCode: string, countryName: string) {
  try {
    // Get existing record
    const { data: existingRecord } = await supabase
      .from('monthly_country_visits')
      .select('*')
      .eq('year', year)
      .eq('month', month)
      .eq('country_code', countryCode)
      .single();

    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('monthly_country_visits')
        .update({
          visit_count: existingRecord.visit_count + 1,
          last_visit_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('year', year)
        .eq('month', month)
        .eq('country_code', countryCode);

      if (updateError) {
        console.error('Failed to update country visit:', updateError);
      } else {
        console.log(`Updated country visit: ${countryCode} (${countryName}) ${existingRecord.visit_count} -> ${existingRecord.visit_count + 1}`);
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('monthly_country_visits')
        .insert({
          year,
          month,
          country_code: countryCode,
          country_name: countryName,
          visit_count: 1,
          last_visit_date: new Date().toISOString()
        });

      if (insertError) {
        console.error('Failed to insert country visit:', insertError);
      } else {
        console.log(`Tracked new country visit: ${countryCode} (${countryName}) for ${year}-${month}`);
      }
    }
  } catch (error) {
    console.error('Error tracking country visit:', error);
  }
}

// Legitimate search engine crawlers that should be allowed for SEO
const SEARCH_ENGINE_CRAWLERS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'applebot',
  'linkedinbot', 'pinterestbot', 'redditbot', 'whatsapp', 'telegrambot'
];

// Known unwanted bots (partial matches)
const UNWANTED_BOT_USER_AGENTS = [
  'scrapy', 'scraper', 'headlesschrome', 'phantomjs', 'selenium', 
  'webdriver', 'puppeteer', 'playwright', 'curl', 'wget', 'postman', 
  'insomnia', 'httpie', 'bot/1.0', 'crawler/1.0', 'spider/1.0'
];

// Additional bot detection patterns for unwanted bots
const SUSPICIOUS_PATTERNS = [
  'python-urllib', 'python-requests', 'java/', 'ruby/', 'php/', 
  'node-fetch', 'go-http-client', 'rust/', 'monitor/', 'check/', 
  'test/', 'scan/', 'probe/', 'fetch/', 'libwww-perl'
];

function detectSearchEngine(userAgent: string | null): boolean {
  if (!userAgent) return false;
  
  const lowerUA = userAgent.toLowerCase();
  
  // Check if it's a legitimate search engine crawler
  for (const searchEngine of SEARCH_ENGINE_CRAWLERS) {
    if (lowerUA.includes(searchEngine)) {
      console.log(`Search engine detected: ${searchEngine}`);
      return true;
    }
  }
  
  return false;
}

function detectUnwantedBot(userAgent: string | null, headers: Headers): boolean {
  console.log('Bot detection - User Agent check only (not stored)');
  
  // No user agent is suspicious
  if (!userAgent) {
    console.log('Unwanted bot detected: Missing user agent');
    return true;
  }

  const lowerUA = userAgent.toLowerCase();
  
  // First check if it's a legitimate search engine - if so, it's NOT an unwanted bot
  if (detectSearchEngine(userAgent)) {
    console.log('Legitimate search engine detected - allowing');
    return false;
  }
  
  // Check against known unwanted bot patterns
  for (const botPattern of UNWANTED_BOT_USER_AGENTS) {
    if (lowerUA.includes(botPattern)) {
      console.log(`Unwanted bot detected: User agent contains "${botPattern}"`);
      return true;
    }
  }
  
  // Check against suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (lowerUA.includes(pattern)) {
      console.log(`Unwanted bot detected: User agent contains suspicious pattern "${pattern}"`);
      return true;
    }
  }
  
  // Check for missing Accept header (common in unwanted bots, but search engines usually have this)
  const acceptHeader = headers.get('Accept');
  if (!acceptHeader || (!acceptHeader.includes('text/html') && !acceptHeader.includes('application/json') && !acceptHeader.includes('*/*'))) {
    console.log('Unwanted bot detected: Missing or invalid Accept header');
    return true;
  }
  
  // Check for missing Accept-Language header (less strict for search engines)
  const acceptLanguage = headers.get('Accept-Language');
  if (!acceptLanguage) {
    console.log('Unwanted bot detected: Missing Accept-Language header');
    return true;
  }
  
  console.log('Human visitor detected');
  return false;
}

async function trackExcludedVisit(supabase: any, year: number, month: number, columnName: string) {
  try {
    // Get existing record
    const { data: existingRecord } = await supabase
      .from('monthly_visits')
      .select('*')
      .eq('year', year)
      .eq('month', month)
      .single()

    if (existingRecord) {
      // Update existing record
      const updateData = {
        [columnName]: existingRecord[columnName] + 1,
        updated_at: new Date().toISOString()
      };
      
      const { error: updateError } = await supabase
        .from('monthly_visits')
        .update(updateData)
        .eq('year', year)
        .eq('month', month)

      if (updateError) {
        console.error('Error updating excluded visit:', updateError)
      } else {
        console.log(`${columnName} updated: ${existingRecord[columnName]} -> ${existingRecord[columnName] + 1}`);
      }
    } else {
      // Insert new record with this excluded visit
      const insertData = {
        year,
        month,
        visit_count: 0,
        bot_visits_count: 0,
        admin_visits_count: 0,
        search_engine_visits_count: 0,
        other_excluded_count: 0,
        [columnName]: 1
      };
      
      const { error: insertError } = await supabase
        .from('monthly_visits')
        .insert(insertData)

      if (insertError) {
        console.error('Error inserting new excluded visit record:', insertError)
      } else {
        console.log(`New monthly visit record created with ${columnName}: 1`);
      }
    }
  } catch (error) {
    console.error('Error in trackExcludedVisit:', error);
  }
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

    console.log('=== PROCESSING VISIT TRACKING REQUEST ===')

    // Get user agent for bot detection only (not stored)
    const userAgent = req.headers.get('User-Agent');
    
    console.log('=== Visit Tracking (Privacy-First) ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Auth header present:', !!req.headers.get('authorization'));
    console.log('Request method:', req.method);

    // Get current year and month for tracking
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    // Check if this is a search engine crawler
    if (detectSearchEngine(userAgent)) {
      console.log('Search engine crawler detected - tracking separately');
      await trackExcludedVisit(supabase, year, month, 'search_engine_visits_count');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Search engine visit tracked',
          excluded_reason: 'search_engine',
          year,
          month
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Check if this is an unwanted bot
    if (detectUnwantedBot(userAgent, req.headers)) {
      console.log('Visit excluded: Unwanted bot detected');
      await trackExcludedVisit(supabase, year, month, 'bot_visits_count');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Visit excluded - unwanted bot detected',
          excluded_reason: 'unwanted_bot',
          year,
          month
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

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

    // Skip tracking if user is admin - don't track admin visits at all
    if (isAdmin) {
      console.log('Visit excluded: Admin user')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin visit excluded from tracking',
          excluded_reason: 'admin',
          year,
          month
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log(`=== TRACKING LEGITIMATE VISIT FOR ${year}-${month} ===`)

    // Get visitor's IP address for country lookup
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     '127.0.0.1';

    console.log(`Processing visit from IP: ${clientIp}`);

    // Get country information from IP
    const { country_code, country_name } = await getCountryFromIP(clientIp);
    console.log(`Resolved country: ${country_code} (${country_name})`);

    // Track the country visit
    await trackCountryVisit(supabase, year, month, country_code, country_name);

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
      
      console.log(`Visit count updated: ${existingRecord.visit_count} -> ${existingRecord.visit_count + 1}`);
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
      
      console.log('New monthly visit record created with count: 1');
    }

    console.log('=== VISIT SUCCESSFULLY TRACKED (NO PERSONAL DATA COLLECTED) ===')

    return new Response(
      JSON.stringify({ 
        success: true, 
        year, 
        month,
        message: 'Visit tracked successfully'
      }),
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