import React from 'react';
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";

interface SecureStoryContentProps {
  content?: string;
  excerpt?: string;
  className?: string;
}

/**
 * Secure story content renderer - delegates to IsolatedStoryRenderer
 * @deprecated Use IsolatedStoryRenderer directly for new code
 */
const SecureStoryContent = ({ 
  content, 
  excerpt, 
  className = "" 
}: SecureStoryContentProps) => {
  return (
    <IsolatedStoryRenderer
      content={content}
      excerpt={excerpt}
      className={className}
      useRichCleaning={true}
    />
  );
};

export default SecureStoryContent;