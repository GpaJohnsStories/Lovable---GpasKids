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
    console.log('Starting GeoIP database refresh...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const maxmindLicenseKey = Deno.env.get('MAXMIND_LICENSE_KEY');

    if (!maxmindLicenseKey) {
      throw new Error('MAXMIND_LICENSE_KEY not configured');
    }

    // Initialize Supabase client with service role key for system operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          'x-client-info': 'supabase-js/edge-function'
        }
      }
    });

    // Set client type for RLS policies
    await supabase.rpc('set_config', {
      setting_name: 'app.client_type',
      setting_value: 'service'
    });

    console.log('Downloading GeoLite2-Country database from MaxMind...');
    
    // Download the GeoLite2-Country database
    const downloadUrl = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${maxmindLicenseKey}&suffix=tar.gz`;
    
    const downloadResponse = await fetch(downloadUrl);
    if (!downloadResponse.ok) {
      throw new Error(`Failed to download GeoIP database: ${downloadResponse.status} ${downloadResponse.statusText}`);
    }

    console.log('Download successful, extracting MMDB file...');
    
    // Get the tar.gz content
    const tarGzBuffer = await downloadResponse.arrayBuffer();
    
    // For simplicity, we'll use a different approach - download the MMDB directly
    // MaxMind also provides direct MMDB downloads
    const mmdbUrl = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${maxmindLicenseKey}&suffix=mmdb`;
    
    const mmdbResponse = await fetch(mmdbUrl);
    if (!mmdbResponse.ok) {
      throw new Error(`Failed to download MMDB file: ${mmdbResponse.status} ${mmdbResponse.statusText}`);
    }

    const mmdbBuffer = await mmdbResponse.arrayBuffer();
    const mmdbFile = new Uint8Array(mmdbBuffer);
    
    console.log(`Downloaded MMDB file, size: ${mmdbFile.length} bytes`);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('geoip')
      .upload('GeoLite2-Country.mmdb', mmdbFile, {
        contentType: 'application/octet-stream',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Failed to upload to storage: ${uploadError.message}`);
    }

    console.log('Successfully uploaded GeoIP database to storage:', uploadData);

    return new Response(JSON.stringify({
      success: true,
      message: 'GeoIP database refreshed successfully',
      upload_path: uploadData.path,
      file_size: mmdbFile.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error refreshing GeoIP database:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});