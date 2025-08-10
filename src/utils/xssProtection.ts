/**
 * XSS Protection Utilities
 * Provides secure HTML encoding and content sanitization for user-generated content
 */

/**
 * Encode HTML entities to prevent XSS attacks
 */
export function encodeHtml(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize text content by removing/encoding potentially dangerous characters
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  // Remove any HTML tags completely
  let sanitized = text.replace(/<[^>]*>/g, '');
  
  // Encode remaining special characters
  sanitized = encodeHtml(sanitized);
  
  return sanitized;
}

/**
 * Safe HTML content renderer that preserves basic formatting while preventing XSS
 * Only allows specific safe HTML tags and attributes
 */
export function createSafeHtml(content: string): { __html: string } {
  if (!content || typeof content !== 'string') {
    return { __html: '' };
  }

  // List of allowed HTML tags for story content (basic formatting only)
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'span', 'center'];
  
  let sanitized = content;
  
  // Remove script tags and their content completely
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gis, '');
  
  // Remove dangerous event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol except for safe data URLs
  sanitized = sanitized.replace(/data:(?!image\/)/gi, '');
  
  // Remove any HTML tags that are not in our allowed list
  // Use a simpler approach: find all tags and check if they're allowed
  sanitized = sanitized.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, (match, tagName) => {
    const lowerTagName = tagName.toLowerCase();
    if (allowedTags.includes(lowerTagName)) {
      return match;
    }
    return '';
  });
  
  // For attributes, allow safe style attributes for text formatting
  sanitized = sanitized.replace(/<([^>]+)\s+([^>]*)>/g, (match, tagContent, attributes) => {
    if (!attributes) return match;
    
    // Keep style attributes that contain safe CSS properties
    const styleMatch = attributes.match(/style\s*=\s*["']([^"']*)["']/i);
    if (styleMatch) {
      const styleValue = styleMatch[1];
      // Allow common text styling and safe layout properties
      const allowedStyleProps = [
        'font-size', 'font-weight', 'font-style', 'text-align', 'font-family',
        'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
        'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
        'color', 'background-color', 'line-height', 'text-decoration'
      ];
      
      // Parse CSS properties and filter allowed ones
      const cssProps = styleValue.split(';').filter(prop => prop.trim());
      const filteredProps = cssProps.filter(prop => {
        const propName = prop.split(':')[0].trim().toLowerCase();
        return allowedStyleProps.includes(propName);
      });
      
      if (filteredProps.length > 0) {
        const filteredStyle = filteredProps.join('; ');
        return `<${tagContent} style="${filteredStyle}">`;
      }
    }
    
    return `<${tagContent}>`;
  });

  return { __html: sanitized };
}

/**
 * Validate and sanitize comment content
 */
export function sanitizeCommentContent(content: string): string {
  if (!content || typeof content !== 'string') return '';
  
  // For comments, we don't allow any HTML - just plain text
  return sanitizeText(content);
}

/**
 * Sanitize comment subject line
 */
export function sanitizeCommentSubject(subject: string): string {
  if (!subject || typeof subject !== 'string') return '';
  
  return sanitizeText(subject);
}

/**
 * Sanitize personal ID to prevent injection
 */
export function sanitizePersonalId(personalId: string): string {
  if (!personalId || typeof personalId !== 'string') return '';
  
  // Personal IDs should only contain alphanumeric characters
  return personalId.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Security validation for user input
 */
export function detectXssAttempt(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gis,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<form[^>]*>/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Log potential XSS attempts for security monitoring
 */
export function logSecurityIncident(type: string, content: string, userAgent?: string): void {
  console.warn(`🚨 Security Incident Detected: ${type}`, {
    timestamp: new Date().toISOString(),
    content: content.substring(0, 100), // Only log first 100 chars
    userAgent: userAgent || navigator.userAgent,
    url: window.location.href
  });
  
  // In production, this should also send to a security monitoring service
}
