
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let bucketName = url.searchParams.get('bucket');

    // If no bucket in query params, try to get it from request body
    if (!bucketName && req.method === 'POST') {
      try {
        const body = await req.json();
        bucketName = body.bucket;
      } catch {
        // If JSON parsing fails, continue with null bucketName
      }
    }

    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Bucket name is required in query parameter or request body' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5) + 'Z';
    const filename = `gpaskids_${bucketName}_${timestamp}.zip`;

    console.log(`Starting bucket ${bucketName} backup export...`);

    // Get bucket info
    const { data: buckets, error: bucketError } = await supabaseClient
      .storage
      .listBuckets();

    const bucket = buckets?.find(b => b.name === bucketName);
    if (!bucket) {
      return new Response(
        JSON.stringify({ error: `Bucket '${bucketName}' not found` }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get files list
    const { data: files, error: filesError } = await supabaseClient
      .storage
      .from(bucketName)
      .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

    if (filesError || !files) {
      return new Response(
        JSON.stringify({ error: `Failed to list files in bucket: ${filesError?.message}` }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const zipEntries: { name: string, content: string, size: number, checksum?: string }[] = [];

    // Download each file and calculate checksum
    for (const file of files) {
      try {
        const { data: fileData, error: downloadError } = await supabaseClient
          .storage
          .from(bucketName)
          .download(file.name);

        if (downloadError || !fileData) {
          console.error(`Error downloading ${file.name}:`, downloadError);
          continue;
        }

        // Convert blob to base64 for JSON transport
        const arrayBuffer = await fileData.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64Content = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));

        // Calculate SHA-256 checksum
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const checksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        zipEntries.push({
          name: file.name,
          content: base64Content,
          size: arrayBuffer.byteLength,
          checksum: checksum
        });

      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
      }
    }

    // Create manifest
    const manifest = {
      created_at: new Date().toISOString(),
      bucket_name: bucketName,
      bucket_public: bucket.public,
      total_files: files.length,
      total_size: zipEntries.reduce((sum, entry) => sum + entry.size, 0),
      files: zipEntries.map(entry => ({
        name: entry.name,
        size: entry.size,
        checksum: entry.checksum,
        content_type: files.find(f => f.name === entry.name)?.metadata?.mimetype || 'unknown'
      }))
    };

    zipEntries.push({
      name: 'manifest.json',
      content: JSON.stringify(manifest, null, 2),
      size: 0
    });

    // Add backup info
    const backupInfo = {
      created_at: new Date().toISOString(),
      filename: filename,
      backup_type: 'storage_bucket',
      bucket_name: bucketName,
      total_entries: zipEntries.length,
      description: `GPA Stories ${bucketName} bucket backup with checksums`
    };

    zipEntries.push({
      name: 'backup-info.json',
      content: JSON.stringify(backupInfo, null, 2),
      size: 0
    });

    console.log(`Creating ZIP with ${zipEntries.length} entries for bucket ${bucketName}...`);
    
    // Create response with ZIP-like structure
    const zipContent = JSON.stringify({
      filename: filename,
      bucket: bucketName,
      entries: zipEntries
    });

    return new Response(zipContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}.json"`
      }
    });

  } catch (error) {
    console.error('Bucket backup export error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create bucket backup' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
