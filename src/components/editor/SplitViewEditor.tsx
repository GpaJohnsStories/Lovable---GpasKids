import React, { useState, useRef } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import StickyToolbar from './StickyToolbar';
import HTMLEditor from './HTMLEditor';
import IsolatedStoryRenderer from '@/components/story/IsolatedStoryRenderer';
import StoryContentScrollToTop from '@/components/StoryContentScrollToTop';

interface SplitViewEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onSave?: () => void;
  category?: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "STORY";
}

const SplitViewEditor: React.FC<SplitViewEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your story...",
  onSave,
  category
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const storyContentRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white relative">
      <StickyToolbar 
        onFormat={handleFormat}
        onInsertList={handleInsertList}
        onAlign={handleAlign}
        onClearHtml={handleClearHtml}
        onClearAll={handleClearAll}
        onInsertText={insertTextAtCursor}
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
              />
            </div>
            <StoryContentScrollToTop scrollContainerRef={storyContentRef} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SplitViewEditor;