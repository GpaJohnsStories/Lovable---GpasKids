import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { containsBadWord } from "../../../src/utils/profanity.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommentRequest {
  name?: string;
  email?: string;
  message: string;
  pageUrl: string;
  userAgent: string;
  timestamp: number;
  interactionTime: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const requestData: CommentRequest = await req.json();
    const { name, email, message, pageUrl, userAgent, timestamp, interactionTime } = requestData;

    // Basic validation
    if (!message || message.length < 10) {
      return new Response(JSON.stringify({ error: 'Message must be at least 10 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Anti-spam: minimum interaction time
    if (interactionTime < 3000) {
      console.log('Rejected: insufficient interaction time', { interactionTime });
      return new Response(JSON.stringify({ error: 'Please take more time to compose your message' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Profanity check
    const textToCheck = [name, email, message].filter(Boolean).join(' ');
    if (containsBadWord(textToCheck)) {
      return new Response(JSON.stringify({ error: 'Message contains inappropriate content' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get environment variables for Google Apps Script
    const gasWebhookUrl = Deno.env.get('GAS_WEBHOOK_URL');
    const gasSharedSecret = Deno.env.get('GAS_SHARED_SECRET');

    if (!gasWebhookUrl || !gasSharedSecret) {
      console.error('Missing Google Apps Script configuration');
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get client IP (with privacy masking)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const maskedIP = clientIP !== 'unknown' ? clientIP.split('.').slice(0, 2).join('.') + '.***' : 'unknown';

    // Generate standardized subject using US Central time
    const centralTime = new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const standardizedSubject = `Gpa's Kids – ${centralTime}`;

    // Prepare technical details section
    const technicalDetails = [
      `Page URL: ${pageUrl}`,
      `Browser/OS: ${userAgent}`,
      `Interaction Time: ${Math.round(interactionTime / 1000)}s`,
      `Client IP: ${maskedIP}`,
      `Local Time: ${new Date(timestamp).toLocaleString()}`,
      `UTC Time: ${new Date(timestamp).toISOString()}`,
      `Server Time: ${new Date().toISOString()}`
    ].join('\n');

    // Structure email body: message first, then technical details
    const emailBody = `${message}\n\n--- Technical Details ---\n${technicalDetails}`;

    // Prepare payload for Google Apps Script
    const payload = {
      type: "comment",
      commentData: {
        name: name || 'Anonymous',
        email: email || 'Not provided',
        subject: standardizedSubject,
        message: emailBody,
        pageUrl,
        userAgent,
        timestamp: new Date(timestamp).toISOString(),
        interactionTime
      },
      sharedSecret: gasSharedSecret,
      clientIP: maskedIP,
      serverTimestamp: new Date().toISOString()
    };

    // Forward to Google Apps Script
    const gasResponse = await fetch(gasWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shared-Secret': gasSharedSecret
      },
      body: JSON.stringify(payload)
    });

    if (!gasResponse.ok) {
      const gasError = await gasResponse.text();
      console.error('Google Apps Script error:', { status: gasResponse.status, error: gasError });
      return new Response(JSON.stringify({ error: 'Failed to send comment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Log success with minimal details (no PII)
    console.log('Comment sent successfully', {
      hasName: !!name,
      hasEmail: !!email,
      subject: standardizedSubject,
      messageLength: message.length,
      maskedIP,
      pageUrl: pageUrl.replace(/\/[A-Z0-9]{7}$/, '/[STORY_CODE]'), // Mask story codes
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-comment function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);