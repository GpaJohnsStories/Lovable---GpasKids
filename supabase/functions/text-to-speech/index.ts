
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-client-type, apikey, content-type',
}

/**
 * Counts words in a text string, ignoring HTML tags
 * @param text - The text to count words in
 * @returns The number of words
 */
const countWords = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  
  // Remove HTML tags using regex (simpler approach for server-side)
  const plainText = text.replace(/<[^>]*>/g, '').trim();
  
  // Count words (split by whitespace and filter out empty strings)
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  return words.length;
};

/**
 * Truncates text to a specified word limit
 * @param text - The text to truncate
 * @param wordLimit - Maximum number of words allowed
 * @returns Truncated text
 */
const truncateToWordLimit = (text: string, wordLimit: number): string => {
  if (!text || text.trim() === '') return text;
  
  // Remove HTML tags for word counting
  const plainText = text.replace(/<[^>]*>/g, '').trim();
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length <= wordLimit) {
    return text; // Return original text if within limit
  }
  
  // Truncate to word limit
  const truncatedWords = words.slice(0, wordLimit);
  return truncatedWords.join(' ') + '...';
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice, speed } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    // ===== COMPREHENSIVE TEXT CLEANING FOR TTS =====
    
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
    
    // Clean the input text before processing
    const cleanedText = cleanContentForTTS(text)
    console.log(`🎵 Text cleaning - Original length: ${text.length}, Cleaned length: ${cleanedText.length}`)
    
    // Server-side validation and truncation for cost control
    const wordCount = countWords(cleanedText);
    console.log(`📊 Text analysis: ${wordCount} words`);
    
    let processedText = cleanedText;
    const wordLimit = 30;
    if (wordCount > wordLimit) {
      console.log(`⚠️ Text exceeds ${wordLimit} words (${wordCount}), truncating for cost control`);
      processedText = truncateToWordLimit(cleanedText, wordLimit);
      console.log(`✂️ Text truncated to ${countWords(processedText)} words`);
    }

    console.log(`Generating speech for text: "${processedText.substring(0, 100)}..." with voice: ${voice} at speed: ${speed || 1.0}`)

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      console.error('❌ OpenAI API key not found in environment')
      throw new Error('OpenAI API key not configured')
    }

    if (!openaiApiKey.startsWith('sk-')) {
      console.error('❌ OpenAI API key format is invalid - should start with sk-')
      throw new Error('Invalid OpenAI API key format')
    }

    console.log('✅ Valid API key found, making request to OpenAI...')

    // Generate speech from text
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: processedText,
        voice: voice || 'nova',
        response_format: 'mp3',
        speed: speed || 1.0,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error response:', errorText)
      
      let errorMessage = 'Failed to generate speech'
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.message || errorMessage
      } catch (e) {
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    // Get the audio as array buffer
    const arrayBuffer = await response.arrayBuffer()
    console.log('Audio buffer size:', arrayBuffer.byteLength)
    
    // Convert to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Use TextEncoder/TextDecoder approach for safer base64 conversion
    const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('')
    const base64Audio = btoa(binaryString)

    console.log('Successfully generated speech audio, base64 length:', base64Audio.length)

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        wordCount: countWords(processedText),
        wasTruncated: wordCount > wordLimit
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in text-to-speech function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
