import { createSafeHtml } from "@/utils/xssProtection";

interface SecureStoryContentProps {
  content?: string;
  excerpt?: string;
  className?: string;
}

/**
 * Secure story content renderer that prevents XSS while preserving formatting
 * Uses sanitized HTML rendering for story content
 */
const SecureStoryContent = ({ 
  content, 
  excerpt, 
  className = "" 
}: SecureStoryContentProps) => {
  if (content) {
    const safeHtml = createSafeHtml(content);
    return (
      <div 
        className={`story-content ${className}`}
        dangerouslySetInnerHTML={safeHtml}
      />
    );
  }

  if (excerpt) {
    // For excerpts, use plain text (no HTML allowed)
    return (
      <p className={`story-content ${className}`}>
        {excerpt}
      </p>
    );
  }

  return null;
};

export default SecureStoryContent;