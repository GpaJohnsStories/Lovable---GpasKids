import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportData {
  name: string;
  email?: string;
  subject: string;
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

    // Basic validation
    if (!reportData.name?.trim() || !reportData.subject?.trim() || !reportData.description?.trim()) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
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

    // Forward to Google Apps Script webhook
    const gasWebhookUrl = Deno.env.get("GAS_WEBHOOK_URL");
    const gasSharedSecret = Deno.env.get("GAS_SHARED_SECRET");
    
    if (gasWebhookUrl && gasSharedSecret) {
      try {
        const gasPayload = {
          reportData,
          clientIP,
          serverTimestamp: new Date().toISOString(),
          sharedSecret: gasSharedSecret
        };

        const gasResponse = await fetch(gasWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
          <h2>New Problem Report</h2>
          
          <h3>Report Details:</h3>
          <p><strong>From:</strong> ${reportData.name}</p>
          <p><strong>Email:</strong> ${reportData.email || 'Not provided'}</p>
          <p><strong>Who they are:</strong> ${reportData.whoAreYou}</p>
          <p><strong>Subject:</strong> ${reportData.subject}</p>
          
          <h3>Description:</h3>
          <p>${reportData.description.replace(/\n/g, '<br>')}</p>
          
          <h3>Technical Details:</h3>
          <p><strong>Page URL:</strong> ${reportData.pageUrl}</p>
          <p><strong>Timestamp:</strong> ${reportData.timestamp || 'Not provided'}</p>
          <p><strong>User Agent:</strong> ${reportData.userAgent || 'Not provided'}</p>
          <p><strong>Viewport:</strong> ${reportData.viewport || 'Not provided'}</p>
          <p><strong>Interaction Time:</strong> ${reportData.interactionTime ? Math.round(reportData.interactionTime / 1000) + 's' : 'Not provided'}</p>
          <p><strong>Client IP:</strong> ${clientIP}</p>
        `;

        const emailResponse = await resend.emails.send({
          from: "Problem Reports <onboarding@resend.dev>",
          to: ["ContactGpaJohn@gmail.com"],
          subject: `Problem Report: ${reportData.subject}`,
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