
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // SECURITY: Verify admin access
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const tempSupabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  // Verify user is admin
  const { data: user } = await tempSupabaseClient.auth.getUser();
  if (!user.user) {
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: isAdmin } = await tempSupabaseClient.rpc('is_admin');
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Admin access required' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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

    const zipEntries: { name: string, content: string | null, size: number, checksum?: string, skipped?: boolean, reason?: string, error?: string }[] = [];
    const errors: string[] = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB per file
    const maxTotalSize = 50 * 1024 * 1024; // 50MB total
    let totalProcessedSize = 0;

    // Download each file and calculate checksum with size limits
    for (const file of files) {
      try {
        console.log(`Processing file: ${file.name}...`);
        
        // Check individual file size limit
        const fileSize = file.metadata?.size ? parseInt(file.metadata.size) : 0;
        if (fileSize > maxFileSize) {
          console.warn(`Skipping large file ${file.name} (${fileSize} bytes)`);
          zipEntries.push({
            name: file.name,
            content: null,
            size: fileSize,
            skipped: true,
            reason: `File too large (${Math.round(fileSize / 1024 / 1024)}MB > 5MB limit)`
          });
          continue;
        }
        
        // Check total size limit
        if (totalProcessedSize + fileSize > maxTotalSize) {
          console.warn(`Skipping file ${file.name} due to total size limit`);
          zipEntries.push({
            name: file.name,
            content: null,
            size: fileSize,
            skipped: true,
            reason: `Total size limit exceeded`
          });
          continue;
        }

        const { data: fileData, error: downloadError } = await supabaseClient
          .storage
          .from(bucketName)
          .download(file.name);

        if (downloadError || !fileData) {
          console.error(`Error downloading ${file.name}:`, downloadError);
          errors.push(`Failed to download ${file.name}: ${downloadError?.message || 'Unknown error'}`);
          zipEntries.push({
            name: file.name,
            content: null,
            size: fileSize,
            error: downloadError?.message || 'Download failed'
          });
          continue;
        }

        // Convert blob to base64 for JSON transport with chunked processing
        const arrayBuffer = await fileData.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Use safer base64 conversion for large data
        const chunks: string[] = [];
        const chunkSize = 8192; // Process in 8KB chunks
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
        }
        const base64Content = btoa(chunks.join(''));

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
        
        totalProcessedSize += arrayBuffer.byteLength;

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Error processing file ${file.name}:`, errorMsg);
        errors.push(`Error processing ${file.name}: ${errorMsg}`);
        zipEntries.push({
          name: file.name,
          content: null,
          size: file.metadata?.size ? parseInt(file.metadata.size) : 0,
          error: errorMsg
        });
      }
    }

    // Create manifest with processing summary
    const processedCount = zipEntries.filter(f => f.content !== null && !f.skipped).length;
    const skippedCount = zipEntries.filter(f => f.skipped).length;
    const errorCount = zipEntries.filter(f => f.error).length;
    
    const manifest = {
      created_at: new Date().toISOString(),
      bucket_name: bucketName,
      bucket_public: bucket.public,
      total_files: files.length,
      processed_files: processedCount,
      skipped_files: skippedCount,
      error_files: errorCount,
      total_size: zipEntries.reduce((sum, entry) => sum + entry.size, 0),
      processing_limits: {
        max_file_size_mb: 5,
        max_total_size_mb: 50
      },
      files: zipEntries.map(entry => ({
        name: entry.name,
        size: entry.size,
        content_included: !!entry.content,
        skipped: !!entry.skipped,
        skip_reason: entry.reason,
        error: entry.error,
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
      processed_files: processedCount,
      skipped_files: skippedCount,
      error_files: errorCount,
      errors: errors,
      description: `GPA Stories ${bucketName} bucket backup with checksums`,
      notes: errors.length > 0 ? 'Some files had errors during processing' : 
             skippedCount > 0 ? 'Some files were skipped due to size limits' : 
             'All files processed successfully'
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
