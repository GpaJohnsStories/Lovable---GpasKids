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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { commentId } = await req.json()

    console.log('Approving comment photo for comment ID:', commentId)

    // Get the comment with attachment info
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .single()

    if (commentError || !comment) {
      throw new Error(`Comment not found: ${commentError?.message}`)
    }

    if (!comment.attachment_path || comment.attachment_bucket !== 'orange-gang-pending') {
      throw new Error('Comment does not have a pending photo attachment')
    }

    console.log('Found comment with attachment:', {
      id: comment.id,
      personalId: comment.personal_id?.substring(0, 3) + '***',
      attachmentPath: comment.attachment_path
    })

    // Extract PID and timestamp from filename for new filename
    const originalFilename = comment.attachment_path.replace('pending/', '')
    const fileExtension = originalFilename.split('.').pop()
    
    // Create new filename with same PID encoding for public bucket
    const newFilename = `approved/${originalFilename}`

    // Download file from pending bucket
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('orange-gang-pending')
      .download(comment.attachment_path)

    if (downloadError) {
      console.error('Error downloading file from pending bucket:', downloadError)
      throw new Error(`Failed to download file: ${downloadError.message}`)
    }

    console.log('Downloaded file from pending bucket, size:', fileData.size)

    // Upload to public orange-gang bucket
    const { error: uploadError } = await supabase.storage
      .from('orange-gang')
      .upload(newFilename, fileData, {
        contentType: comment.attachment_mime || 'image/jpeg',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading to public bucket:', uploadError)
      throw new Error(`Failed to upload to public bucket: ${uploadError.message}`)
    }

    console.log('Uploaded file to public bucket:', newFilename)

    // Update comment status and bucket info
    const { error: updateError } = await supabase
      .from('comments')
      .update({
        status: 'approved',
        attachment_bucket: 'orange-gang',
        attachment_path: newFilename,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)

    if (updateError) {
      console.error('Error updating comment:', updateError)
      // Clean up uploaded file if comment update fails
      await supabase.storage
        .from('orange-gang')
        .remove([newFilename])
      throw new Error(`Failed to update comment: ${updateError.message}`)
    }

    // Remove file from pending bucket
    const { error: removeError } = await supabase.storage
      .from('orange-gang-pending')
      .remove([comment.attachment_path])

    if (removeError) {
      console.warn('Warning: Failed to remove file from pending bucket:', removeError)
      // Don't fail the whole operation for this
    }

    console.log('Comment photo approved successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Photo approved and moved to public gallery',
        publicPath: newFilename
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in approve-comment-photo:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})