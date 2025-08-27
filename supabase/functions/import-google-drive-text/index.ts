import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportRequest {
  googleDriveShareCode: string;
}

serve(async (req) => {
  console.log('🔧 Google Drive text import function started');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { googleDriveShareCode }: ImportRequest = await req.json();
    console.log('📥 Processing Google Drive share code:', googleDriveShareCode?.substring(0, 20) + '...');

    if (!googleDriveShareCode) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Google Drive share code is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Convert Google Drive share link to direct download link
    let downloadUrl = '';
    
    // Handle different Google Drive URL formats
    if (googleDriveShareCode.includes('drive.google.com/file/d/')) {
      const fileId = googleDriveShareCode.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    } else if (googleDriveShareCode.includes('drive.google.com/open?id=')) {
      const fileId = googleDriveShareCode.match(/id=([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    } else if (googleDriveShareCode.match(/^[a-zA-Z0-9-_]+$/)) {
      // Assume it's just the file ID
      downloadUrl = `https://drive.google.com/uc?export=download&id=${googleDriveShareCode}`;
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid Google Drive share code format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🔗 Download URL:', downloadUrl);

    // Fetch the file content
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GpaStories/1.0)',
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch from Google Drive:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to fetch file from Google Drive: ${response.status} ${response.statusText}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const textContent = await response.text();
    console.log('📄 Text content length:', textContent.length);

    if (!textContent || textContent.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No text content found in the Google Drive file' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        textContent: textContent.trim()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('🚨 Error in import-google-drive-text function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});