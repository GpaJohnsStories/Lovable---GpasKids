
export const cleanHtmlContent = (htmlContent: string) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Remove unnecessary nested divs and clean up structure
  const cleanElement = (element: Element) => {
    // Convert div elements that only contain text or simple content to paragraphs
    if (element.tagName === 'DIV') {
      const hasOnlyTextOrInlineContent = Array.from(element.childNodes).every(node => 
        node.nodeType === Node.TEXT_NODE || 
        (node.nodeType === Node.ELEMENT_NODE && ['SPAN', 'STRONG', 'EM', 'B', 'I', 'BR'].includes((node as Element).tagName))
      );
      
      if (hasOnlyTextOrInlineContent && element.textContent?.trim()) {
        const p = document.createElement('p');
        p.innerHTML = element.innerHTML;
        element.parentNode?.replaceChild(p, element);
        return;
      }
      
      // Remove empty divs
      if (!element.textContent?.trim() && !element.querySelector('br')) {
        element.remove();
        return;
      }
      
      // If div only contains other divs, unwrap it
      const childDivs = element.querySelectorAll(':scope > div');
      if (childDivs.length === element.children.length && element.children.length > 0) {
        const parent = element.parentNode;
        if (parent) {
          while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
          }
          element.remove();
          return;
        }
      }
    }
    
    // Clean children recursively
    Array.from(element.children).forEach(cleanElement);
  };
  
  // Clean all elements
  Array.from(tempDiv.children).forEach(cleanElement);
  
  // Convert remaining empty divs to paragraph breaks
  tempDiv.querySelectorAll('div').forEach(div => {
    if (!div.textContent?.trim()) {
      const br = document.createElement('br');
      div.parentNode?.replaceChild(br, div);
    }
  });
  
  return tempDiv.innerHTML;
};

export const formatStoryContent = (content: string) => {
  const cleanedContent = cleanHtmlContent(content);
  
  return {
    __html: cleanedContent
  };
};
