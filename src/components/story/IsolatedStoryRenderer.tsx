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
    console.log('🎯 IsolatedStoryRenderer: Raw content received:', content);
    
    // Preprocess content to handle quote-wrapped strings
    let processedContent = content;
    if (typeof content === 'string' && content.startsWith('"') && content.endsWith('"')) {
      try {
        // Remove the wrapping quotes and unescape the content
        processedContent = JSON.parse(content);
        console.log('🎯 IsolatedStoryRenderer: Processed content after quote removal:', processedContent);
      } catch (e) {
        console.warn('🎯 IsolatedStoryRenderer: Failed to parse quoted content, using as-is:', e);
      }
    }
    
    console.log('🎯 IsolatedStoryRenderer: Final content for createSafeHtml:', processedContent);
    const safeHtml = createSafeHtml(processedContent);
    console.log('🎯 IsolatedStoryRenderer: safeHtml result:', safeHtml);
    
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
        dangerouslySetInnerHTML={safeHtml}
      />
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