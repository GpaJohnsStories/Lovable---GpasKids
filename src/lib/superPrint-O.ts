// superPrint-O.ts
// Handles printing of "O" (Open/Public Domain) copyright stories
// Self-contained, no shared code with superPrint-L

import { createClient } from "@supabase/supabase-js";
import React from "react";

// Initialize Supabase client
const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY");

export async function superPrintO(story_code: string) {
  // 1. Fetch story from Supabase
  const { data: story, error } = await supabase.from("stories").select("*").eq("story_code", story_code).single();

  if (error || !story) {
    alert("Story not found.");
    return;
  }

  // 2. Build HTML for printing
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${story.title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        h1 { font-size: 28px; margin-bottom: 12px; }
        p { font-size: 18px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <h1>${story.title}</h1>
      <p>${story.content}</p>
      <footer style="margin-top: 40px; font-size: 14px; color: gray;">
        Printed from gpaskids.com — Public Domain Story
      </footer>
    </body>
    </html>
  `;

  // 3. Open print window
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) {
    alert("Unable to open print window.");
    return;
  }

  // 4. Write content into print window
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // 5. Trigger print
  printWindow.focus();
  printWindow.print();

  // 6. Update print_count in Supabase
  await supabase
    .from("stories")
    .update({ print_count: (story.print_count || 0) + 1 })
    .eq("id", story.id);

  // 7. Close popup after printing
  printWindow.close();
}
