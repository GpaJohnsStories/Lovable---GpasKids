import React, { useRef, useEffect, forwardRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HTMLEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onSave?: () => void;
}

const HTMLEditor = forwardRef<HTMLTextAreaElement, HTMLEditorProps>(({ 
  content, 
  onChange, 
  placeholder = "Start writing your story...",
  onSave
}, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = ref || internalRef;
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const textarea = typeof textareaRef === 'function' ? null : textareaRef.current;
    if (textarea) {
      // Store current scroll position to prevent jumping
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Auto-resize textarea
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      
      // Restore scroll position to prevent jumping
      window.scrollTo(0, scrollTop);
    }
  }, [content, textareaRef]);

  const wrapSelectedText = (openTag: string, closeTag: string) => {
    const textarea = typeof textareaRef === 'function' ? null : textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText) {
      const wrappedText = `${openTag}${selectedText}${closeTag}`;
      const newContent = content.substring(0, start) + wrappedText + content.substring(end);
      onChange(newContent);
      
      setTimeout(() => {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + wrappedText.length;
        textarea.focus();
      }, 0);
    }
  };

  const insertAtCursor = (text: string) => {
    const textarea = typeof textareaRef === 'function' ? null : textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    onChange(newContent);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const handleClipboard = async (action: 'copy' | 'cut' | 'paste') => {
    const textarea = typeof textareaRef === 'function' ? null : textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    try {
      if (action === 'copy' && selectedText) {
        await navigator.clipboard.writeText(selectedText);
      } else if (action === 'cut' && selectedText) {
        await navigator.clipboard.writeText(selectedText);
        const newContent = content.substring(0, start) + content.substring(end);
        onChange(newContent);
      } else if (action === 'paste') {
        const clipboardText = await navigator.clipboard.readText();
        const newContent = content.substring(0, start) + clipboardText + content.substring(end);
        onChange(newContent);
      }
    } catch (err) {
      console.warn('Clipboard operation failed:', err);
    }
  };

  const handleClearHtml = () => {
    const textarea = typeof textareaRef === 'function' ? null : textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) return; // No selection
    
    const selectedText = content.substring(start, end);
    // Strip all HTML tags from selected text
    const plainText = selectedText.replace(/<[^>]*>/g, '');
    const newContent = content.substring(0, start) + plainText + content.substring(end);
    onChange(newContent);
    
    // Maintain selection
    setTimeout(() => {
      textarea.selectionStart = start;
      textarea.selectionEnd = start + plainText.length;
      textarea.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    
    // Handle Ctrl+T first to prevent new tab creation
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
      e.preventDefault();
      e.stopPropagation();
      wrapSelectedText('<center>', '</center>');
      return;
    }
    
    // Tab key handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newValue);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
      return;
    }

    // Handle Ctrl+Enter for new line
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      insertAtCursor('<br>');
      return;
    }

    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          wrapSelectedText('<strong>', '</strong>');
          break;
        case 'i':
          e.preventDefault();
          wrapSelectedText('<em>', '</em>');
          break;
        case 'u':
          e.preventDefault();
          wrapSelectedText('<u>', '</u>');
          break;
        case 'c':
          e.preventDefault();
          handleClipboard('copy');
          break;
        case 'x':
          e.preventDefault();
          handleClipboard('cut');
          break;
        case 'y':
          e.preventDefault();
          handleClipboard('paste');
          break;
        case 'p':
          e.preventDefault();
          wrapSelectedText('<p>', '</p>');
          break;
        case 'l':
          e.preventDefault();
          insertAtCursor('<ul>\n  <li></li>\n  <li></li>\n</ul>');
          break;
        case 'n':
          e.preventDefault();
          insertAtCursor('–'); // N-dash (short pause)
          break;
        case 'm':
          e.preventDefault();
          insertAtCursor('—'); // M-dash (long pause)
          break;
        case '#':
          e.preventDefault();
          insertAtCursor('<ol>\n  <li></li>\n  <li></li>\n</ol>');
          break;
        case '1':
          e.preventDefault();
          wrapSelectedText('<h1>', '</h1>');
          break;
        case '2':
          e.preventDefault();
          wrapSelectedText('<h2>', '</h2>');
          break;
        case '3':
          e.preventDefault();
          wrapSelectedText('<h3>', '</h3>');
          break;
        case 'f':
          e.preventDefault();
          wrapSelectedText('<em style="font-family: serif;">', '</em>');
          break;
        case 'h':
          e.preventDefault();
          setShowHelp(true);
          break;
        case 'e':
          e.preventDefault();
          wrapSelectedText('<center>', '</center>'); // Center text
          break;
        case 'k':
          e.preventDefault();
          handleClearHtml(); // Clear HTML
          break;
        case 's':
          e.preventDefault();
          if (onSave) {
            onSave();
          }
          break;
      }
    }
  };

  const shortcuts = [
    { key: 'Ctrl + B', action: 'Bold' },
    { key: 'Ctrl + C', action: 'Copy' },
    { key: 'Ctrl + E', action: 'Center Text' },
    { key: 'Ctrl + Enter', action: 'New Line (<br>)' },
    { key: 'Ctrl + F', action: 'Georgia Font' },
    { key: 'Ctrl + H', action: 'Help' },
    { key: 'Ctrl + I', action: 'Italics' },
    { key: 'Ctrl + K', action: 'Clear HTML' },
    { key: 'Ctrl + L', action: 'Bullets' },
    { key: 'Ctrl + M', action: 'M-dash — (long pause)' },
    { key: 'Ctrl + N', action: 'N-dash – (short pause)' },
    { key: 'Ctrl + P', action: 'Paragraph' },
    { key: 'Ctrl + S', action: 'Save Story' },
    { key: 'Ctrl + U', action: 'Underline' },
    { key: 'Ctrl + X', action: 'Cut' },
    { key: 'Ctrl + Y', action: 'Paste' },
    { key: 'Ctrl + #', action: 'Numbered List' },
    { key: 'Ctrl + 1', action: 'H1 Heading' },
    { key: 'Ctrl + 2', action: 'H2 Heading' },
    { key: 'Ctrl + 3', action: 'H3 Heading' },
  ];

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">HTML Source</span>
        </div>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-full min-h-[400px] p-4 border-none outline-none resize-none font-mono text-sm leading-relaxed bg-white"
            style={{
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              lineHeight: '1.6'
            }}
          />
          
          {/* Line numbers overlay could go here in future */}
        </div>
      </div>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                <span className="font-mono text-sm">{shortcut.key}</span>
                <span className="text-sm text-gray-600">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

HTMLEditor.displayName = 'HTMLEditor';

export default HTMLEditor;