// superPrint-O.tsx
// Handles printing of "O" (Open/Public Domain) copyright stories
// Self-contained, no shared code with superPrint-L

export async function superPrintO(story_code: string) {
  const { data: story, error } = await supabase
    .from('stories')
    .select('*')
    .eq('story_code', story_code)
    .single();

  if (error || !story) {
    alert('Story not found.');
    return;
  }

  // ... rest of your code ...
}



import { createClient } from "@supabase/supabase-js";
import React from "react";

const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key"; // safe for client read-only
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Story {
  id: string;
  story_code: string;
  title: string;
  author: string;
  content: string;
  tagline: string;
  color_preset_id: string;
}

interface ColorPreset {
  id: string;
  box_border_color_hex: string;
  background_color_hex: string;
  font_color_hex: string;
  font_name: string;
  photo_border_color_hex: string;
}

// export async function superPrintO(story_code: string) {
// 1. Load story

// export async function superPrintO(story_code: string) {
(async function testSuperPrintO() {
  const story_code = "WOR-FSK"; // hard-coded for testing

  const { data: story, error } = await supabase.from("stories").select("*").eq("story_code", story_code).single();

  if (error || !story) {
    alert("Story not found.");
    return;
  }

  // 2. Load color preset
  const { data: preset } = await supabase.from("color_presets").select("*").eq("id", story.color_preset_id).single();

  const colors: ColorPreset = preset || {
    id: "default",
    box_border_color_hex: "#000",
    background_color_hex: "#fff",
    font_color_hex: "#000",
    font_name: "Georgia",
    photo_border_color_hex: "#000",
  };

  // 3. Assemble HTML for print
  const html = `
    <html>
      <head>
        <style>
          body {
            margin: 1in;
            font-family: ${colors.font_name}, serif;
            font-size: 16px;
            color: ${colors.font_color_hex};
            background: ${colors.background_color_hex};
          }
          h2 {
            font-family: Kalem, sans-serif;
            font-weight: bold;
            font-size: 30px;
            text-align: center;
            color: ${colors.font_color_hex};
          }
          .author, .tagline {
            text-align: center;
            margin: 8px 0;
            font-family: Georgia, serif;
          }
          .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            border-top: 2px solid ${colors.box_border_color_hex};
            text-align: center;
            font-family: Georgia, serif;
            font-size: 16pt;
            color: ${colors.font_color_hex};
          }
        </style>
      </head>
      <body>
        <h2>${story.title}</h2>
        <div class="author"><b>${story.author}</b></div>
        <div class="tagline"><i>${story.tagline || ""}</i></div>
        <div class="content">${story.content}</div>
        <div class="footer">© Open / Public Domain</div>
      </body>
    </html>
  `;

  // 4. Create temporary iframe/popup
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Unable to open print window.");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();

  // 5. Trigger print dialog
  printWindow.focus();
  printWindow.print();

  // 6. Update print_count
  await supabase
    .from("stories")
    .update({ print_count: (story.print_count || 0) + 1 })
    .eq("id", story.id);

  // 7. Close popup after printing
  printWindow.close();
}

