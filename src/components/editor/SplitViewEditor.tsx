import React, { useState, useRef } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StickyToolbar from './StickyToolbar';
import HTMLEditor from './HTMLEditor';
import IsolatedStoryRenderer from '@/components/story/IsolatedStoryRenderer';
import StoryContentScrollToTop from '@/components/StoryContentScrollToTop';

interface SplitViewEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onSave?: () => void;
  category?: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText" | "STORY";
  fontSize?: number;
  onFontSizeChange?: (fontSize: number) => void;
}

const SplitViewEditor: React.FC<SplitViewEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your story...",
  onSave,
  category,
  fontSize = 16,
  onFontSizeChange
}) => {
  console.log('🎯 SplitViewEditor: Rendering with content:', {
    content: content ? `"${content.substring(0, 100)}..."` : 'undefined/empty',
    contentLength: content?.length || 0,
    category
  });
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const storyContentRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  const insertTextAtCursor = (text: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    onChange(newContent);

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const wrapSelectedText = (openTag: string, closeTag: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText) {
      const wrappedText = `${openTag}${selectedText}${closeTag}`;
      const newContent = content.substring(0, start) + wrappedText + content.substring(end);
      onChange(newContent);
      
      // Set cursor position after the wrapped text
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + wrappedText.length;
        textarea.focus();
      }, 0);
    } else {
      // No selection, just insert the tags
      insertTextAtCursor(`${openTag}${closeTag}`);
      // Position cursor between tags
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + openTag.length;
        textarea.focus();
      }, 0);
    }
  };

  const handleFormat = (tag: string) => {
    switch (tag) {
      case 'strong':
        wrapSelectedText('<strong>', '</strong>');
        break;
      case 'em':
        wrapSelectedText('<em>', '</em>');
        break;
      case 'u':
        wrapSelectedText('<u>', '</u>');
        break;
      case 'big':
        wrapSelectedText('<p style="font-size: 32px; font-weight: bold; margin: 16px 0;">', '</p>');
        break;
      case 'med':
        wrapSelectedText('<p style="font-size: 24px; font-weight: bold; margin: 12px 0;">', '</p>');
        break;
      case 'large':
        wrapSelectedText('<p style="font-size: 20px; font-weight: bold; margin: 8px 0;">', '</p>');
        break;
      case 'p':
        wrapSelectedText('<p>', '</p>');
        break;
    }
  };

  const handleInsertList = (ordered: boolean) => {
    const listTag = ordered ? 'ol' : 'ul';
    const listHTML = `<${listTag}>\n  <li></li>\n  <li></li>\n</${listTag}>`;
    insertTextAtCursor(listHTML);
  };

  const handleAlign = (alignment: string) => {
    if (alignment === 'center') {
      wrapSelectedText('<center>', '</center>');
    } else if (alignment === 'left') {
      // Remove any existing alignment by just wrapping in <p>
      wrapSelectedText('<p>', '</p>');
    } else if (alignment === 'right') {
      wrapSelectedText('<p style="text-align: right;">', '</p>');
    }
  };

  const handleClearHtml = () => {
    const textarea = editorRef.current;
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

  const handleClearAll = () => {
    onChange('');
    setTimeout(() => {
      const textarea = editorRef.current;
      if (textarea) {
        textarea.focus();
      }
    }, 0);
  };

  const handleFontChange = (font: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText) {
      // Remove any existing font-family spans from the selected text to prevent nesting
      const cleanText = selectedText.replace(/<span[^>]*style="[^"]*font-family[^"]*"[^>]*>(.*?)<\/span>/gi, '$1');
      const fontTag = `<span style="font-family: ${font}">${cleanText}</span>`;
      const newContent = content.substring(0, start) + fontTag + content.substring(end);
      onChange(newContent);
      
      // Set cursor position after the formatted text
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + fontTag.length;
        textarea.focus();
      }, 0);
    }
  };

  const handleFontSizeChange = (size: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText) {
      // Map font sizes to pixel values
      const sizeMap: { [key: string]: string } = {
        '1': '12px',
        '2': '14px', 
        '3': '16px',
        '4': '18px',
        '5': '20px',
        '6': '24px',
        '7': '28px'
      };
      
      const pixelSize = sizeMap[size] || '16px';
      const sizeTag = `<span style="font-size: ${pixelSize}">${selectedText}</span>`;
      const newContent = content.substring(0, start) + sizeTag + content.substring(end);
      onChange(newContent);
      
      // Set cursor position after the formatted text
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + sizeTag.length;
        textarea.focus();
      }, 0);
    }
  };

  const handleInsertLink = (url: string, text: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const linkTag = `<a href="${url}">${text}</a>`;
    const newContent = content.substring(0, start) + linkTag + content.substring(start);
    onChange(newContent);
    
    // Set cursor position after the link
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + linkTag.length;
      textarea.focus();
    }, 0);
  };

  const handleShowHelp = () => {
    setShowHelp(true);
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
    { key: 'Ctrl + 1', action: 'Big Heading' },
    { key: 'Ctrl + 2', action: 'Medium Heading' },
    { key: 'Ctrl + 3', action: 'Large Text' }
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white relative">
        <StickyToolbar
          onFormat={handleFormat}
          onInsertList={handleInsertList}
          onAlign={handleAlign}
          onClearHtml={handleClearHtml}
          onClearAll={handleClearAll}
          onInsertText={insertTextAtCursor}
          onFontChange={handleFontChange}
          onFontSizeChange={handleFontSizeChange}
          onInsertLink={handleInsertLink}
          onShowHelp={handleShowHelp}
        />
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
        <ResizablePanel defaultSize={50} minSize={30}>
          <HTMLEditor
            ref={editorRef}
            content={content}
            onChange={onChange}
            placeholder={placeholder}
            onSave={onSave}
            category={category}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col relative">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Live Preview</span>
            </div>
            <div 
              ref={storyContentRef}
              className="flex-1 p-4 overflow-auto bg-white"
            >
              <IsolatedStoryRenderer
                content={content}
                useRichCleaning={true}
                category={category}
                fontSize={fontSize}
                onFontSizeChange={onFontSizeChange}
              />
            </div>
            <StoryContentScrollToTop scrollContainerRef={storyContentRef} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Help Dialog */}
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
    </div>
  );
};

export default SplitViewEditor;