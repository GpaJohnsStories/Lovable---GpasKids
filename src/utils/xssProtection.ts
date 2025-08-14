/**
 * XSS Protection Utilities
 * Provides secure HTML encoding and content sanitization for user-generated content
 * Uses DOMPurify for industry-standard HTML sanitization
 */

import DOMPurify from 'dompurify';

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
 * Safe HTML content renderer using DOMPurify for industry-standard XSS protection
 * Preserves basic formatting while preventing XSS attacks
 */
export function createSafeHtml(content: string): { __html: string } {
  if (!content || typeof content !== 'string') {
    return { __html: '' };
  }

  // Configure DOMPurify with allowed tags and attributes for story content
  const cleanHtml = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 
      'ol', 'ul', 'li', 'span', 'center', 'a', 'font'
    ],
    ALLOWED_ATTR: [
      'style', 'href', 'target', 'rel', 'title', 'alt',
      'face', 'size', 'color' // Allow font attributes for backward compatibility
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ['target'], // Allow target="_blank" for links
    FORBID_CONTENTS: ['script', 'style'],
    KEEP_CONTENT: false
  });

  return { __html: cleanHtml };
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
