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
  const [showFontReference, setShowFontReference] = useState(false);

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
          e.stopPropagation();
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
        case 'q':
          e.preventDefault();
          e.stopPropagation();
          setShowFontReference(true);
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
    { key: 'Ctrl + Q', action: 'Font Reference' },
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

      <Dialog open={showFontReference} onOpenChange={setShowFontReference}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Font Reference Guide</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
            
            {/* Kalam Font Family */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Kalam Font Family (UI Elements)</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h1&gt;Heading 1&lt;/h1&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Kalam', 'Comic Sans MS', 'Arial', sans-serif", fontSize: '2em', fontWeight: 700 }}>
                    Heading 1
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h2&gt;Heading 2&lt;/h2&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Kalam', 'Comic Sans MS', 'Arial', sans-serif", fontSize: '1.5em', fontWeight: 700 }}>
                    Heading 2
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h3&gt;Heading 3&lt;/h3&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Kalam', 'Comic Sans MS', 'Arial', sans-serif", fontSize: '1.17em', fontWeight: 700 }}>
                    Heading 3
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p&gt;UI Text&lt;/p&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Kalam', 'Comic Sans MS', 'Arial', sans-serif", fontSize: '14px', lineHeight: '1.7' }}>
                    UI Text (Navigation, Buttons, etc.)
                  </div>
                </div>
              </div>
            </div>

            {/* Georgia Serif Font Family */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Georgia Serif Font Family (Story Content)</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h1&gt;Story Heading 1&lt;/h1&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '2em', fontWeight: 'bold', color: '#000000', lineHeight: '1.6' }}>
                    Story Heading 1
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h2&gt;Story Heading 2&lt;/h2&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '1.5em', fontWeight: 'bold', color: '#000000', lineHeight: '1.6' }}>
                    Story Heading 2
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h3&gt;Story Heading 3&lt;/h3&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '1.17em', fontWeight: 'bold', color: '#000000', lineHeight: '1.6' }}>
                    Story Heading 3
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p&gt;Story paragraph text&lt;/p&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '18px', color: '#000000', lineHeight: '1.5' }}>
                    Story paragraph text (main content)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;strong&gt;Bold text&lt;/strong&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '18px', fontWeight: 'bold', color: '#000000', lineHeight: '1.6' }}>
                    Bold text
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;em&gt;Italic text&lt;/em&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '18px', fontStyle: 'italic', color: '#000000', lineHeight: '1.6' }}>
                    Italic text
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;u&gt;Underlined text&lt;/u&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '18px', textDecoration: 'underline', color: '#000000', lineHeight: '1.6' }}>
                    Underlined text
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;center&gt;Centered text&lt;/center&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '18px', color: '#000000', lineHeight: '1.5', textAlign: 'center' }}>
                    Centered text
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;em style="font-family: serif;"&gt;Special serif style&lt;/em&gt;</code>
                  </div>
                  <div style={{ fontFamily: 'serif', fontSize: '18px', fontStyle: 'italic', color: '#000000', lineHeight: '1.6' }}>
                    Special serif style (Ctrl+F)
                  </div>
                </div>
              </div>
            </div>

            {/* Special Elements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Special Elements</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;br&gt;</code>
                  </div>
                  <div className="text-sm text-gray-600">
                    Line break (Ctrl+Enter)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;ul&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ul&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '18px', color: '#000000' }}>
                    <ul><li>Bullet list item</li></ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;ol&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ol&gt;</code>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '18px', color: '#000000' }}>
                    <ol><li>Numbered list item</li></ol>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">–</code>
                  </div>
                  <div className="text-sm text-gray-600">
                    N-dash (short pause) - Ctrl+N
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">—</code>
                  </div>
                  <div className="text-sm text-gray-600">
                    M-dash (long pause) - Ctrl+M
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Story content automatically uses Georgia serif font. UI elements use Kalam font for a child-friendly appearance.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

HTMLEditor.displayName = 'HTMLEditor';

export default HTMLEditor;