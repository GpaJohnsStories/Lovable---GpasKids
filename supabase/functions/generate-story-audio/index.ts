// Audio generation edge function - Updated for deployment
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-client-type, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { storyId, voiceName } = await req.json()

    if (!storyId) {
      throw new Error('Story ID is required')
    }

    console.log(`🎵 Generating audio for story: ${storyId}`)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch story details
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .single()

    if (storyError || !story) {
      console.error('❌ Story not found:', storyError)
      throw new Error('Story not found')
    }

    // ===== COMPREHENSIVE TEXT CLEANING FOR TTS =====
    
    /**
     * Extract header tokens from content (TITLE, TAGLINE, AUTHOR, EXCERPT)
     */
    const extractHeaderTokens = (content: string) => {
      const tokens: any = {}
      
      // Extract block-style tokens like {{TITLE}}content{{/TITLE}}
      const blockPatterns = {
        title: /\{\{TITLE\}\}([\s\S]*?)\{\{\/TITLE\}\}/gi,
        tagline: /\{\{TAGLINE\}\}([\s\S]*?)\{\{\/TAGLINE\}\}/gi,
        author: /\{\{AUTHOR\}\}([\s\S]*?)\{\{\/AUTHOR\}\}/gi,
        excerpt: /\{\{EXCERPT\}\}([\s\S]*?)\{\{\/EXCERPT\}\}/gi
      }
      
      for (const [key, pattern] of Object.entries(blockPatterns)) {
        const match = pattern.exec(content)
        if (match) {
          tokens[key] = match[1].trim()
        }
      }
      
      // Extract colon-style tokens like {{TITLE: content}}
      const colonPatterns = {
        title: /\{\{TITLE:\s*([^}]+?)\}\}/gi,
        tagline: /\{\{TAGLINE:\s*([^}]+?)\}\}/gi,
        author: /\{\{AUTHOR:\s*([^}]+?)\}\}/gi,
        excerpt: /\{\{EXCERPT:\s*([^}]+?)\}\}/gi
      }
      
      for (const [key, pattern] of Object.entries(colonPatterns)) {
        if (!tokens[key]) { // Only use if not already found
          const match = pattern.exec(content)
          if (match) {
            tokens[key] = match[1].trim()
          }
        }
      }
      
      return tokens
    }
    
    /**
     * Strip all tokens and clean content for TTS
     */
    const cleanContentForTTS = (content: string) => {
      let cleaned = content
      
      // Strip header tokens (both block and colon style)
      cleaned = cleaned.replace(/\{\{TITLE\}\}[\s\S]*?\{\{\/TITLE\}\}/gi, '')
      cleaned = cleaned.replace(/\{\{TAGLINE\}\}[\s\S]*?\{\{\/TAGLINE\}\}/gi, '')
      cleaned = cleaned.replace(/\{\{AUTHOR\}\}[\s\S]*?\{\{\/AUTHOR\}\}/gi, '')
      cleaned = cleaned.replace(/\{\{EXCERPT\}\}[\s\S]*?\{\{\/EXCERPT\}\}/gi, '')
      cleaned = cleaned.replace(/\{\{TITLE:\s*[^}]+?\}\}/gi, '')
      cleaned = cleaned.replace(/\{\{TAGLINE:\s*[^}]+?\}\}/gi, '')
      cleaned = cleaned.replace(/\{\{AUTHOR:\s*[^}]+?\}\}/gi, '')
      cleaned = cleaned.replace(/\{\{EXCERPT:\s*[^}]+?\}\}/gi, '')
      
      // Strip icon tokens (both block and colon style)  
      cleaned = cleaned.replace(/\{\{ICON\}\}[^{]*?\{\{\/ICON\}\}/gi, '')
      cleaned = cleaned.replace(/\{\{ICON:\s*[^}]+?\}\}/gi, '')
      
      // Strip any other generic tokens {{ANYTHING}}...{{/ANYTHING}} or {{ANYTHING: value}}
      cleaned = cleaned.replace(/\{\{[^}]+?\}\}[\s\S]*?\{\{\/[^}]+?\}\}/gi, '')
      cleaned = cleaned.replace(/\{\{[^}]+?:\s*[^}]+?\}\}/gi, '')
      
      // Strip all HTML tags and entities
      cleaned = cleaned.replace(/<[^>]*>/g, '')
      cleaned = cleaned.replace(/&[^;]+;/g, ' ')
      
      // Normalize whitespace
      cleaned = cleaned.replace(/\s+/g, ' ').trim()
      
      return cleaned
    }
    
    // Extract header information from content tokens only
    const headerTokens = extractHeaderTokens(story.content || '')
    console.log(`🎵 Extracted header tokens:`, headerTokens)
    
    // Use only tokens - no fallbacks to database fields
    const finalTitle = headerTokens.title || ''
    const finalTagline = headerTokens.tagline || ''
    const finalAuthor = headerTokens.author || ''
    const finalExcerpt = headerTokens.excerpt || ''
    
    // Clean the main content (strip all tokens and HTML)
    const cleanedContent = cleanContentForTTS(story.content || '')
    console.log(`🎵 Content cleaning - Original length: ${(story.content || '').length}, Cleaned length: ${cleanedContent.length}`)
    
    // Compose final text for TTS using only tokens
    let textToRead = ''
    
    // Only add intro if we have token content
    if (finalTitle) {
      textToRead = finalTitle
      
      if (finalTagline) {
        textToRead += `. ${finalTagline}`
      }
      
      if (finalAuthor) {
        textToRead += `. By ${finalAuthor} —`
      }
      
      if (finalExcerpt) {
        textToRead += `. ${finalExcerpt}`
      }
      
      if (cleanedContent) {
        textToRead += ` ${cleanedContent}`
      }
    } else {
      // No tokens found - just read the cleaned content if available
      textToRead = cleanedContent || ''
      console.log(`⚠️ No header tokens found - reading content only`)
    }
    
    console.log(`🎵 Final TTS text preview: "${textToRead.substring(0, 200)}..."`)
    console.log(`🎵 Story content preserved unchanged in database`)

    // Convert dashes to natural pauses for better speech flow
    const processTextForSpeech = (text: string) => {
      return text
        .replace(/—/g, '... ... ...')  // M-dash: longer pause with multiple periods
        .replace(/–/g, '...')         // N-dash: shorter pause with ellipsis
    }
    
    textToRead = processTextForSpeech(textToRead)

    // Split text into chunks of ~4000 characters (leaving buffer for API limit)
    const chunkSize = 4000
    const textChunks: string[] = []
    
    if (textToRead.length <= chunkSize) {
      textChunks.push(textToRead)
    } else {
      let currentPos = 0
      while (currentPos < textToRead.length) {
        let chunkEnd = currentPos + chunkSize
        
        // Try to break at sentence boundaries to avoid cutting words
        if (chunkEnd < textToRead.length) {
          const nearbyPeriod = textToRead.lastIndexOf('.', chunkEnd)
          const nearbyExclamation = textToRead.lastIndexOf('!', chunkEnd)
          const nearbyQuestion = textToRead.lastIndexOf('?', chunkEnd)
          const bestBreak = Math.max(nearbyPeriod, nearbyExclamation, nearbyQuestion)
          
          if (bestBreak > currentPos + chunkSize * 0.7) {
            chunkEnd = bestBreak + 1
          }
        }
        
        textChunks.push(textToRead.slice(currentPos, chunkEnd))
        currentPos = chunkEnd
      }
    }

    console.log(`🎵 Generating ${textChunks.length} audio segments for story: ${story.title}`)

    const audioSegments: Uint8Array[] = []
    let totalDuration = 0

    // Generate audio for each chunk
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i]
      console.log(`🎵 Generating audio for segment ${i + 1}/${textChunks.length}`)
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: chunk,
          voice: (voiceName || story.ai_voice_name || 'nova').toLowerCase(),
          response_format: 'mp3',
          speed: 0.85,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenAI API error response:', errorText)
        throw new Error(`Failed to generate audio for segment ${i + 1}`)
      }

      // Get the audio as array buffer
      const arrayBuffer = await response.arrayBuffer()
      const audioBytes = new Uint8Array(arrayBuffer)
      audioSegments.push(audioBytes)
      
      // Estimate duration (rough calculation: ~150 words per minute, ~5 chars per word)
      const estimatedDuration = Math.ceil((chunk.length / 5) / 150 * 60)
      totalDuration += estimatedDuration
      
      console.log(`✅ Generated segment ${i + 1}, size: ${audioBytes.length} bytes`)
    }

    // Combine all audio segments into one file
    const totalLength = audioSegments.reduce((acc, segment) => acc + segment.length, 0)
    const combinedAudio = new Uint8Array(totalLength)
    let offset = 0

    for (const segment of audioSegments) {
      combinedAudio.set(segment, offset)
      offset += segment.length
    }

    console.log(`🎵 Combined audio file size: ${combinedAudio.length} bytes`)

    // Upload combined audio to Supabase storage
    const audioFileName = `${storyId}-${Date.now()}.mp3`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('story-audio')
      .upload(audioFileName, combinedAudio.buffer, {
        contentType: 'audio/mpeg',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Failed to upload audio:', uploadError)
      throw new Error(`Failed to upload audio: ${uploadError.message}`)
    }

    // Get public URL for the uploaded audio
    const { data: { publicUrl } } = supabase.storage
      .from('story-audio')
      .getPublicUrl(audioFileName)

    console.log(`✅ Audio uploaded successfully: ${publicUrl}`)

    // Update story record with audio information
    const { error: updateError } = await supabase
      .from('stories')
      .update({
        audio_url: publicUrl,
        audio_generated_at: new Date().toISOString(),
        audio_segments: textChunks.length,
        audio_duration_seconds: totalDuration
      })
      .eq('id', storyId)

    if (updateError) {
      console.error('❌ Failed to update story with audio info:', updateError)
      throw new Error(`Failed to update story: ${updateError.message}`)
    }

    console.log(`🎉 Audio generation completed for story: ${story.title}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        audioUrl: publicUrl,
        segments: textChunks.length,
        estimatedDuration: totalDuration,
        message: `Audio generated successfully for "${story.title}"`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('❌ Error in generate-story-audio function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})