
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
    element.style.fontSize = '16px';
    element.style.color = '#000000';
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
