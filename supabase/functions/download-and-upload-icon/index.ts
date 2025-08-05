import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DownloadRequest {
  googleDriveUrl: string;
  fileName: string;
  description?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting download and upload process...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { googleDriveUrl, fileName, description }: DownloadRequest = await req.json();
    
    if (!googleDriveUrl || !fileName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: googleDriveUrl and fileName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Downloading image from: ${googleDriveUrl}`);
    console.log(`Target filename: ${fileName}`);

    // Convert Google Drive share link to direct download link
    let downloadUrl = googleDriveUrl;
    
    // Handle Google Drive share URLs
    if (googleDriveUrl.includes('drive.google.com/file/d/')) {
      const fileId = googleDriveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        console.log(`Converted to direct download URL: ${downloadUrl}`);
      }
    }

    // Download the image
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      console.error(`Failed to download image: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: `Failed to download image: ${response.statusText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const imageBlob = new Blob([imageBuffer]);
    
    console.log(`Downloaded image size: ${imageBuffer.byteLength} bytes`);

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('icons')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: `Upload failed: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Image uploaded successfully:', uploadData);

    // Add to icon_library table
    const { data: libraryData, error: libraryError } = await supabase
      .from('icon_library')
      .upsert({
        filename: fileName,
        description: description || 'Peppermint candy audio button icon',
        category: 'audio',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'filename'
      });

    if (libraryError) {
      console.error('Library insert error:', libraryError);
      return new Response(
        JSON.stringify({ error: `Failed to add to library: ${libraryError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Icon added to library successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        fileName,
        uploadPath: uploadData?.path,
        libraryEntry: libraryData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});