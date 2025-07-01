
export const cleanHtmlContent = (htmlContent: string) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const cleanElement = (element: Element) => {
    // Handle div elements - these are typically created by contentEditable on Enter
    if (element.tagName === 'DIV') {
      const textContent = element.textContent || '';
      
      // If the div has meaningful content, convert it to a proper paragraph with inline styles
      if (textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = element.innerHTML;
        p.setAttribute('style', 'font-family: Georgia, serif; font-size: 18px; color: #000000; line-height: 1.6; font-weight: normal; font-style: normal; margin: 0 0 1.5em 0;');
        
        // Copy any existing style attributes (like text-align: center) and merge them
        if (element.getAttribute('style')) {
          const existingStyle = element.getAttribute('style') || '';
          p.setAttribute('style', p.getAttribute('style') + ' ' + existingStyle);
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
    
    // Add inline styles to all paragraph elements
    if (element.tagName === 'P') {
      const existingStyle = element.getAttribute('style') || '';
      const baseStyle = 'font-family: Georgia, serif; font-size: 18px; color: #000000; line-height: 1.6; font-weight: normal; font-style: normal; margin: 0 0 1.5em 0;';
      element.setAttribute('style', baseStyle + ' ' + existingStyle);
    }
    
    // Clean children recursively
    Array.from(element.children).forEach(cleanElement);
  };
  
  // Clean all elements
  Array.from(tempDiv.children).forEach(cleanElement);
  
  // Get the cleaned HTML
  let html = tempDiv.innerHTML;
  
  // If there's no paragraph structure, wrap content in paragraphs with inline styles
  if (!html.includes('<p>') && html.trim()) {
    const paragraphs = html.split(/(?:<br\s*\/?>\s*){2,}/);
    const wrappedContent = paragraphs
      .filter(p => p.trim())
      .map(p => `<p style="font-family: Georgia, serif; font-size: 18px; color: #000000; line-height: 1.6; font-weight: normal; font-style: normal; margin: 0 0 1.5em 0;">${p.trim()}</p>`)
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
