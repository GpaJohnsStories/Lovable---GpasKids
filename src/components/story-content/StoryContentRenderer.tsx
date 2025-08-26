
import React from 'react';
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";

interface StoryContentRendererProps {
  content: string;
  className?: string;
  fontSize?: number;
  onFontSizeChange?: (fontSize: number) => void;
}

/**
 * Legacy story content renderer - delegates to IsolatedStoryRenderer
 * @deprecated Use IsolatedStoryRenderer directly for new code
 */
export const StoryContentRenderer: React.FC<StoryContentRendererProps> = ({ 
  content, 
  className = "",
  fontSize = 16,
  onFontSizeChange
}) => {
  return (
    <IsolatedStoryRenderer
      content={content}
      className={className}
      fontSize={fontSize}
      onFontSizeChange={onFontSizeChange}
      category="STORY"
      useRichCleaning={true}
    />
  );
};
