import React from 'react';
import { createSafeHtml } from "@/utils/xssProtection";

interface IsolatedStoryRendererProps {
  content?: string;
  excerpt?: string;
  useRichCleaning?: boolean;
  className?: string;
  category?: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "STORY";
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
    const safeHtml = createSafeHtml(content);
    return (
      <div className={className}>
        <style dangerouslySetInnerHTML={{
          __html: `
            .isolated-story-content,
            .isolated-story-content p,
            .isolated-story-content div {
              font-family: ${baseFontFamily} !important;
              font-size: 18px !important;
              color: #000000 !important;
              line-height: 1.5 !important;
              font-weight: normal !important;
              font-style: normal !important;
            }
            
            /* Allow spans to inherit or use inline styles for font-size */
            .isolated-story-content span {
              font-family: ${baseFontFamily} !important;
              color: #000000 !important;
              line-height: 1.5 !important;
              /* Explicitly allow inline font-size to override default */
            }
            
            /* Ensure spans with inline font-size are respected */
            .isolated-story-content span[style*="font-size"] {
              /* Let the inline style take precedence */
            }
            
            .isolated-story-content p {
              margin: 0 0 0.5em 0 !important;
              min-height: 1.5em !important;
            }
            
            .isolated-story-content strong,
            .isolated-story-content b {
              font-weight: bold !important;
            }
            
            .isolated-story-content em,
            .isolated-story-content i {
              font-style: italic !important;
            }
            
            .isolated-story-content u {
              text-decoration: underline !important;
            }
            
            .isolated-story-content h1 {
              font-size: 2em !important;
              font-weight: bold !important;
            }
            
            .isolated-story-content h2 {
              font-size: 1.5em !important;
              font-weight: bold !important;
            }
            
            .isolated-story-content h3 {
              font-size: 1.17em !important;
              font-weight: bold !important;
            }
            
            .isolated-story-content ul {
              list-style-type: disc !important;
              margin: 0 0 0.5em 0 !important;
              padding-left: 2em !important;
              font-family: ${baseFontFamily} !important;
              font-size: 18px !important;
              color: #000000 !important;
              line-height: 1.5 !important;
            }
            
            .isolated-story-content ol {
              list-style-type: decimal !important;
              margin: 0 0 0.5em 0 !important;
              padding-left: 2em !important;
              font-family: ${baseFontFamily} !important;
              font-size: 18px !important;
              color: #000000 !important;
              line-height: 1.5 !important;
            }
            
            .isolated-story-content li {
              margin: 0.5em 0 !important;
              font-family: ${baseFontFamily} !important;
              font-size: 18px !important;
              color: #000000 !important;
              line-height: 1.5 !important;
            }
            
            .isolated-story-content center {
              text-align: center !important;
              display: block !important;
              font-family: ${baseFontFamily} !important;
              font-size: 18px !important;
              color: #000000 !important;
              line-height: 1.5 !important;
            }
          `
        }} />
        <div 
          className="isolated-story-content"
          dangerouslySetInnerHTML={safeHtml}
        />
      </div>
    );
  }

  if (excerpt) {
    return (
      <div 
        className={`isolated-story-content ${className}`}
        style={{
          fontFamily: baseFontFamily,
          fontSize: '18px',
          color: '#000000',
          lineHeight: '1.5',
          fontWeight: 'normal',
          fontStyle: 'normal'
        }}
      >
        {excerpt}
      </div>
    );
  }

  return null;
};

export default IsolatedStoryRenderer;