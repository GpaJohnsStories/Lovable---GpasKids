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
 * Supports: {{TITLE: ...}}, {{TAGLINE: ...}}, {{AUTHOR: ...}}, {{EXCERPT: ...}}
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

  // Define token patterns (case insensitive, multiline support)
  const tokenPatterns = [
    { key: 'title', pattern: /\{\{TITLE:\s*([\s\S]*?)\}\}/gi },
    { key: 'tagline', pattern: /\{\{TAGLINE:\s*([\s\S]*?)\}\}/gi },
    { key: 'author', pattern: /\{\{AUTHOR:\s*([\s\S]*?)\}\}/gi },
    { key: 'excerpt', pattern: /\{\{EXCERPT:\s*([\s\S]*?)\}\}/gi }
  ];

  // Extract each token type
  tokenPatterns.forEach(({ key, pattern }) => {
    const matches = Array.from(content.matchAll(pattern));
    if (matches.length > 0) {
      // Use the last match if multiple exist
      const lastMatch = matches[matches.length - 1];
      const htmlValue = lastMatch[1].trim();
      
      // Store both HTML and plain text versions
      tokens[`${key}Html` as keyof HeaderTokens] = htmlValue;
      tokens[key as keyof HeaderTokens] = stripHtmlTags(htmlValue);
      
      // Remove all instances of this token from content
      cleanedContent = cleanedContent.replace(pattern, '');
    }
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