/**
 * Simple utility to strip legacy header tokens from content for display
 * Does not process tokens - just removes them for clean content display
 */
export const stripLegacyTokens = (content: string): string => {
  if (!content) return content;
  
  let cleanedContent = content;
  
  // Define all legacy token patterns for removal
  const legacyTokenPatterns = [
    // Wrapped patterns
    /<[^>]+>\{\{TITLE\}\}[\s\S]*?\{\{\/TITLE\}\}<\/[^>]+>/gi,
    /<[^>]+>\{\{TAGLINE\}\}[\s\S]*?\{\{\/TAGLINE\}\}<\/[^>]+>/gi,
    /<[^>]+>\{\{AUTHOR\}\}[\s\S]*?\{\{\/AUTHOR\}\}<\/[^>]+>/gi,
    /<[^>]+>\{\{EXCERPT\}\}[\s\S]*?\{\{\/EXCERPT\}\}<\/[^>]+>/gi,
    // Standard patterns
    /\{\{TITLE\}\}([\s\S]*?)\{\{\/TITLE\}\}/gi,
    /\{\{TAGLINE\}\}([\s\S]*?)\{\{\/TAGLINE\}\}/gi,
    /\{\{AUTHOR\}\}([\s\S]*?)\{\{\/AUTHOR\}\}/gi,
    /\{\{EXCERPT\}\}([\s\S]*?)\{\{\/EXCERPT\}\}/gi,
    /\{\{BIGICON\}\}([\s\S]*?)\{\{\/BIGICON\}\}/gi
  ];
  
  // Remove all legacy token patterns from content
  legacyTokenPatterns.forEach(pattern => {
    cleanedContent = cleanedContent.replace(pattern, '');
  });
  
  // Clean up any extra whitespace left by token removal
  cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
  
  return cleanedContent;
};