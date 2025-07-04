import React from 'react';
import { formatStoryContent } from "@/utils/contentUtils";

interface IsolatedStoryRendererProps {
  content?: string;
  excerpt?: string;
  useRichCleaning?: boolean;
  className?: string;
}

/**
 * Completely isolated story content renderer that uses its own styling
 * to ensure identical formatting across admin and public views
 */
const IsolatedStoryRenderer: React.FC<IsolatedStoryRendererProps> = ({ 
  content, 
  excerpt, 
  useRichCleaning = false,
  className = ""
}) => {
  if (content) {
    return (
      <div className={className}>
        <style dangerouslySetInnerHTML={{
          __html: `
            .isolated-story-content,
            .isolated-story-content p,
            .isolated-story-content div {
              font-family: Georgia, serif !important;
              font-size: 18px !important;
              color: #000000 !important;
              line-height: 1.6 !important;
              font-weight: normal !important;
              font-style: normal !important;
            }
            
            /* Allow spans to inherit or use inline styles for font-size */
            .isolated-story-content span {
              font-family: Georgia, serif !important;
              color: #000000 !important;
              line-height: 1.6 !important;
            }
            
            .isolated-story-content p {
              margin: 0 0 1.5em 0 !important;
              min-height: 1.6em !important;
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
          `
        }} />
        <div 
          className="isolated-story-content"
          dangerouslySetInnerHTML={formatStoryContent(content, useRichCleaning)}
        />
      </div>
    );
  }

  if (excerpt) {
    return (
      <div 
        className={`isolated-story-content ${className}`}
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '18px',
          color: '#000000',
          lineHeight: '1.6',
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