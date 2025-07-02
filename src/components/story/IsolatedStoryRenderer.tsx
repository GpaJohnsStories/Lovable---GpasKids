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
  // Custom styles that are completely isolated and override everything
  const isolatedStyles: React.CSSProperties = {
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    color: '#000000',
    lineHeight: '1.6',
    fontWeight: 'normal',
    fontStyle: 'normal',
    background: 'white',
    padding: '0',
    margin: '0'
  };

  if (content) {
    return (
      <div 
        className={className}
        style={isolatedStyles}
        dangerouslySetInnerHTML={formatStoryContent(content, useRichCleaning)}
      />
    );
  }

  if (excerpt) {
    return (
      <div 
        className={className}
        style={isolatedStyles}
      >
        {excerpt}
      </div>
    );
  }

  return null;
};

export default IsolatedStoryRenderer;