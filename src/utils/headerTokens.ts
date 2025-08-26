import { createSafeHtml } from "@/utils/xssProtection";

export interface HeaderTokens {
  title?: string;
  titleHtml?: string;
  tagline?: string;
  taglineHtml?: string;
  author?: string;
  authorHtml?: string;
  excerpt?: string;
  excerptHtml?: string;
}

export interface ExtractedTokens {
  tokens: HeaderTokens;
  contentWithoutTokens: string;
}

/**
 * Extracts header tokens from story content
 * Supports both formats:
 * - Colon style: {{TITLE: content}}
 * - Block style: {{TITLE}}content{{/TITLE}}
 * Each token can contain HTML/CSS which will be sanitized on render
 */
export const extractHeaderTokens = (content: string): ExtractedTokens => {
  if (!content) {
    return {
      tokens: {},
      contentWithoutTokens: content
    };
  }

  const tokens: HeaderTokens = {};
  let cleanedContent = content;

  // Define ALL token patterns that need to be removed from preview
  const allTokenPatterns = [
    // Block style patterns (with content)
    /\{\{TITLE\}\}([\s\S]*?)\{\{\/TITLE\}\}/gi,
    /\{\{TAGLINE\}\}([\s\S]*?)\{\{\/TAGLINE\}\}/gi,
    /\{\{AUTHOR\}\}([\s\S]*?)\{\{\/AUTHOR\}\}/gi,
    /\{\{EXCERPT\}\}([\s\S]*?)\{\{\/EXCERPT\}\}/gi,
    // Colon style patterns
    /\{\{TITLE:\s*([\s\S]*?)\}\}/gi,
    /\{\{TAGLINE:\s*([\s\S]*?)\}\}/gi,
    /\{\{AUTHOR:\s*([\s\S]*?)\}\}/gi,
    /\{\{EXCERPT:\s*([\s\S]*?)\}\}/gi
  ];

  // Extract token content first (block style takes precedence)
  ['title', 'tagline', 'author', 'excerpt'].forEach(key => {
    // Try block style first
    const blockPattern = new RegExp(`\\{\\{${key.toUpperCase()}\\}\\}([\\s\\S]*?)\\{\\{\\/${key.toUpperCase()}\\}\\}`, 'gi');
    let matches = Array.from(content.matchAll(blockPattern));
    
    if (matches.length === 0) {
      // Try colon style
      const colonPattern = new RegExp(`\\{\\{${key.toUpperCase()}:\\s*([\\s\\S]*?)\\}\\}`, 'gi');
      matches = Array.from(content.matchAll(colonPattern));
    }
    
    if (matches.length > 0) {
      // Use the last match if multiple exist
      const lastMatch = matches[matches.length - 1];
      const htmlValue = lastMatch[1].trim();
      
      // Store both HTML and plain text versions (only if not empty)
      if (htmlValue) {
        tokens[`${key}Html` as keyof HeaderTokens] = htmlValue;
        tokens[key as keyof HeaderTokens] = stripHtmlTags(htmlValue);
      }
    }
  });

  // Remove ALL token patterns from content (including empty ones)
  allTokenPatterns.forEach(pattern => {
    cleanedContent = cleanedContent.replace(pattern, '');
  });

  // Clean up any extra whitespace left by token removal
  cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

  return {
    tokens,
    contentWithoutTokens: cleanedContent
  };
};

/**
 * Strips HTML tags to create plain text version
 */
const stripHtmlTags = (html: string): string => {
  // Create a temporary div to parse HTML and extract text content
  if (typeof document !== 'undefined') {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }
  
  // Fallback for server-side: simple regex-based HTML stripping
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Safely renders HTML content using DOMPurify
 */
export const createSafeHeaderHtml = (htmlContent: string) => {
  return createSafeHtml(htmlContent);
};