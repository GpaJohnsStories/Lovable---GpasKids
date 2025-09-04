import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StoryData {
  id: string;
  story_code: string;
  title: string;
  audio_generated_at: string | null;
}

interface FileEntry {
  path: string;
  size_bytes: number;
  updated_at: string;
  story_id: string | null;
  story_code: string | null;
  title: string | null;
  filename: string;
  signed_url?: string;
}

// Helper to sanitize filename
function sanitizeFilename(text: string): string {
  return text
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper to truncate title to max 10 words
function truncateTitle(title: string, maxWords: number = 10): string {
  const words = title.split(/\s+/);
  if (words.length <= maxWords) return title;
  return words.slice(0, maxWords).join(' ');
}

// Helper to format date for filename
function formatDateForFilename(date: Date): string {
  return date.toISOString()
    .replace('T', ' ')
    .replace(/:/g, '-')
    .replace(/\.\d{3}Z$/, ' UTC');
}

// Helper to extract story code from filename (AAA-BBB.mp3/mp4 format)
function extractStoryCode(filename: string): string | null {
  // New format: story codes like AAA-BBB.mp3, AAA-123.mp4, etc.
  const match = filename.match(/^([A-Z]{3}-[A-Z0-9]{3})\.(mp3|mp4)$/);
  return match ? match[1] : null;
}


// Helper to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('❌ No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('🔑 Authorization header present, validating...');

    // Create user-scoped client for admin validation
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Create service client for storage operations
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user info using user-scoped client
    const { data: { user }, error: authError } = await userClient.auth.getUser();

    if (authError || !user) {
      console.log('❌ Auth validation failed:', authError?.message || 'No user found');
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`✅ User authenticated: ${user.email} (ID: ${user.id})`);

    // Check if user is admin using user-scoped client
    const { data: isAdminResult, error: adminError } = await userClient
      .rpc('is_admin_safe');

    console.log(`🔍 Admin check result: ${isAdminResult}, error: ${adminError?.message || 'none'}`);

    if (adminError || !isAdminResult) {
      console.log(`❌ Admin access denied for user: ${user.email}`);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`✅ Admin access confirmed for user: ${user.email}`);

    // Use serviceClient for all storage operations below

    const { 
      bucket = 'story-audio',
      mode = 'all',
      sinceDate,
      includeSignedUrls = true,
      expiresInSeconds = 172800, // 48 hours
      minSizeBytes = 0 // New parameter for minimum file size filtering
    } = await req.json();

    console.log(`Processing backup request: bucket=${bucket}, mode=${mode}, sinceDate=${sinceDate}, minSizeBytes=${minSizeBytes}`);

    // Convert sinceDate to timestamp for comparison if provided
    let filterDate: Date | null = null;
    if (mode === 'sinceDate' && sinceDate) {
      // The date comes in YYYY-MM-DD format, set to 00:00:00
      filterDate = new Date(sinceDate + 'T00:00:00.000Z');
      console.log(`Filtering files updated after: ${filterDate.toISOString()}`);
    }

    // List all objects in the bucket
    const { data: files, error: listError } = await serviceClient.storage
      .from(bucket)
      .list('', {
        limit: 1000,
        sortBy: { column: 'updated_at', order: 'desc' }
      });

    if (listError) {
      console.error('Error listing files:', listError);
      return new Response(
        JSON.stringify({ error: 'Failed to list files', details: listError }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Found ${files?.length || 0} total files in bucket`);

    // Extract story codes from filenames
    const storyCodes = new Set<string>();
    const fileMap = new Map<string, any>();

    for (const file of files || []) {
      const storyCode = extractStoryCode(file.name);
      if (storyCode) {
        storyCodes.add(storyCode);
        console.log(`📝 Found story code: ${storyCode} for file: ${file.name}`);
      }
      fileMap.set(file.name, file);
    }

    console.log(`Found ${storyCodes.size} story codes`);

    // Fetch story data by story codes
    const storyDataByCode = new Map<string, StoryData>();
    
    if (storyCodes.size > 0) {
      const { data: stories, error: storyError } = await serviceClient
        .from('stories')
        .select('id, story_code, title, audio_generated_at')
        .in('story_code', Array.from(storyCodes));

      if (storyError) {
        console.error('Error fetching stories by code:', storyError);
      } else {
        for (const story of stories || []) {
          storyDataByCode.set(story.story_code, story);
          console.log(`📖 Loaded story by code: ${story.story_code} - "${story.title}"`);
        }
      }
    }

    console.log(`Loaded ${storyDataByCode.size} stories by code`);

    // Process files and build entries
    const entries: FileEntry[] = [];
    let totalSize = 0;

    for (const file of files || []) {
      // Skip files that don't meet the minimum size requirement
      const fileSize = file.metadata?.size ? parseInt(file.metadata.size.toString()) : 0;
      if (fileSize < minSizeBytes) {
        continue;
      }

      // Get story data by story code
      const storyCode = extractStoryCode(file.name);
      
      let story: StoryData | null = null;
      let fileStoryCode: string | null = null;

      if (storyCode) {
        story = storyDataByCode.get(storyCode) || null;
        fileStoryCode = storyCode;
        console.log(`🔍 Processing by story code: ${storyCode} → ${story ? `"${story.title}"` : 'Not found'}`);
      }
      
      // Determine the "last updated" timestamp for this audio file
      const audioUpdated = story?.audio_generated_at || file.updated_at;
      const fileUpdatedDate = new Date(audioUpdated);

      // Apply date filter if specified
      if (filterDate && fileUpdatedDate < filterDate) {
        continue;
      }
      
      // Generate custom filename with proper fallbacks
      const displayStoryCode = story?.story_code || fileStoryCode || 'unknown';
      const titlePart = story?.title ? truncateTitle(sanitizeFilename(story.title)) : 'Unknown Title';
      const datePart = formatDateForFilename(fileUpdatedDate);
      const fileExtension = file.name.endsWith('.mp4') ? '.mp4' : '.mp3';
      const customFilename = `${sanitizeFilename(displayStoryCode)} - ${titlePart} - ${datePart}${fileExtension}`;

      const entry: FileEntry = {
        path: file.name,
        size_bytes: fileSize,
        updated_at: audioUpdated,
        story_id: null, // No legacy IDs anymore
        story_code: story?.story_code || fileStoryCode,
        title: story?.title || null,
        filename: customFilename
      };

      entries.push(entry);
      totalSize += fileSize;
    }

    console.log(`After filtering: ${entries.length} files, total size: ${formatFileSize(totalSize)}`);

    // Initialize error tracking
    let totalErrors = 0;

    // Generate signed URLs if requested
    if (includeSignedUrls) {
      console.log('Generating signed URLs...');
      
      // Process in batches to avoid timeouts
      const batchSize = 50;
      
      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);
        const batchIndex = Math.floor(i/batchSize);
        let batchErrors = 0;
        
        for (const entry of batch) {
          try {
            const { data: signedUrl, error: urlError } = await serviceClient.storage
              .from(bucket)
              .createSignedUrl(entry.path, expiresInSeconds, {
                download: entry.filename // This sets the download filename
              });

            if (urlError) {
              const errorMsg = `Failed to create signed URL: ${urlError.message}`;
              console.error(`❌ ${entry.path}: ${errorMsg}`);
              batchErrors++;
              continue;
            }

            if (signedUrl) {
              entry.signed_url = signedUrl.signedUrl;
              console.log(`✅ Generated signed URL for: ${entry.path}`);
            } else {
              console.error(`❌ ${entry.path}: No signed URL returned`);
              batchErrors++;
            }
          } catch (error) {
            const errorMsg = `Processing error: ${error.message}`;
            console.error(`❌ ${entry.path}: ${errorMsg}`);
            batchErrors++;
          }
        }
        
        totalErrors += batchErrors;
        const batchNum = batchIndex + 1;
        const totalBatches = Math.ceil(entries.length/batchSize);
        console.log(`📦 Batch ${batchNum}/${totalBatches}: ${batch.length - batchErrors} succeeded, ${batchErrors} failed`);
      }
    }

    console.log(`📊 Manifest generation complete: ${entries.length} files processed, ${totalErrors} errors`);

    const result = {
      bucket,
      mode,
      entries: entries,
      totals: {
        count: entries.length,
        size_bytes: totalSize,
        size_pretty: formatFileSize(totalSize),
        errors: totalErrors
      },
      generated_at: new Date().toISOString(),
      request_id: crypto.randomUUID()
    };

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        request_id: crypto.randomUUID()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});