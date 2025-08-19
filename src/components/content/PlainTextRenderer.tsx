/**
 * Unified story content renderer that replaces both StoryContent and SimpleStoryContent
 */

import { createSafeHtml } from "@/utils/xssProtection";
import { wrapParagraphs } from "@/utils/textUtils";

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
    // Wrap plain text in paragraphs if needed
    const processedContent = wrapParagraphs(content);
    const safeHtml = createSafeHtml(processedContent);
    return (
      <div 
        className={`story-content ${className}`}
        dangerouslySetInnerHTML={safeHtml}
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