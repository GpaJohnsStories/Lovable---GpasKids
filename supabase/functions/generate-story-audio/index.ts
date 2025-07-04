import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { storyId } = await req.json()

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

    // Prepare text for reading - combine title, subtitle, author, description, and content
    let textToRead = `${story.title}`
    
    // Add tagline/subtitle if available
    if (story.tagline) {
      textToRead += `. ${story.tagline}`
    }
    
    // Add author information
    textToRead += `. By ${story.author}`
    
    // Add description/excerpt if available
    if (story.excerpt) {
      textToRead += `. ${story.excerpt}`
    }
    
    // Add main content
    if (story.content) {
      // Strip HTML tags from content for better speech using regex (Deno-compatible)
      const cleanContent = story.content.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ')
      textToRead += ` ${cleanContent}`
    }

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
          voice: 'nova',
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