
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Your IP addresses to exclude
const EXCLUDED_IPS = [
  '168.157.32.95',     // Your IPv4
  '2600:1700:4800:1bb0:ad47:5d1f:f4a2:7b1c' // Your IPv6
];

// Known bot user agents (partial matches)
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'facebook', 'twitter', 'linkedin',
  'whatsapp', 'telegram', 'slackbot', 'discordbot', 'googlebot', 'bingbot',
  'yandexbot', 'baiduspider', 'duckduckbot', 'applebot', 'amazonbot',
  'headlesschrome', 'phantomjs', 'selenium', 'webdriver', 'puppeteer',
  'playwright', 'curl', 'wget', 'postman', 'insomnia', 'httpie'
];

// Additional bot detection patterns
const SUSPICIOUS_PATTERNS = [
  'python', 'java', 'ruby', 'php', 'node', 'go/', 'rust',
  'monitor', 'check', 'test', 'scan', 'probe', 'fetch'
];

function detectBot(userAgent: string | null, headers: Headers): boolean {
  console.log('Bot detection - User Agent:', userAgent);
  
  // No user agent is suspicious
  if (!userAgent) {
    console.log('Bot detected: Missing user agent');
    return true;
  }

  const lowerUA = userAgent.toLowerCase();
  
  // Check against known bot patterns
  for (const botPattern of BOT_USER_AGENTS) {
    if (lowerUA.includes(botPattern)) {
      console.log(`Bot detected: User agent contains "${botPattern}"`);
      return true;
    }
  }
  
  // Check against suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (lowerUA.includes(pattern)) {
      console.log(`Bot detected: User agent contains suspicious pattern "${pattern}"`);
      return true;
    }
  }
  
  // Check for missing Accept header (common in bots)
  const acceptHeader = headers.get('Accept');
  if (!acceptHeader || !acceptHeader.includes('text/html')) {
    console.log('Bot detected: Missing or invalid Accept header');
    return true;
  }
  
  // Check for missing Accept-Language header (common in bots)
  const acceptLanguage = headers.get('Accept-Language');
  if (!acceptLanguage) {
    console.log('Bot detected: Missing Accept-Language header');
    return true;
  }
  
  console.log('Human visitor detected');
  return false;
}

function getClientIP(req: Request): string | null {
  // Try various headers for the real IP
  const headers = [
    'CF-Connecting-IP',     // Cloudflare
    'X-Real-IP',           // Nginx
    'X-Forwarded-For',     // Standard proxy header
    'X-Client-IP',         // Some proxies
    'X-Forwarded',         // Alternative
    'Forwarded-For',       // Alternative
    'Forwarded'            // RFC 7239
  ];
  
  for (const header of headers) {
    const value = req.headers.get(header);
    if (value) {
      // X-Forwarded-For can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim();
      console.log(`IP found in ${header}: ${ip}`);
      return ip;
    }
  }
  
  console.log('No IP found in headers');
  return null;
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

    // Get client information
    const userAgent = req.headers.get('User-Agent');
    const clientIP = getClientIP(req);
    
    console.log('Client IP:', clientIP);
    console.log('User Agent:', userAgent);

    // Get current year and month for tracking
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    // Check if IP should be excluded (your IP)
    if (clientIP && EXCLUDED_IPS.includes(clientIP)) {
      console.log(`Visit excluded: IP ${clientIP} is in exclusion list`);
      await trackExcludedVisit(supabase, year, month, 'other_excluded_count');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Visit excluded - owner IP',
          excluded_reason: 'owner_ip',
          ip: clientIP
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Check if this is a bot
    if (detectBot(userAgent, req.headers)) {
      console.log('Visit excluded: Bot detected');
      await trackExcludedVisit(supabase, year, month, 'bot_visits_count');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Visit excluded - bot detected',
          excluded_reason: 'bot',
          user_agent: userAgent
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

    // Skip tracking if user is admin
    if (isAdmin) {
      console.log('Visit excluded: Admin user')
      await trackExcludedVisit(supabase, year, month, 'admin_visits_count');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin visit excluded from tracking',
          excluded_reason: 'admin'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log(`=== TRACKING LEGITIMATE VISIT FOR ${year}-${month} ===`)
    console.log('Visit details:', {
      ip: clientIP,
      userAgent: userAgent?.substring(0, 100),
      timestamp: now.toISOString()
    });

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

    console.log('=== VISIT SUCCESSFULLY TRACKED ===')

    return new Response(
      JSON.stringify({ 
        success: true, 
        year, 
        month,
        message: 'Visit tracked successfully',
        client_info: {
          ip: clientIP,
          user_agent: userAgent?.substring(0, 100)
        }
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
