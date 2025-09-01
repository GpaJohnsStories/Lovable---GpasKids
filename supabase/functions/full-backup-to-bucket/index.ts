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
    console.log('🎒 Starting full backup to bucket process...');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5) + 'Z';
    const backupFilename = `gpaskids_full_backup_${timestamp}.json`;

    console.log(`📦 Creating full backup: ${backupFilename}`);

    // Step 1: Get database backup
    console.log('📊 Fetching database backup...');
    const { data: dbData, error: dbError } = await supabaseClient.functions.invoke('export-db-backup');
    
    if (dbError) {
      console.error('❌ Database backup failed:', dbError);
      throw new Error(`Database backup failed: ${dbError.message}`);
    }

    // Step 2: Get all storage buckets backup
    const storageBuckets = ['story-photos', 'story-videos', 'story-audio', 'icons', 'orange-gang', 'orange-gang-pending'];
    const bucketBackups: any = {};

    for (const bucketName of storageBuckets) {
      console.log(`🗂️ Backing up bucket: ${bucketName}...`);
      try {
        const { data: bucketData, error: bucketError } = await supabaseClient.functions.invoke('download-bucket-zip', {
          body: { bucket: bucketName }
        });
        
        if (bucketError) {
          console.warn(`⚠️ Bucket ${bucketName} backup failed:`, bucketError.message);
          bucketBackups[bucketName] = { error: bucketError.message };
        } else {
          bucketBackups[bucketName] = bucketData;
        }
      } catch (err) {
        console.warn(`⚠️ Bucket ${bucketName} backup error:`, err);
        bucketBackups[bucketName] = { error: err instanceof Error ? err.message : 'Unknown error' };
      }
    }

    // Step 3: Create comprehensive backup object
    const fullBackup = {
      backup_info: {
        created_at: new Date().toISOString(),
        filename: backupFilename,
        backup_type: 'full_system_backup',
        description: 'Complete GPA Stories system backup including database and all storage buckets',
        components: {
          database: 'included',
          storage_buckets: Object.keys(bucketBackups),
          version: '1.0'
        }
      },
      database_backup: dbData,
      storage_backups: bucketBackups
    };

    console.log('💾 Uploading backup to storage...');

    // Step 4: Upload to backups bucket
    const backupContent = JSON.stringify(fullBackup, null, 2);
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('backups')
      .upload(backupFilename, new Blob([backupContent], { type: 'application/json' }), {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Upload to backups bucket failed:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('✅ Full backup completed successfully!');

    // Step 5: Clean up old backups (keep only last 30)
    try {
      console.log('🧹 Cleaning up old backups...');
      const { data: existingFiles, error: listError } = await supabaseClient.storage
        .from('backups')
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (!listError && existingFiles && existingFiles.length > 30) {
        const filesToDelete = existingFiles.slice(30).map(file => file.name);
        console.log(`🗑️ Deleting ${filesToDelete.length} old backup files...`);
        
        const { error: deleteError } = await supabaseClient.storage
          .from('backups')
          .remove(filesToDelete);
        
        if (deleteError) {
          console.warn('⚠️ Error cleaning up old backups:', deleteError.message);
        } else {
          console.log(`✅ Cleaned up ${filesToDelete.length} old backup files`);
        }
      }
    } catch (cleanupError) {
      console.warn('⚠️ Cleanup error (non-fatal):', cleanupError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Full backup completed successfully',
      filename: backupFilename,
      backup_size: backupContent.length,
      components_backed_up: {
        database: !!dbData,
        storage_buckets: Object.keys(bucketBackups).length
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('💥 Full backup error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Full backup failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
