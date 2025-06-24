
export const cleanHtmlContent = (htmlContent: string) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Convert <br> tags to line breaks within paragraphs
  const processBrTags = (element: Element) => {
    const brTags = element.querySelectorAll('br');
    brTags.forEach(br => {
      // Replace <br> with a line break character that we'll preserve
      const textNode = document.createTextNode('\n');
      br.parentNode?.replaceChild(textNode, br);
    });
  };
  
  // Process all elements to handle br tags
  processBrTags(tempDiv);
  
  const cleanElement = (element: Element) => {
    // Convert div elements that contain line breaks to paragraphs with preserved breaks
    if (element.tagName === 'DIV') {
      const textContent = element.textContent || '';
      
      // If the div has meaningful content, convert it to a paragraph
      if (textContent.trim()) {
        const p = document.createElement('p');
        // Preserve the innerHTML but ensure line breaks are maintained
        p.innerHTML = element.innerHTML.replace(/\n/g, '<br>');
        element.parentNode?.replaceChild(p, element);
        return;
      }
      
      // Remove completely empty divs
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
  
  return tempDiv.innerHTML;
};

export const formatStoryContent = (content: string) => {
  const cleanedContent = cleanHtmlContent(content);
  
  return {
    __html: cleanedContent
  };
};
