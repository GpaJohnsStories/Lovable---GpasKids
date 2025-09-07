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
  bigIcon?: string;
}

export interface ExtractedTokens {
  tokens: HeaderTokens;
  contentWithoutTokens: string;
}

/**
 * Extracts header tokens from story content
 * Supports block style format: {{TITLE}}content{{/TITLE}}
 * Also detects and preserves outer HTML wrappers around tokens
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

  // Extract BIGICON token separately (just the icon path, no HTML)
  const bigIconPattern = /\{\{BIGICON\}\}([\s\S]*?)\{\{\/BIGICON\}\}/gi;
  const bigIconMatches = Array.from(content.matchAll(bigIconPattern));
  if (bigIconMatches.length > 0) {
    const lastMatch = bigIconMatches[bigIconMatches.length - 1];
    const iconPath = lastMatch[1].trim();
    if (iconPath) {
      tokens.bigIcon = iconPath;
    }
  }

  // Extract token content from block style patterns, including outer HTML wrappers
  ['title', 'tagline', 'author', 'excerpt'].forEach(key => {
    // Pattern to detect outer HTML wrapper around the token
    // Matches: <any-tag style="...">{{TITLE}}content{{/TITLE}}</any-tag>
    const wrappedPattern = new RegExp(`(<[^>]+>)\\{\\{${key.toUpperCase()}\\}\\}([\\s\\S]*?)\\{\\{\\/${key.toUpperCase()}\\}\\}(<\\/[^>]+>)`, 'gi');
    const wrappedMatches = Array.from(content.matchAll(wrappedPattern));
    
    if (wrappedMatches.length > 0) {
      // Use the last match if multiple exist
      const lastMatch = wrappedMatches[wrappedMatches.length - 1];
      const openTag = lastMatch[1];
      const innerContent = lastMatch[2].trim();
      const closeTag = lastMatch[3];
      
      if (innerContent) {
        // Normalize font-weight: half-bold to 600 in style attributes
        let normalizedOpenTag = openTag.replace(/font-weight:\s*half-bold/gi, 'font-weight: 600');
        
        // Store the complete wrapped HTML and extract plain text
        const fullHtml = `${normalizedOpenTag}${innerContent}${closeTag}`;
        tokens[`${key}Html` as keyof HeaderTokens] = fullHtml;
        tokens[key as keyof HeaderTokens] = stripHtmlTags(innerContent);
      }
    } else {
      // Fallback to standard block pattern if no wrapper found
      const blockPattern = new RegExp(`\\{\\{${key.toUpperCase()}\\}\\}([\\s\\S]*?)\\{\\{\\/${key.toUpperCase()}\\}\\}`, 'gi');
      const matches = Array.from(content.matchAll(blockPattern));
      
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
    }
  });

  // Define all token patterns for removal (both wrapped and unwrapped)
  const allTokenPatterns = [
    // Wrapped patterns
    /<[^>]+>\{\{TITLE\}\}[\s\S]*?\{\{\/TITLE\}\}<\/[^>]+>/gi,
    /<[^>]+>\{\{TAGLINE\}\}[\s\S]*?\{\{\/TAGLINE\}\}<\/[^>]+>/gi,
    /<[^>]+>\{\{AUTHOR\}\}[\s\S]*?\{\{\/AUTHOR\}\}<\/[^>]+>/gi,
    /<[^>]+>\{\{EXCERPT\}\}[\s\S]*?\{\{\/EXCERPT\}\}<\/[^>]+>/gi,
    // Standard patterns
    /\{\{TITLE\}\}([\s\S]*?)\{\{\/TITLE\}\}/gi,
    /\{\{TAGLINE\}\}([\s\S]*?)\{\{\/TAGLINE\}\}/gi,
    /\{\{AUTHOR\}\}([\s\S]*?)\{\{\/AUTHOR\}\}/gi,
    /\{\{EXCERPT\}\}([\s\S]*?)\{\{\/EXCERPT\}\}/gi,
    /\{\{BIGICON\}\}([\s\S]*?)\{\{\/BIGICON\}\}/gi
  ];

  // Remove all token patterns from content (including empty ones)
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