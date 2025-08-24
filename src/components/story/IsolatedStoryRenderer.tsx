import React from 'react';
import { createSafeHtml } from "@/utils/xssProtection";
import { wrapParagraphs } from "@/utils/textUtils";
import { extractHeaderTokens, createSafeHeaderHtml } from "@/utils/headerTokens";

interface IsolatedStoryRendererProps {
  content?: string;
  excerpt?: string;
  useRichCleaning?: boolean;
  className?: string;
  category?: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText" | "STORY";
  fontSize?: number;
  onFontSizeChange?: (fontSize: number) => void;
  showHeaderPreview?: boolean;
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
  category,
  fontSize = 16,
  onFontSizeChange,
  showHeaderPreview = true
}) => {
  const isWebText = category === "WebText";
  const baseFontFamily = isWebText 
    ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" 
    : "'Arial', sans-serif";

  if (content) {
    // Extract tokens if showing header preview
    let tokens, contentWithoutTokens;
    if (showHeaderPreview) {
      const extracted = extractHeaderTokens(content);
      tokens = extracted.tokens;
      contentWithoutTokens = extracted.contentWithoutTokens;
    }

    // Use the content without tokens if available, otherwise use original content
    let processedContent = contentWithoutTokens || content;
    
    // Preprocess content to handle quote-wrapped strings
    if (typeof processedContent === 'string' && processedContent.startsWith('"') && processedContent.endsWith('"')) {
      try {
        // Remove the wrapping quotes and unescape the content
        processedContent = JSON.parse(processedContent);
      } catch (e) {
        // If parsing fails, use the content as-is
      }
    }
    
    // Wrap plain text in paragraphs if needed
    processedContent = wrapParagraphs(processedContent);
    
    const safeHtml = createSafeHtml(processedContent);
    
    return (
      <>
        {/* Header Preview Section */}
        {showHeaderPreview && tokens && (tokens.titleHtml || tokens.taglineHtml || tokens.authorHtml || tokens.excerptHtml) && (
          <div className="header-preview mb-6 pb-4 border-b border-border">
            {tokens.titleHtml && (
              <h1 
                className="text-2xl font-bold mb-2 text-foreground"
                style={{ 
                  fontFamily: isWebText ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" : "'Arial', sans-serif",
                  fontSize: `${Math.floor(fontSize * 1.5)}px`
                }}
                dangerouslySetInnerHTML={createSafeHtml(tokens.titleHtml)}
              />
            )}
            {tokens.taglineHtml && (
              <div 
                className="text-lg italic mb-2 text-muted-foreground"
                style={{ 
                  fontFamily: isWebText ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" : "'Arial', sans-serif",
                  fontSize: `${Math.floor(fontSize * 1.1)}px`
                }}
                dangerouslySetInnerHTML={createSafeHtml(tokens.taglineHtml)}
              />
            )}
            {tokens.authorHtml && (
              <div 
                className="text-base mb-2 text-foreground"
                style={{ 
                  fontFamily: isWebText ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" : "'Arial', sans-serif",
                  fontSize: `${fontSize}px`
                }}
                dangerouslySetInnerHTML={createSafeHtml(tokens.authorHtml)}
              />
            )}
            {tokens.excerptHtml && (
              <div 
                className="text-sm text-muted-foreground"
                style={{ 
                  fontFamily: isWebText ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" : "'Arial', sans-serif",
                  fontSize: `${Math.floor(fontSize * 0.9)}px`
                }}
                dangerouslySetInnerHTML={createSafeHtml(tokens.excerptHtml)}
              />
            )}
          </div>
        )}
        
        {/* Main Content Section */}
        <div 
          className={`rendered-story-content ${className}`}
          style={{
            // Targeted resets that preserve HTML element defaults
            margin: 0,
            padding: 0,
            border: 0,
            boxSizing: 'border-box',
            display: 'block',
            // Remove fontFamily from container to allow inline styles to work
            fontSize: `${fontSize}px`,
            color: '#000000',
            lineHeight: '1.5',
          }}
          dangerouslySetInnerHTML={safeHtml}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Preserve inline font-family styles - no overrides */
            span[style*="font-family"] {
              /* Let inline styles work naturally */
            }
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
              font-family: ${isWebText ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" : "'Arial', sans-serif"} !important;
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
          fontSize: `${fontSize}px`,
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