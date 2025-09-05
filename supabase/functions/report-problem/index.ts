import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportData {
  name?: string;
  email?: string;
  description: string;
  whoAreYou: string;
  pageUrl: string;
  userAgent?: string;
  viewport?: string;
  timestamp?: string;
  interactionTime?: number;
}

// Simple in-memory rate limiting (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 5;

  const current = rateLimitMap.get(ip);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  try {
    // Basic rate limiting by IP
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const reportData: ReportData = await req.json();

    // Basic validation - require at least 3 words in description
    const wordCount = reportData.description?.trim().split(/\s+/).filter(word => word.length > 0).length || 0;
    if (wordCount < 3) {
      return new Response(JSON.stringify({ error: "Description must contain at least a few words" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (!reportData.whoAreYou) {
      return new Response(JSON.stringify({ error: "Who are you field is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Check minimum interaction time (3 seconds)
    if (reportData.interactionTime && reportData.interactionTime < 3000) {
      return new Response(JSON.stringify({ error: "Submission too fast" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

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

    // Get client IP (with privacy masking)
    const maskedIP = clientIP !== 'unknown' ? clientIP.split('.').slice(0, 2).join('.') + '.***' : 'unknown';

    // Prepare technical details section
    const technicalDetails = [
      `Who are you: ${reportData.whoAreYou}`,
      `Page URL: ${reportData.pageUrl}`,
      `Browser/OS: ${reportData.userAgent || 'Not provided'}`,
      `Viewport: ${reportData.viewport || 'Not provided'}`,
      `Interaction Time: ${reportData.interactionTime ? Math.round(reportData.interactionTime / 1000) + 's' : 'Not provided'}`,
      `Client IP: ${maskedIP}`,
      `Local Time: ${reportData.timestamp || 'Not provided'}`,
      `Server Time: ${new Date().toISOString()}`
    ].join('\n');

    // Structure email body: description first, then technical details
    const emailBody = `${reportData.description}\n\n--- Technical Details ---\n${technicalDetails}`;

    // Forward to Google Apps Script webhook
    const gasWebhookUrl = Deno.env.get("GAS_WEBHOOK_URL");
    const gasSharedSecret = Deno.env.get("GAS_SHARED_SECRET");
    
    if (gasWebhookUrl && gasSharedSecret) {
      try {
        const gasPayload = {
          type: "problem_report",
          reportData: {
            name: reportData.name || 'Anonymous',
            email: reportData.email || 'Not provided',
            subject: standardizedSubject,
            description: emailBody,
            whoAreYou: reportData.whoAreYou,
            pageUrl: reportData.pageUrl,
            userAgent: reportData.userAgent,
            viewport: reportData.viewport,
            timestamp: reportData.timestamp,
            interactionTime: reportData.interactionTime
          },
          clientIP: maskedIP,
          serverTimestamp: new Date().toISOString(),
          sharedSecret: gasSharedSecret
        };

        const gasResponse = await fetch(gasWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shared-Secret': gasSharedSecret
          },
          body: JSON.stringify(gasPayload)
        });

        if (gasResponse.ok) {
          console.log("Successfully forwarded to GAS webhook");
        } else {
          console.error("GAS webhook failed:", gasResponse.status, await gasResponse.text());
        }
      } catch (gasError) {
        console.error("Error forwarding to GAS webhook:", gasError);
      }
    } else {
      console.log("GAS webhook not configured, skipping forward");
    }

    // Send email if Resend is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        const emailHtml = `
          <h2>Problem Report</h2>
          <p><strong>Name:</strong> ${reportData.name || 'Anonymous'}</p>
          <p><strong>Email:</strong> ${reportData.email || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${reportData.description.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><strong>Technical Details:</strong></p>
          <p><strong>Who are you:</strong> ${reportData.whoAreYou}</p>
          <p><strong>Page URL:</strong> ${reportData.pageUrl}</p>
          <p><strong>User Agent:</strong> ${reportData.userAgent || 'Not provided'}</p>
          <p><strong>Viewport:</strong> ${reportData.viewport || 'Not provided'}</p>
          <p><strong>Client IP:</strong> ${maskedIP}</p>
          <p><strong>Timestamp:</strong> ${reportData.timestamp || 'Not provided'}</p>
          <p><strong>Interaction Time:</strong> ${reportData.interactionTime ? Math.round(reportData.interactionTime / 1000) + 's' : 'Not provided'}</p>
        `;

        const emailResponse = await resend.emails.send({
          from: "Problem Reports <onboarding@resend.dev>",
          to: ["ContactGpaJohn@gmail.com"],
          subject: standardizedSubject,
          html: emailHtml,
          replyTo: reportData.email || undefined
        });

        console.log("Problem report email sent successfully:", emailResponse);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    } else {
      console.log("Resend not configured, skipping email");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in report-problem function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);