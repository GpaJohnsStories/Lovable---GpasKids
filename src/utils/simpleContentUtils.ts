
export const formatSimpleContent = (content: string) => {
  // Minimal processing with inline styling injection
  if (!content || content.trim() === '') {
    return { __html: '' };
  }

  // Basic cleanup - remove any script tags for security
  let cleanContent = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Add inline styles to any existing paragraph tags
  cleanContent = cleanContent.replace(
    /<p([^>]*)>/gi, 
    '<p$1 style="font-family: Georgia, serif; font-size: 18px; color: #000000; line-height: 1.6; font-weight: normal; font-style: normal; margin: 0 0 1.5em 0;">'
  );

  // If no paragraph tags exist, wrap the content
  if (!cleanContent.includes('<p>')) {
    cleanContent = `<p style="font-family: Georgia, serif; font-size: 18px; color: #000000; line-height: 1.6; font-weight: normal; font-style: normal; margin: 0 0 1.5em 0;">${cleanContent}</p>`;
  }

  return { __html: cleanContent };
};
