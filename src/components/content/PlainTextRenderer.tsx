/**
 * Plain text renderer - delegates to IsolatedStoryRenderer
 * @deprecated Use IsolatedStoryRenderer directly for new code
 */

import React from 'react';
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";

interface StoryContentRendererProps {
  content?: string;
  excerpt?: string;
  useRichCleaning?: boolean;
  className?: string;
}

const StoryContentRenderer = ({ 
  content, 
  excerpt, 
  useRichCleaning = false,
  className = ""
}: StoryContentRendererProps) => {
  return (
    <IsolatedStoryRenderer
      content={content}
      excerpt={excerpt}
      useRichCleaning={useRichCleaning}
      className={className}
    />
  );
};

export default StoryContentRenderer;