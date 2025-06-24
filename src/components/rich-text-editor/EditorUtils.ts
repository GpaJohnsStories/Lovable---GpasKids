
export const execCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

export const insertLink = () => {
  const url = prompt('Enter URL:');
  if (url) {
    execCommand('createLink', url);
  }
  return url;
};

export const applyDefaultStyles = (element: HTMLDivElement) => {
  if (element) {
    element.style.fontFamily = 'Georgia, serif';
    element.style.fontSize = '18px';
    element.style.color = '#000000';
    element.style.lineHeight = '1.6';
    element.style.fontWeight = 'normal';
    element.style.fontStyle = 'normal';
    element.style.whiteSpace = 'pre-line';
    element.focus();
  }
};

export const handleKeyboardShortcuts = (
  e: React.KeyboardEvent,
  onCommand: (command: string, value?: string) => void
) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'b':
        e.preventDefault();
        onCommand('bold');
        break;
      case 'i':
        e.preventDefault();
        onCommand('italic');
        break;
      case 'u':
        e.preventDefault();
        onCommand('underline');
        break;
      case 'k':
        e.preventDefault();
        const url = insertLink();
        if (url) onCommand('createLink', url);
        break;
    }
  }
};

export const handleEnterKey = (e: KeyboardEvent, element: HTMLDivElement) => {
  // Preserve line breaks and paragraph structure
  if (e.key === 'Enter') {
    if (e.shiftKey) {
      // Shift+Enter creates a line break
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br>');
    } else {
      // Regular Enter creates a new paragraph
      // Let the browser handle this naturally
    }
  }
};

export const normalizeContent = (element: HTMLDivElement) => {
  if (!element) return;
  
  // Apply default styles to maintain consistency while preserving structure
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
    null
  );
  
  let node;
  while (node = walker.nextNode()) {
    const el = node as HTMLElement;
    if (el.tagName !== 'UL' && el.tagName !== 'OL' && el.tagName !== 'LI' && 
        !el.tagName.startsWith('H') && el.tagName !== 'STRONG' && 
        el.tagName !== 'EM' && el.tagName !== 'B' && el.tagName !== 'I' && 
        el.tagName !== 'U' && el.tagName !== 'A' && el.tagName !== 'BR') {
      el.style.fontFamily = 'Georgia, serif';
      el.style.fontSize = '18px';
      el.style.color = '#000000';
      el.style.lineHeight = '1.6';
      el.style.fontWeight = 'normal';
      el.style.fontStyle = 'normal';
      if (el.tagName === 'P' || el.tagName === 'DIV') {
        el.style.whiteSpace = 'pre-line';
      }
    }
  }
};
