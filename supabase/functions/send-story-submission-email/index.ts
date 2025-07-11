import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StorySubmissionData {
  personalId: string;
  storyCode: string;
  fileName: string;
  story_title: string;
  author_name: string;
  author_email: string;
  author_phone?: string;
  date_of_birth?: string;
  author_signature: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  parent_signature?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: StorySubmissionData = await req.json();

    const emailHtml = `
      <h1>🎉 New Story Submission from Gpa's Kids Website!</h1>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>📚 Story Information</h2>
        <p><strong>Personal ID:</strong> ${data.personalId}</p>
        <p><strong>Story Code:</strong> ${data.storyCode}</p>
        <p><strong>Story Title:</strong> ${data.story_title}</p>
        <p><strong>File Name:</strong> ${data.fileName}</p>
        <p><em>Note: The story content has been saved to the database with story code ${data.storyCode}</em></p>
      </div>

      <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>👤 Author Information</h2>
        <p><strong>Name:</strong> ${data.author_name}</p>
        <p><strong>Email:</strong> ${data.author_email}</p>
        ${data.author_phone ? `<p><strong>Phone:</strong> ${data.author_phone}</p>` : ''}
        ${data.date_of_birth ? `<p><strong>Date of Birth:</strong> ${data.date_of_birth}</p>` : ''}
        <p><strong>Electronic Signature:</strong> ${data.author_signature}</p>
      </div>

      ${data.parent_name ? `
        <div style="background: #f0e8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>👪 Parent/Guardian Information</h2>
          <p><strong>Name:</strong> ${data.parent_name}</p>
          ${data.parent_email ? `<p><strong>Email:</strong> ${data.parent_email}</p>` : ''}
          ${data.parent_phone ? `<p><strong>Phone:</strong> ${data.parent_phone}</p>` : ''}
          ${data.parent_signature ? `<p><strong>Electronic Signature:</strong> ${data.parent_signature}</p>` : ''}
        </div>
      ` : ''}

      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>🔍 Next Steps</h2>
        <p>To view the submitted story content, check the database for story code: <strong>${data.storyCode}</strong></p>
        <p>The story has been saved as an unpublished story in the system and can be reviewed through the admin panel.</p>
      </div>

      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        This email was automatically generated from the Gpa's Kids story submission form.<br>
        Submission time: ${new Date().toLocaleString()}
      </p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Gpa's Kids Stories <onboarding@resend.dev>",
      to: ["gpajohn.buddy@gmail.com"],
      subject: `📖 New Story Submission: "${data.story_title}" by ${data.author_name}`,
      html: emailHtml,
    });

    console.log("Story submission email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-story-submission-email function:", error);
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