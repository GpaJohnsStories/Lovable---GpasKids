import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StorySubmissionData {
  personalId: string;
  storyCode: string;
  story_title: string;
  story_tagline: string;
  story_excerpt: string;
  story_content: string;
  author_name: string;
  author_pen_name: string;
  author_email: string;
  author_phone?: string;
  date_of_birth?: string;
  author_signature: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  parent_signature?: string;
  send_email?: boolean;
}

const generatePDFHTML = (data: StorySubmissionData): string => {
  const currentDate = new Date().toLocaleDateString();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Story Submission Release Form - ${data.story_title}</title>
  <style>
    body { 
      font-family: Georgia, serif; 
      line-height: 1.4; 
      margin: 40px; 
      color: #333; 
    }
    .header { 
      text-align: center; 
      border-bottom: 3px solid #8B4513; 
      padding-bottom: 20px; 
      margin-bottom: 30px; 
    }
    .title { 
      font-size: 24px; 
      font-weight: bold; 
      color: #8B4513; 
      margin-bottom: 10px; 
    }
    .subtitle { 
      font-size: 16px; 
      color: #666; 
    }
    .section { 
      margin: 25px 0; 
      padding: 15px; 
      border: 2px solid #ddd; 
      border-radius: 8px; 
    }
    .section-title { 
      font-size: 18px; 
      font-weight: bold; 
      color: #8B4513; 
      margin-bottom: 15px; 
      border-bottom: 1px solid #ddd; 
      padding-bottom: 5px; 
    }
    .field { 
      margin: 10px 0; 
    }
    .field-label { 
      font-weight: bold; 
      color: #555; 
    }
    .field-value { 
      margin-left: 15px; 
    }
    .story-content { 
      background: #f9f9f9; 
      padding: 20px; 
      border-radius: 5px; 
      white-space: pre-wrap; 
      font-size: 14px; 
      line-height: 1.6; 
    }
    .signature { 
      font-style: italic; 
      color: #8B4513; 
      font-weight: bold; 
    }
    .legal-notice { 
      background: #fffacd; 
      border: 1px solid #ddd; 
      padding: 15px; 
      margin: 20px 0; 
      font-size: 12px; 
      color: #666; 
    }
    .footer { 
      text-align: center; 
      margin-top: 40px; 
      padding-top: 20px; 
      border-top: 1px solid #ddd; 
      font-size: 12px; 
      color: #888; 
    }
    .page-break { 
      page-break-before: always; 
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Story Submission Release Form</div>
    <div class="subtitle">Gpa's Kids Stories</div>
    <div style="margin-top: 10px; font-size: 14px;">Generated on: ${currentDate}</div>
  </div>

  <div class="legal-notice">
    <strong>Legal Notice:</strong> By submitting this story, you represent and warrant that: 
    (1) you are the original author or have proper authorization to submit this work, 
    (2) the story does not infringe upon any copyright, trademark, or other intellectual property rights, 
    (3) the content is appropriate for children and does not contain harmful, offensive, or inappropriate material, and 
    (4) you grant Gpa's Kids permission to review, edit, and potentially publish your story on our website. All submissions become part of our story collection and may be used for educational and entertainment purposes, and 
    (5) you retain the right to have your story removed from Gpa's Kids website at any time by simply sending your request as a comment with the same Personal ID code you are submitting here.
  </div>

  <div class="section">
    <div class="section-title">📝 Personal ID Information</div>
    <div class="field">
      <span class="field-label">Personal ID:</span>
      <span class="field-value">${data.personalId}</span>
    </div>
    <div class="field">
      <span class="field-label">Story Code:</span>
      <span class="field-value">${data.storyCode}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">📚 Story Information</div>
    <div class="field">
      <span class="field-label">Story Title:</span>
      <span class="field-value">${data.story_title}</span>
    </div>
    <div class="field">
      <span class="field-label">Tagline/Sub-Title:</span>
      <span class="field-value">${data.story_tagline}</span>
    </div>
    <div class="field">
      <span class="field-label">Story Excerpt:</span>
      <span class="field-value">${data.story_excerpt}</span>
    </div>
  </div>

  <div class="page-break"></div>
  
  <div class="section">
    <div class="section-title">📖 Story Content</div>
    <div class="story-content">${data.story_content}</div>
  </div>

  <div class="page-break"></div>

  <div class="section">
    <div class="section-title">👤 Author Information</div>
    <div class="field">
      <span class="field-label">Author Name:</span>
      <span class="field-value">${data.author_name}</span>
    </div>
    <div class="field">
      <span class="field-label">Author Pen Name:</span>
      <span class="field-value">${data.author_pen_name}</span>
    </div>
    <div class="field">
      <span class="field-label">Email:</span>
      <span class="field-value">${data.author_email}</span>
    </div>
    ${data.author_phone ? `
    <div class="field">
      <span class="field-label">Phone:</span>
      <span class="field-value">${data.author_phone}</span>
    </div>
    ` : ''}
    ${data.date_of_birth ? `
    <div class="field">
      <span class="field-label">Date of Birth:</span>
      <span class="field-value">${data.date_of_birth}</span>
    </div>
    ` : ''}
    <div class="field">
      <span class="field-label">Electronic Signature:</span>
      <span class="field-value signature">${data.author_signature}</span>
    </div>
  </div>

  ${data.parent_name ? `
  <div class="section">
    <div class="section-title">👪 Parent/Guardian Information</div>
    <div class="field">
      <span class="field-label">Parent/Guardian Name:</span>
      <span class="field-value">${data.parent_name}</span>
    </div>
    ${data.parent_email ? `
    <div class="field">
      <span class="field-label">Email:</span>
      <span class="field-value">${data.parent_email}</span>
    </div>
    ` : ''}
    ${data.parent_phone ? `
    <div class="field">
      <span class="field-label">Phone:</span>
      <span class="field-value">${data.parent_phone}</span>
    </div>
    ` : ''}
    ${data.parent_signature ? `
    <div class="field">
      <span class="field-label">Electronic Signature:</span>
      <span class="field-value signature">${data.parent_signature}</span>
    </div>
    ` : ''}
  </div>
  ` : ''}

  <div class="footer">
    <p>This document was generated from the Gpa's Kids story submission form</p>
    <p>Personal ID: ${data.personalId} | Story Code: ${data.storyCode}</p>
    <p>Generated on: ${currentDate}</p>
  </div>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: StorySubmissionData = await req.json();
    console.log("Generating PDF for story:", data.storyCode);

    // Generate HTML content for PDF
    const htmlContent = generatePDFHTML(data);

    // For now, we'll return the HTML that can be used to generate PDF on the client side
    // In a future enhancement, we could use Puppeteer to generate actual PDF server-side
    
    if (data.send_email && data.author_email) {
      // Send the HTML via email for now
      const emailHtml = `
        <h1>📄 Your Story Submission Release Form</h1>
        <p>Dear ${data.author_name},</p>
        <p>Thank you for submitting your story "<strong>${data.story_title}</strong>" to Gpa's Kids!</p>
        <p>Below is your complete story submission release form. You can print this page for your records.</p>
        <hr style="margin: 20px 0;">
        ${htmlContent}
      `;

      const emailResponse = await resend.emails.send({
        from: "Gpa's Kids Stories <onboarding@resend.dev>",
        to: [data.author_email],
        subject: `📄 Your Story Submission Form: "${data.story_title}"`,
        html: emailHtml,
      });

      console.log("PDF email sent successfully:", emailResponse);
    }

    // ALWAYS send a copy of the PDF to the admin
    const adminEmailHtml = `
      <h1>📄 Story Submission Release Form - Admin Copy</h1>
      <p><strong>Story:</strong> "${data.story_title}" by ${data.author_name}</p>
      <p><strong>Personal ID:</strong> ${data.personalId}</p>
      <p><strong>Story Code:</strong> ${data.storyCode}</p>
      <p>Below is the complete story submission release form for your records:</p>
      <hr style="margin: 20px 0;">
      ${htmlContent}
    `;

    const adminEmailResponse = await resend.emails.send({
      from: "Gpa's Kids Stories <onboarding@resend.dev>",
      to: ["gpajohn.buddy@gmail.com"], // Admin email
      subject: `📄 Story Submission PDF: "${data.story_title}" by ${data.author_name}`,
      html: adminEmailHtml,
    });

    console.log("Admin PDF copy sent successfully:", adminEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      htmlContent,
      message: data.send_email ? "PDF sent to your email address and admin copy sent" : "PDF generated successfully, admin copy sent"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in generate-story-pdf function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);