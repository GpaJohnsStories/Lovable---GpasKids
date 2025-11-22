// super-print.tsx
// A self-contained print module for gpaskids.com
// Drop-in: no external dependencies beyond Supabase client
// Exports a single function: superPrint(storyCode: string, preloadedStory?: Story)

import React from "react";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";

// ----- Types -----
type Story = {
  id: string;
  story_code: string;
  title: string;
  author: string | null;
  content: string;
  category: string | null;
  copyright_status: "©" | "L" | "O";
  tagline: string | null;
  excerpt: string | null;
  photo_link_1: string | null;
  photo_link_2: string | null;
  photo_link_3: string | null;
  photo_link_4: string | null;
  photo_alt_1: string | null;
  photo_alt_2: string | null;
  photo_alt_3: string | null;
  photo_alt_4: string | null;
  color_preset_id: string | null;
  site: string | null;
  print_count?: number;
};

type ColorPreset = {
  id: string;
  box_border_color_hex: string | null;
  background_color_hex: string | null;
  font_color_hex: string | null;
  font_name: string | null; // Not used; we enforce Georgia except title
  photo_border_color_hex: string | null;
};

// ----- Special copyright story codes -----
const COPYRIGHT_CODES = {
  FULL_SCREEN: "PRT-FCR", // © full copyright screen message (no print)
  LIMITED_SCREEN: "PRT-LCS",
  LIMITED_TOP_PRINT: "PRT-LTP",
  LIMITED_BOTTOM_PRINT: "PRT-LBP",
  OPEN_FOOTER: "PRT-COF",
};

// ----- Public assets -----
const WATERMARK_PATH = "/lovable-uploads/ffc99cb6-290e-40fe-96a0-070386b466e0.png";

// ----- Helpers -----
function sanitizeHtml(input: string): string {
  // Assumes content from your DB is trusted admin input; we still strip script tags for safety
  return input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

function formatDate(d = new Date()): string {
  // "mmmm d, yyyy"
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function getPhotoByIndex(story: Story, n: number): { src: string | null; alt: string | null } {
  const src = (story as any)[`photo_link_${n}`] ?? null;
  const alt = (story as any)[`photo_alt_${n}`] ?? null;
  return { src, alt };
}

// Token parser replaces PHOTO, ICON, VIDEO tokens
function parseTokensToHtml(story: Story): string {
  let html = sanitizeHtml(story.content || "");

  // VIDEO: strip entirely from print
  html = html.replace(/\{\{VIDEO}}[\s\S]*?\{\{\/VIDEO}}/gi, "");

  // ICON: {{ICON}}filename.ext{{/ICON}} and {{ICON: filename.ext}}
  // Replace with <img> if present, else remove. We keep src path as-is (you host icons accordingly).
  html = html.replace(/\{\{ICON}}([\s\S]*?)\{\{\/ICON}}/gi, (_, filename: string) => {
    const f = filename.trim();
    return f ? `<img class="sp-icon" src="${f}" alt="" />` : "";
  });
  html = html.replace(/\{\{ICON:\s*([^}]+)}}/gi, (_, filename: string) => {
    const f = filename.trim();
    return f ? `<img class="sp-icon" src="${f}" alt="" />` : "";
  });

  // PHOTO tokens: {{PHOTO-1, left/right/center}} and {{PHOTO, all}}
  html = html.replace(/\{\{PHOTO-(\d),\s*(left|right|center)}}/gi, (_, numStr: string, placement: string) => {
    const n = parseInt(numStr, 10);
    const { src, alt } = getPhotoByIndex(story, n);
    if (!src) return ""; // skip if missing
    const placeClass =
      placement === "left" ? "sp-photo-left" : placement === "right" ? "sp-photo-right" : "sp-photo-center";

    const safeAlt = alt ? alt : "";
    return `
      <figure class="sp-photo ${placeClass}">
        <img src="${src}" alt="${safeAlt}" />
        <figcaption>${safeAlt}</figcaption>
      </figure>
    `;
  });

  // PHOTO, all — responsive grid of available photos
  html = html.replace(/\{\{PHOTO,\s*all}}/gi, () => {
    const items: string[] = [];
    for (let i = 1; i <= 4; i++) {
      const { src, alt } = getPhotoByIndex(story, i);
      if (src) {
        items.push(`
          <figure class="sp-photo sp-photo-grid-item">
            <img src="${src}" alt="${alt ? alt : ""}" />
            <figcaption>${alt ? alt : ""}</figcaption>
          </figure>
        `);
      }
    }
    if (items.length === 0) return "";
    return `<div class="sp-photo-grid">${items.join("")}</div>`;
  });

  return html;
}

// Fetch a story by code
async function fetchStoryByCode(storyCode: string): Promise<Story | null> {
  const { data, error } = await supabase.from("stories").select("*").eq("story_code", storyCode).limit(1).maybeSingle();

  if (error) {
    console.error("fetchStoryByCode error:", error);
    return null;
  }
  return data as Story | null;
}

// Fetch a color preset by id
async function fetchColorPresetById(id: string | null): Promise<ColorPreset | null> {
  if (!id) return null;
  const { data, error } = await supabase.from("color_presets").select("*").eq("id", id).limit(1).maybeSingle();

  if (error) {
    console.error("fetchColorPresetById error:", error);
    return null;
  }
  return data as ColorPreset | null;
}

// Increment print count (best-effort)
async function incrementPrintCount(storyId: string) {
  try {
    // Fetch current count
    const { data } = await supabase.from("stories").select("print_count").eq("id", storyId).single();

    const currentCount = data?.print_count || 0;

    // Update with incremented count
    await supabase
      .from("stories")
      .update({ print_count: currentCount + 1 })
      .eq("id", storyId);
  } catch (e) {
    console.warn("incrementPrintCount failed:", e);
  }
}

// Build the print HTML document string
function buildPrintHtml(
  story: Story,
  storyPreset: ColorPreset | null,
  options: {
    headerBoxHtml?: string; // limited copyright top box
    footerBoxHtml?: string; // footer box per page (limited/open)
    showWatermark?: boolean;
    titleColorHex?: string; // from preset font color or box color
  },
): string {
  const title = story.title || "";
  const author = story.author || "";
  const tagline = story.tagline || "";

  const fontColor = storyPreset?.font_color_hex ?? "#000";
  const bgColor = storyPreset?.background_color_hex ?? "#fff";
  const boxBorder = storyPreset?.box_border_color_hex ?? "#000";
  const photoBorder = storyPreset?.photo_border_color_hex ?? "#000";
  const titleColor = options.titleColorHex || fontColor;

  const contentHtml = parseTokensToHtml(story);

  // Build full HTML. We load styles from super-print.css via <style> inline (self-contained)
  // If you prefer external CSS, comment inline style and include a <link>.
  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} — Print</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    @page { margin: 0.75in; }
    html, body { background: #fff; }
    body {
      color: #000;
      font-family: Georgia, serif;
      line-height: 1.5;
    }
    .sp-container {
      background: ${bgColor};
      color: ${fontColor};
    }
    .sp-top-box, .sp-footer-box {
      border: 2px solid ${boxBorder};
      background: ${bgColor};
      color: ${fontColor};
      padding: 8px 12px;
    }
    .sp-title {
      font-family: "Kalem", Georgia, serif;
      font-weight: bold;
      font-size: 1.5rem; /* h2-ish */
      text-align: center;
      color: ${titleColor};
      margin: 24px 0 8px 0;
    }
    .sp-author, .sp-tagline {
      font-size: 16pt;
      line-height: 21px;
      text-align: center;
      color: #000;
      margin: 8px 0;
    }
    .sp-content {
      font-size: 16pt;
      line-height: 21px;
      color: #000;
      margin-top: 16px;
    }
    .sp-icon {
      width: 55px;
      height: 55px;
      vertical-align: middle;
    }
    .sp-photo {
      border: 2px solid ${photoBorder};
      padding: 6px;
      margin: 8px;
      display: inline-block;
      background: #fff;
    }
    .sp-photo img { max-width: 100%; height: auto; display: block; }
    .sp-photo figcaption {
      font-family: Georgia, serif;
      font-size: 16pt;
      line-height: 21px;
      color: #000;
      margin-top: 6px;
      text-align: left;
    }
    .sp-photo-left { float: left; max-width: 45%; }
    .sp-photo-right { float: right; max-width: 45%; }
    .sp-photo-center { display: block; margin-left: auto; margin-right: auto; max-width: 85%; }
    .sp-photo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    .sp-photo-grid-item { width: 100%; }

    .sp-footer {
      position: fixed;
      bottom: 0.75in;
      left: 0.75in;
      right: 0.75in;
      display: flex;
      justify-content: space-between;
      font-size: 14pt;
      line-height: 19px;
      color: #000;
      border-top: 2px solid ${boxBorder};
      padding-top: 6px;
    }

    /* Optional watermark */
    ${
      options.showWatermark
        ? `
    .sp-watermark {
      position: fixed;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.08;
      pointer-events: none;
      width: 60%;
      max-width: 600px;
    }`
        : ""
    }

    /* Clear floats after content blocks to avoid overlap across pages */
    .sp-clear { clear: both; }

    @media print {
      .sp-print-controls { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sp-container">
    ${options.headerBoxHtml ? `<div class="sp-top-box">${options.headerBoxHtml}</div>` : ""}

    <div class="sp-title">${escapeHtml(title)}</div>
    ${author ? `<div class="sp-author">${escapeHtml(author)}</div>` : ""}
    ${tagline ? `<div class="sp-tagline"><em>${escapeHtml(tagline)}</em></div>` : ""}

    <div class="sp-content">${contentHtml}</div>
    <div class="sp-clear"></div>

    <div class="sp-footer">
      <div>Printed by GpasKids.com on ${formatDate()}</div>
      <div>Page <span class="pageNumber"></span></div>
    </div>

    ${options.footerBoxHtml ? `<div class="sp-footer-box">${options.footerBoxHtml}</div>` : ""}

    ${options.showWatermark ? `<img class="sp-watermark" src="${WATERMARK_PATH}" alt="" />` : ""}
  </div>

  <script>
    // Page numbers for print
    // Many browsers auto-insert page counters only via CSS Paged Media; this is a visual fallback
    (function() {
      var pn = document.querySelector(".pageNumber");
      if (pn) pn.textContent = "1"; // simple placeholder
    })();
  </script>
</body>
</html>
  `;
  return html;
}

// Escape for title, author, tagline
function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string,
  );
}

// Build HTML for a copyright story record (rendered as-is)
function buildCopyrightBoxHtml(copyrightStory: Story, preset: ColorPreset | null): string {
  // Use story.content raw (tokens usually not needed for these boxes)
  const html = sanitizeHtml(copyrightStory.content || "");
  return html;
}

// Print via hidden iframe
async function printHtml(html: string) {
  return new Promise<void>((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    // CSP-safe: use srcdoc instead of doc.write()
    iframe.srcdoc = html;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      // Give the browser a tick to layout before printing
      setTimeout(() => {
        iframe.contentWindow!.focus();
        iframe.contentWindow!.print();
        // Cleanup after print; some browsers fire after closing dialog
        setTimeout(() => {
          document.body.removeChild(iframe);
          resolve();
        }, 500);
      }, 150);
    };
  });
}

// ----- Main entry point -----
// storyCode: 7-char code from /story page
// preloadedStory: optional story object (if already fetched on /story page)
export async function superPrint(storyCode: string, preloadedStory?: Story) {
  // 1) Load story (prefer cached/preloaded)
  const story = preloadedStory ?? (await fetchStoryByCode(storyCode));
  if (!story) {
    alert("Sorry, the story could not be found.");
    return;
  }

  // 2) Respect copyright_status
  // © (full copyright): disallow printing; show full-screen message box
  let headerBoxHtml: string | undefined;
  let footerBoxHtml: string | undefined;
  let showWatermark = false;

  if (story.copyright_status === "©") {
    const fcr = await fetchStoryByCode(COPYRIGHT_CODES.FULL_SCREEN);
    if (fcr) {
      const fcrPreset = await fetchColorPresetById(fcr.color_preset_id);
      const html = buildCopyrightBoxHtml(fcr, fcrPreset);
      const docHtml = buildPrintHtml(story, await fetchColorPresetById(story.color_preset_id), {
        headerBoxHtml: undefined,
        footerBoxHtml: undefined,
        showWatermark: true, // optional watermark to reinforce “no print”
        titleColorHex: undefined,
      });
      // Instead of printing, show alert and return (no printing allowed)
      alert("This story cannot be printed due to full copyright.");
      return;
    } else {
      alert("This story cannot be printed due to full copyright.");
      return;
    }
  }

  // Limited copyright: top header + bottom footer on each page
  // Open copyright: bottom footer only
  if (story.copyright_status === "L") {
    const lcs = await fetchStoryByCode(COPYRIGHT_CODES.LIMITED_SCREEN);
    const ltp = await fetchStoryByCode(COPYRIGHT_CODES.LIMITED_TOP_PRINT);
    const lbp = await fetchStoryByCode(COPYRIGHT_CODES.LIMITED_BOTTOM_PRINT);

    if (ltp) {
      const ltpPreset = await fetchColorPresetById(ltp.color_preset_id);
      headerBoxHtml = buildCopyrightBoxHtml(ltp, ltpPreset);
    }
    if (lbp) {
      const lbpPreset = await fetchColorPresetById(lbp.color_preset_id);
      footerBoxHtml = buildCopyrightBoxHtml(lbp, lbpPreset);

      // 👇 Add this line here
      showWatermark = true;
    }
  } else if (story.copyright_status === "O") {
    const cof = await fetchStoryByCode(COPYRIGHT_CODES.OPEN_FOOTER);
    if (cof) {
      const cofPreset = await fetchColorPresetById(cof.color_preset_id);
      footerBoxHtml = buildCopyrightBoxHtml(cof, cofPreset);
    }
  }

  // 3) Load story color preset
  const storyPreset = await fetchColorPresetById(story.color_preset_id);

  // 4) Build HTML doc
  const html = buildPrintHtml(story, storyPreset, {
    headerBoxHtml,
    footerBoxHtml,
    showWatermark,
    titleColorHex: storyPreset?.font_color_hex ?? undefined,
  });

  // 5) Trigger print
  await printHtml(html);

  // 6) Increment print count (best-effort, ignoring inflated counts)
  if (story.id) {
    incrementPrintCount(story.id).catch(() => {});
  }
}
