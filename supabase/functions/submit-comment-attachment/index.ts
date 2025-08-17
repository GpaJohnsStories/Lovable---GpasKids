
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const formData = await req.formData()
    const personalId = formData.get('personalId') as string
    const subject = formData.get('subject') as string
    const content = formData.get('content') as string
    const file = formData.get('attachment') as File
    const caption = formData.get('caption') as string

    console.log('Received comment submission with attachment:', {
      personalId: personalId?.substring(0, 3) + '***',
      subject: subject?.substring(0, 20) + '...',
      hasFile: !!file,
      fileName: file?.name
    })

    // Validate required fields
    if (!personalId || personalId.length !== 6) {
      throw new Error('Valid Personal ID (6 characters) is required')
    }

    if (!subject || subject.length < 2) {
      throw new Error('Subject must be at least 2 characters')
    }

    if (!content || content.length < 10) {
      throw new Error('Content must be at least 10 characters')
    }

    // Validate file if present
    if (file) {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB')
      }

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed')
      }

      // Generate filename with PID and timestamp for easy identification
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileExtension = file.name.split('.').pop()
      const uniqueFileName = `pending/${personalId.toUpperCase()}_${timestamp}_${crypto.randomUUID().substring(0, 8)}.${fileExtension}`

      console.log('Uploading file to pending bucket:', uniqueFileName)

      // Upload file to pending bucket
      const { error: uploadError } = await supabase.storage
        .from('orange-gang-pending')
        .upload(uniqueFileName, file, {
          contentType: file.type,
          upsert: false
        })

      if (uploadError) {
        console.error('File upload error:', uploadError)
        throw new Error(`Failed to upload file: ${uploadError.message}`)
      }

      // Create comment with attachment info
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .insert({
          personal_id: personalId.toUpperCase(),
          subject,
          content,
          attachment_bucket: 'orange-gang-pending',
          attachment_path: uniqueFileName,
          attachment_mime: file.type,
          attachment_caption: caption || null,
          status: 'pending'
        })
        .select()
        .single()

      if (commentError) {
        console.error('Comment creation error:', commentError)
        // Clean up uploaded file if comment creation fails
        await supabase.storage
          .from('orange-gang-pending')
          .remove([uniqueFileName])
        throw new Error(`Failed to create comment: ${commentError.message}`)
      }

      console.log('Comment with attachment created successfully:', comment.id)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Comment with photo submitted successfully! It will be reviewed before being posted.',
          commentId: comment.id
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201
        }
      )
    } else {
      // Create comment without attachment (fallback to regular comment creation)
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .insert({
          personal_id: personalId.toUpperCase(),
          subject,
          content,
          status: 'pending'
        })
        .select()
        .single()

      if (commentError) {
        console.error('Comment creation error:', commentError)
        throw new Error(`Failed to create comment: ${commentError.message}`)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Comment submitted successfully!',
          commentId: comment.id
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201
        }
      )
    }

  } catch (error) {
    console.error('Error in submit-comment-attachment:', error)
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
