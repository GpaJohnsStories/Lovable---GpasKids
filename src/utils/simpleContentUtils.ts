
export const formatSimpleContent = (content: string) => {
  // Minimal processing - just ensure we have valid HTML structure
  if (!content || content.trim() === '') {
    return { __html: '' };
  }

  // Basic cleanup - remove any script tags for security
  const cleanContent = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  return { __html: cleanContent };
};
