import React, { useRef, useEffect, forwardRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HTMLEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onSave?: () => void;
  category?: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText" | "STORY";
}

const HTMLEditor = forwardRef<HTMLTextAreaElement, HTMLEditorProps>(({ 
  content, 
  onChange, 
  placeholder = "Start writing your story...",
  onSave,
  category
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
          wrapSelectedText('<span style="font-weight: bold;">', '</span>');
          break;
        case 'i':
          e.preventDefault();
          wrapSelectedText('<span style="font-style: italic;">', '</span>');
          break;
        case 'u':
          e.preventDefault();
          wrapSelectedText('<span style="text-decoration: underline;">', '</span>');
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
          wrapSelectedText('<p style="font-size: 32px; font-weight: bold; margin: 16px 0;">', '</p>');
          break;
        case '2':
          e.preventDefault();
          wrapSelectedText('<p style="font-size: 24px; font-weight: bold; margin: 12px 0;">', '</p>');
          break;
        case '3':
          e.preventDefault();
          wrapSelectedText('<p style="font-size: 20px; font-weight: bold; margin: 8px 0;">', '</p>');
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
    { key: 'Ctrl + 1', action: 'Big Text' },
    { key: 'Ctrl + 2', action: 'Med Text' },
    { key: 'Ctrl + 3', action: 'Large Text' },
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
                  <div className="font-kalam text-2xl font-bold">
                    Heading 1
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h2&gt;Heading 2&lt;/h2&gt;</code>
                  </div>
                  <div className="font-kalam text-xl font-bold">
                    Heading 2
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h3&gt;Heading 3&lt;/h3&gt;</code>
                  </div>
                  <div className="font-kalam text-lg font-bold">
                    Heading 3
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p&gt;UI Text&lt;/p&gt;</code>
                  </div>
                  <div className="font-kalam text-sm leading-relaxed">
                    UI Text (Navigation, Buttons, etc.)
                  </div>
                </div>
              </div>
            </div>

            {/* Home Page Header Elements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Home Page Header Elements</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;div class="text-blue-900 font-handwritten text-2xl font-bold"&gt;Grandpa John's&lt;/div&gt;</code>
                  </div>
                  <div className="font-kalam text-2xl font-bold text-blue-900">
                    Grandpa John's
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;div class="text-white font-handwritten text-3xl font-bold"&gt;Stories for Kids&lt;/div&gt;</code>
                  </div>
                  <div className="font-kalam text-3xl font-bold text-white bg-gray-800 px-2 py-1 rounded">
                    Stories for Kids
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p class="text-amber-100 text-sm font-medium"&gt;Where every story feels like a new adventure&lt;/p&gt;</code>
                  </div>
                  <div className="font-kalam text-sm font-medium text-amber-100 bg-gray-800 px-2 py-1 rounded">
                    Where every story feels like a new adventure
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
                  <div className="font-georgia-2xl">
                    Story Heading 1
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h2&gt;Story Heading 2&lt;/h2&gt;</code>
                  </div>
                  <div className="font-georgia-xl">
                    Story Heading 2
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h3&gt;Story Heading 3&lt;/h3&gt;</code>
                  </div>
                  <div className="font-georgia-lg">
                    Story Heading 3
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p&gt;Story paragraph text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-base">
                    Story paragraph text (main content)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;strong&gt;Bold text&lt;/strong&gt;</code>
                  </div>
                  <div className="font-georgia-bold">
                    Bold text
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;em&gt;Italic text&lt;/em&gt;</code>
                  </div>
                  <div className="font-georgia-italic">
                    Italic text
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;u&gt;Underlined text&lt;/u&gt;</code>
                  </div>
                  <div className="font-georgia-underline">
                    Underlined text
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;center&gt;Centered text&lt;/center&gt;</code>
                  </div>
                  <div className="font-georgia-center">
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

            {/* Font Sizes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Font Sizes (Georgia Serif for Stories)</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="font-size: 12px;"&gt;Small text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-12">
                    Small text (12px)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="font-size: 14px;"&gt;Minimum text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-14">
                    Minimum text (14px)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="font-size: 16px;"&gt;Regular text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-16">
                    Regular text (16px)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p&gt;Default story text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-base">
                    Default story text (18px)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="font-size: 20px;"&gt;Large text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-20">
                    Large text (20px)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="font-size: 24px;"&gt;Extra large text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-24">
                    Extra large text (24px)
                  </div>
                </div>
              </div>
            </div>

            {/* Font Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Font Colors (Georgia Serif for Stories)</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="color: #000000;"&gt;Black text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-base">
                    Black text (default story color)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="color: #92400e;"&gt;Amber-800 text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-amber-800">
                    Amber-800 text (warm brown)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="color: #b45309;"&gt;Amber-700 text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-amber-700">
                    Amber-700 text (personal text color)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="color: #dc2626;"&gt;Red text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-red">
                    Red text (alerts, warnings)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="color: #059669;"&gt;Green text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-green">
                    Green text (success, nature)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="color: #2563eb;"&gt;Blue text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-blue">
                    Blue text (links, info)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="color: #7c3aed;"&gt;Purple text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-purple">
                    Purple text (magical, special)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="color: #64748b;"&gt;Gray text&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-gray">
                    Gray text (muted, secondary)
                  </div>
                </div>
              </div>
            </div>

            {/* Combination Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Combination Examples</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;h2 style="color: #92400e; font-size: 24px;"&gt;Large Amber Heading&lt;/h2&gt;</code>
                  </div>
                  <div className="font-georgia-24 font-bold text-amber-800">
                    Large Amber Heading
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="color: #059669; font-size: 20px;"&gt;&lt;strong&gt;Bold Green Text&lt;/strong&gt;&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-20 font-bold text-green-600">
                    Bold Green Text
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;p style="color: #7c3aed; font-size: 16px;"&gt;&lt;em&gt;Purple Italic Text&lt;/em&gt;&lt;/p&gt;</code>
                  </div>
                  <div className="font-georgia-16 italic text-purple-600">
                    Purple Italic Text
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;center&gt;&lt;p style="color: #dc2626; font-size: 22px;"&gt;&lt;u&gt;Centered Red Underlined&lt;/u&gt;&lt;/p&gt;&lt;/center&gt;</code>
                  </div>
                  <div className="font-georgia-base text-center underline text-red-600 text-2xl">
                    Centered Red Underlined
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
                  <div className="font-georgia-base">
                    <ul><li>Bullet list item</li></ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm bg-white px-2 py-1 rounded">&lt;ol&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ol&gt;</code>
                  </div>
                  <div className="font-georgia-base">
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

            {/* Font-Family Code References */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Font-Family CSS Code References</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold mb-2 text-gray-700">Kalam Font Family (UI Elements, Headers, Buttons)</h4>
                  <code className="block text-sm bg-white p-3 rounded border font-mono">
                    font-family: 'Kalam', 'Comic Sans MS', 'Arial', sans-serif;
                  </code>
                  <p className="text-xs text-gray-600 mt-2">Used for: Site title, navigation, buttons, welcome text, all UI elements</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold mb-2 text-gray-700">Georgia Font Family (Story Content - Primary)</h4>
                  <code className="block text-sm bg-white p-3 rounded border font-mono">
                    font-family: 'Georgia', serif;
                  </code>
                  <p className="text-xs text-gray-600 mt-2">Used for: All story content, main text, paragraphs, headings in stories</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold mb-2 text-gray-700">Georgia Font Family (Extended - Fallback)</h4>
                  <code className="block text-sm bg-white p-3 rounded border font-mono">
                    font-family: 'Georgia', 'Times New Roman', serif;
                  </code>
                  <p className="text-xs text-gray-600 mt-2">Used for: Tailwind georgia class with extended fallbacks</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold mb-2 text-gray-700">Generic Serif (Special Cases)</h4>
                  <code className="block text-sm bg-white p-3 rounded border font-mono">
                    font-family: serif;
                  </code>
                  <p className="text-xs text-gray-600 mt-2">Used for: Special serif styling (Ctrl+F shortcut), system serif fallback</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold mb-2 text-gray-700">Monospace (Code Display)</h4>
                  <code className="block text-sm bg-white p-3 rounded border font-mono">
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                  </code>
                  <p className="text-xs text-gray-600 mt-2">Used for: HTML editor textarea, code blocks, system codes</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold mb-2 text-gray-700">System UI (Admin Elements)</h4>
                  <code className="block text-sm bg-white p-3 rounded border font-mono">
                    font-family: system-ui, -apple-system, sans-serif;
                  </code>
                  <p className="text-xs text-gray-600 mt-2">Used for: Admin filters, system buttons, technical UI elements</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

HTMLEditor.displayName = 'HTMLEditor';

export default HTMLEditor;