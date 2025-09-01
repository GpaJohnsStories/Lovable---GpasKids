
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5) + 'Z';
    const filename = `gpaskids_backup_${timestamp}.zip`;

    console.log('Starting database backup export...');

    // Tables to export (excluding sensitive/system tables)
    const tablesToExport = [
      'stories', 'comments', 'story_reads', 'story_votes', 'author_bios',
      'friend_names', 'monthly_visits', 'monthly_country_visits', 
      'donations_monthly', 'used_personal_ids', 'profiles'
    ];

    const zipEntries: { name: string, content: string }[] = [];

    // Export each table as CSV
    for (const table of tablesToExport) {
      try {
        const { data, error } = await supabaseClient
          .from(table)
          .select('*');

        if (error) {
          console.error(`Error exporting ${table}:`, error);
          continue;
        }

        if (data && data.length > 0) {
          // Convert to CSV
          const headers = Object.keys(data[0]);
          const csvContent = [
            headers.join(','),
            ...data.map(row => 
              headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined) return '';
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return String(value);
              }).join(',')
            )
          ].join('\n');

          zipEntries.push({
            name: `data/${table}.csv`,
            content: csvContent
          });
        }
      } catch (err) {
        console.error(`Error processing table ${table}:`, err);
      }
    }

    // Get schema information
    const { data: schemaData, error: schemaError } = await supabaseClient
      .rpc('export_public_schema_json');

    if (!schemaError && schemaData) {
      zipEntries.push({
        name: 'schema.json',
        content: JSON.stringify(schemaData, null, 2)
      });
    }

    // Get RLS policies
    const { data: policiesData, error: policiesError } = await supabaseClient
      .rpc('export_public_rls_policies_json');

    if (!policiesError && policiesData) {
      zipEntries.push({
        name: 'policies.json',
        content: JSON.stringify(policiesData, null, 2)
      });
    }

    // Get storage buckets metadata
    const { data: bucketsData, error: bucketsError } = await supabaseClient
      .storage
      .listBuckets();

    if (!bucketsError && bucketsData) {
      // Get files list for each bucket
      const assetsManifest: any = {
        generated_at: new Date().toISOString(),
        buckets: []
      };

      for (const bucket of bucketsData) {
        try {
          const { data: files, error: filesError } = await supabaseClient
            .storage
            .from(bucket.name)
            .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

          if (!filesError && files) {
            const bucketInfo = {
              name: bucket.name,
              public: bucket.public,
              file_count: files.length,
              files: files.map(file => ({
                name: file.name,
                size: file.metadata?.size || 0,
                content_type: file.metadata?.mimetype || 'unknown',
                last_modified: file.updated_at,
                public_url: bucket.public ? 
                  `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/${bucket.name}/${file.name}` : 
                  null
              }))
            };
            assetsManifest.buckets.push(bucketInfo);
          }
        } catch (err) {
          console.error(`Error listing files in bucket ${bucket.name}:`, err);
        }
      }

      zipEntries.push({
        name: 'assets-manifest.json',
        content: JSON.stringify(assetsManifest, null, 2)
      });
    }

    // Add backup info
    const backupInfo = {
      created_at: new Date().toISOString(),
      filename: filename,
      backup_type: 'database_and_metadata',
      tables_exported: tablesToExport,
      total_entries: zipEntries.length,
      description: 'GPA Stories database backup with schema, policies, and asset metadata'
    };

    zipEntries.push({
      name: 'backup-info.json',
      content: JSON.stringify(backupInfo, null, 2)
    });

    // Create ZIP content (simple implementation)
    console.log(`Creating ZIP with ${zipEntries.length} entries...`);
    
    // For now, create a simple concatenated format that can be processed client-side
    // In a production environment, you'd use a proper ZIP library
    const zipContent = JSON.stringify({
      filename: filename,
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
    console.error('Database backup export error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create database backup' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
