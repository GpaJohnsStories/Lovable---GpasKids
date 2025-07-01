/**
 * Unified story content renderer that replaces both StoryContent and SimpleStoryContent
 */

import { formatStoryContent } from "@/utils/contentUtils";

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
  if (content) {
    return (
      <div 
        className={`story-content ${className}`}
        dangerouslySetInnerHTML={formatStoryContent(content, useRichCleaning)}
      />
    );
  }

  if (excerpt) {
    return (
      <p className={`story-content ${className}`}>
        {excerpt}
      </p>
    );
  }

  return null;
};

export default StoryContentRenderer;