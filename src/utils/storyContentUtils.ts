
export const cleanHtmlContent = (htmlContent: string) => {
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
        // Preserve any br tags within the div (these are Shift+Enter line breaks)
        p.innerHTML = element.innerHTML;
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
  
  // Ensure we have proper paragraph structure
  const html = tempDiv.innerHTML;
  
  // If there's no paragraph structure, wrap content in paragraphs
  if (!html.includes('<p>') && html.trim()) {
    // Split by double line breaks (paragraph breaks) but preserve single line breaks
    const paragraphs = html.split(/(?:<br\s*\/?>\s*){2,}/);
    const wrappedContent = paragraphs
      .filter(p => p.trim())
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
    return wrappedContent;
  }
  
  return html;
};

export const formatStoryContent = (content: string) => {
  const cleanedContent = cleanHtmlContent(content);
  
  return {
    __html: cleanedContent
  };
};
