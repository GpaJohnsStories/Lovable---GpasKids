import React, { useState, useRef } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import StickyToolbar from './StickyToolbar';
import HTMLEditor from './HTMLEditor';
import IsolatedStoryRenderer from '@/components/story/IsolatedStoryRenderer';

interface SplitViewEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const SplitViewEditor: React.FC<SplitViewEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your story..." 
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);

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
      case 'h3':
        wrapSelectedText('<h3>', '</h3>');
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

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <StickyToolbar 
        onFormat={handleFormat}
        onInsertList={handleInsertList}
        onAlign={handleAlign}
        onClearHtml={handleClearHtml}
        onInsertText={insertTextAtCursor}
      />
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
        <ResizablePanel defaultSize={50} minSize={30}>
          <HTMLEditor
            ref={editorRef}
            content={content}
            onChange={onChange}
            placeholder={placeholder}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Live Preview</span>
            </div>
            <div className="flex-1 p-4 overflow-auto bg-white">
              <IsolatedStoryRenderer
                content={content}
                useRichCleaning={true}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SplitViewEditor;