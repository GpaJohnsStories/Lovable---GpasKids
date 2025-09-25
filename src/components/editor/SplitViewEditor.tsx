import React, { useState, useRef } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  previewContent?: string | null;
}

const SplitViewEditor: React.FC<SplitViewEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your story...",
  onSave,
  category,
  fontSize = 21,
  onFontSizeChange,
  previewContent = null
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

  const handleInsertHorizontalLine = () => {
    insertTextAtCursor('<hr class="rule" />');
  };

  const handleInsertPageBreak = () => {
    insertTextAtCursor('<div class="page-break"></div>');
  };

  const handleWrapKeepTogether = () => {
    wrapSelectedText('<div class="avoid-break">', '</div>');
  };

  const handleInsertFontSize = (fontType: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let fontSize, lineHeight, margin, fontWeight;
    
    switch (fontType) {
      case 'footer':
        fontSize = '19px';
        lineHeight = '19px';
        margin = '8px 0';
        fontWeight = 'normal';
        break;
      case 'body':
        fontSize = '21px';
        lineHeight = '21px';
        margin = '10px 0';
        fontWeight = 'normal';
        break;
      case 'h3':
        fontSize = '24px';
        lineHeight = '24px';
        margin = '12px 0';
        fontWeight = 'bold';
        break;
      case 'h2':
        fontSize = '30px';
        lineHeight = '30px';
        margin = '16px 0';
        fontWeight = 'bold';
        break;
      case 'h1':
        fontSize = '40px';
        lineHeight = '40px';
        margin = '20px 0';
        fontWeight = 'bold';
        break;
      default:
        return;
    }

    const styleTag = `<span style="font-size: ${fontSize}; line-height: ${lineHeight}; margin: ${margin}; font-weight: ${fontWeight}; display: inline-block;">${selectedText || 'Text here'}</span>`;
    const newContent = content.substring(0, start) + styleTag + content.substring(end);
    onChange(newContent);
    
    // Set cursor position after the formatted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + styleTag.length;
      textarea.focus();
    }, 0);
  };


  const handleInsertIconTokens = () => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const iconTokensText = `{{ICO-HOM}}{{/ICO-HOM}}
{{ICO-N2K}}{{/ICO-N2K}}
{{ICO-STO}}{{/ICO-STO}}
{{ICO-LIB}}{{/ICO-LIB}}
{{ICO-WRI}}{{/ICO-WRI}}
{{ICO-ABT}}{{/ICO-ABT}}
{{ICO-CLB}}{{/ICO-CLB}}

`;

    insertTextAtCursor(iconTokensText);
  };


  const handleSelectAllPreview = () => {
    const previewPane = storyContentRef.current;
    if (!previewPane) return;

    // Create a selection range for all content in the preview pane
    const selection = window.getSelection();
    const range = document.createRange();
    
    try {
      range.selectNodeContents(previewPane);
      selection?.removeAllRanges();
      selection?.addRange(range);
    } catch (error) {
      console.warn('Could not select preview content:', error);
    }
  };

  const handleInsertSignature = () => {
    const signatureHtml = `<span style="font-family: 'Gloria Hallelujah', cursive; color: #0B3D91; font-size: 28px; font-weight: bold; font-style: italic;">Grandpa John</span>`;
    insertTextAtCursor(signatureHtml);
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
    { key: 'Ctrl + V', action: 'Paste' },
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
          onInsertHorizontalLine={handleInsertHorizontalLine}
          onInsertPageBreak={handleInsertPageBreak}
          onWrapKeepTogether={handleWrapKeepTogether}
          onInsertFontSize={handleInsertFontSize}
          onSelectAllPreview={handleSelectAllPreview}
          onInsertIconTokens={handleInsertIconTokens}
          category={category}
        />
      
      {/* Screen Size Indicator Line - Desktop Only */}
      <div className="hidden xl:block w-full h-3 bg-gray-100 border-t border-gray-200 relative">
        {/* Horizontal line */}
        <div className="absolute top-1/2 w-full h-px bg-gray-400 transform -translate-y-1/2"></div>
        {/* Mobile mark (~480px equivalent at ~40% from left) */}
        <div className="absolute top-0 h-full w-px bg-gray-600" style={{ left: '40%' }}></div>
        {/* Tablet mark (~768px equivalent at ~65% from left) */}
        <div className="absolute top-0 h-full w-px bg-gray-600" style={{ left: '65%' }}></div>
      </div>
      
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
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center">
              <span className="text-[21px] font-bold text-[#228B22]">Live Preview</span>
              <div className="flex-1 flex justify-center">
                <Button 
                  type="button" 
                  onClick={handleSelectAllPreview} 
                  className="h-8 w-48 px-4 text-sm font-bold text-white hover:opacity-80 transition-opacity rounded-md" 
                  style={{ backgroundColor: '#16a34a' }}
                >
                  Select all LIVE Preview
                </Button>
              </div>
            </div>
            <div 
              ref={storyContentRef}
              className="supertext-preview flex-1 p-4 overflow-auto bg-white"
            >
              <IsolatedStoryRenderer
                content={previewContent !== null ? previewContent : content}
                useRichCleaning={true}
                category={category}
                fontSize={fontSize}
                onFontSizeChange={onFontSizeChange}
                enableProportionalSizing={true}
              />
            </div>
            <StoryContentScrollToTop scrollContainerRef={storyContentRef} targetSelector="#format-menu" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Signature Button */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <Button
          type="button"
          onClick={handleInsertSignature}
          variant="signature"
          className="h-12 px-6 text-[21px] font-bold text-white rounded-md"
        >
          Insert Gpa's Signature
        </Button>
      </div>

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