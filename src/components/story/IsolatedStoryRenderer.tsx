import React from 'react';
import { createSafeHtml } from "@/utils/xssProtection";

interface IsolatedStoryRendererProps {
  content?: string;
  excerpt?: string;
  useRichCleaning?: boolean;
  className?: string;
  category?: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText" | "STORY";
}

/**
 * Completely isolated story content renderer that uses its own styling
 * to ensure identical formatting across admin and public views
 */
const IsolatedStoryRenderer: React.FC<IsolatedStoryRendererProps> = ({ 
  content, 
  excerpt, 
  useRichCleaning = false,
  className = "",
  category
}) => {
  const isWebText = category === "WebText";
  const baseFontFamily = isWebText 
    ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" 
    : "Georgia, serif";

  if (content) {
    // Preprocess content to handle quote-wrapped strings
    let processedContent = content;
    if (typeof content === 'string' && content.startsWith('"') && content.endsWith('"')) {
      try {
        // Remove the wrapping quotes and unescape the content
        processedContent = JSON.parse(content);
      } catch (e) {
        // If parsing fails, use the content as-is
      }
    }
    
    const safeHtml = createSafeHtml(processedContent);
    
    return (
      <>
        <div 
          className={className}
          style={{
            // Targeted resets that preserve HTML element defaults
            margin: 0,
            padding: 0,
            border: 0,
            boxSizing: 'border-box',
            display: 'block',
            // Remove fontFamily from container to allow inline styles to work
            fontSize: '18px',
            color: '#000000',
            lineHeight: '1.5',
          }}
          dangerouslySetInnerHTML={safeHtml}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            div[style*="font-family"]:not(.no-text-styles) strong,
            div[style*="font-family"]:not(.no-text-styles) b,
            div[style*="font-family"]:not(.no-text-styles) span[style*="font-weight: bold"],
            div[style*="font-family"]:not(.no-text-styles) span[style*="font-weight:bold"] {
              font-weight: bold !important;
            }
            div[style*="font-family"]:not(.no-text-styles) em,
            div[style*="font-family"]:not(.no-text-styles) i,
            div[style*="font-family"]:not(.no-text-styles) span[style*="font-style: italic"],
            div[style*="font-family"]:not(.no-text-styles) span[style*="font-style:italic"] {
              font-style: italic !important;
            }
            div[style*="font-family"]:not(.no-text-styles) u,
            div[style*="font-family"]:not(.no-text-styles) span[style*="text-decoration: underline"],
            div[style*="font-family"]:not(.no-text-styles) span[style*="text-decoration:underline"] {
              text-decoration: underline !important;
            }
            /* Default font family for content without inline styles */
            div:not([style*="font-family"]) {
              font-family: ${isWebText ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" : "Georgia, serif"} !important;
            }
          `
        }} />
      </>
    );
  }

  if (excerpt) {
    return (
      <div 
        className={className}
        style={{
          // Targeted resets that preserve HTML element defaults
          margin: 0,
          padding: 0,
          border: 0,
          boxSizing: 'border-box',
          display: 'block',
          fontFamily: baseFontFamily,
          fontSize: '18px',
          color: '#000000',
          lineHeight: '1.5',
        }}
      >
        {excerpt}
      </div>
    );
  }

  return null;
};

export default IsolatedStoryRenderer;