/**
 * Unified content formatting utilities for story content
 * Combines functionality from storyContentUtils and simpleContentUtils
 */

export interface FormattedContent {
  __html: string;
}

/**
 * Clean HTML content by removing security risks and normalizing structure
 */
export const cleanHtmlContent = (htmlContent: string): string => {
  if (!htmlContent || htmlContent.trim() === '') {
    return '';
  }

  // Basic security cleanup - remove script and style tags
  let cleanContent = htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // For simple content, just add paragraph structure if needed
  if (!cleanContent.includes('<p>') && cleanContent.trim()) {
    // Split by double line breaks and wrap in paragraphs
    const paragraphs = cleanContent.split(/(?:<br\s*\/?>\s*){2,}/);
    cleanContent = paragraphs
      .filter(p => p.trim())
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
  }

  return cleanContent;
};

/**
 * Advanced HTML content cleaning for rich text content
 */
export const cleanRichHtmlContent = (htmlContent: string): string => {
  if (!htmlContent || htmlContent.trim() === '') {
    return '';
  }

  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const cleanElement = (element: Element) => {
    // Handle div elements - these are typically created by contentEditable on Enter
    if (element.tagName === 'DIV') {
      const textContent = element.textContent || '';
      
      // If the div has meaningful content, convert it to a proper paragraph
      if (textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = element.innerHTML;
        
        // Copy only alignment styles, remove font-related inline styles
        if (element.getAttribute('style')) {
          const existingStyle = element.getAttribute('style') || '';
          // Only preserve text-align and other layout styles, remove font styles
          const cleanedStyle = existingStyle
            .split(';')
            .filter(style => {
              const styleName = style.split(':')[0]?.trim().toLowerCase();
              return styleName && ['text-align', 'margin', 'padding'].includes(styleName);
            })
            .join(';');
          
          if (cleanedStyle) {
            p.setAttribute('style', cleanedStyle);
          }
        }
        
        element.parentNode?.replaceChild(p, element);
        return;
      }
      
      // Remove empty divs
      if (!textContent.trim()) {
        element.remove();
        return;
      }
    }
    
    // Clean children recursively
    Array.from(element.children).forEach(cleanElement);
  };
  
  // Clean all elements
  Array.from(tempDiv.children).forEach(cleanElement);
  
  // Get the cleaned HTML
  let html = tempDiv.innerHTML;
  
  // If there's no paragraph structure, wrap content in paragraphs
  if (!html.includes('<p>') && html.trim()) {
    const paragraphs = html.split(/(?:<br\s*\/?>\s*){2,}/);
    const wrappedContent = paragraphs
      .filter(p => p.trim())
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
    return wrappedContent;
  }
  
  return html;
};

/**
 * Format story content for display with proper styling
 */
export const formatStoryContent = (content: string, useRichCleaning = false): FormattedContent => {
  const cleanedContent = useRichCleaning 
    ? cleanRichHtmlContent(content)
    : cleanHtmlContent(content);
  
  return {
    __html: cleanedContent
  };
};

/**
 * Format simple content (legacy compatibility)
 */
export const formatSimpleContent = (content: string): FormattedContent => {
  return formatStoryContent(content, false);
};