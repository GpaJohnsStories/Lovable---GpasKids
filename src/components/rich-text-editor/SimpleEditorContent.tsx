import React, { useRef, useEffect } from 'react';

interface SimpleEditorContentProps {
  content: string;
  onChange: (content: string) => void;
  placeholder: string;
  onCommandRef: React.MutableRefObject<(command: string) => void>;
}

const SimpleEditorContent: React.FC<SimpleEditorContentProps> = ({
  content,
  onChange,
  placeholder,
  onCommandRef
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
      
      // Clean up any inline font-size styles that might override our CSS, but preserve spans
      if (editorRef.current) {
        const allElements = editorRef.current.querySelectorAll('*');
        allElements.forEach(element => {
          const style = (element as HTMLElement).style;
          // Don't remove font-size from spans
          if (element.tagName !== 'SPAN' && style.fontSize) {
            style.removeProperty('font-size');
          }
          if (style.fontFamily) {
            style.removeProperty('font-family');
          }
          if (style.color) {
            style.removeProperty('color');
          }
          if (style.lineHeight) {
            style.removeProperty('line-height');
          }
        });
      }
    }
    
    // Force paragraph mode for proper spacing
    if (editorRef.current) {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    }
  }, [content]);

  const handleCommand = (command: string) => {
    if (command === 'fontSize-increase') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const selectedText = selection.toString();
        if (selectedText) {
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          span.style.fontSize = '24px';
          span.textContent = selectedText;
          range.deleteContents();
          range.insertNode(span);
          onChange(editorRef.current?.innerHTML || '');
        }
      }
    } else if (command === 'fontSize-decrease') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const selectedText = selection.toString();
        if (selectedText) {
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          span.style.fontSize = '16px';
          span.textContent = selectedText;
          range.deleteContents();
          range.insertNode(span);
          onChange(editorRef.current?.innerHTML || '');
        }
      }
    } else {
      document.execCommand(command, false);
    }
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      // Clean up any inline styles that might have been added, but preserve font-size on spans
      const allElements = editorRef.current.querySelectorAll('*');
      allElements.forEach(element => {
        const style = (element as HTMLElement).style;
        // Only remove font styling on non-span elements, preserve alignment and font-size on spans
        if (element.tagName !== 'SPAN') {
          if (style.fontSize) {
            style.removeProperty('font-size');
          }
        }
        if (style.fontFamily) {
          style.removeProperty('font-family');
        }
        if (style.color) {
          style.removeProperty('color');
        }
        if (style.lineHeight) {
          style.removeProperty('line-height');
        }
      });
      
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          handleCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          handleCommand('underline');
          break;
        case 'o':
          e.preventDefault();
          // Trigger color selector with Ctrl+O instead of Ctrl+R
          document.execCommand('foreColor', false, '#000000');
          break;
      }
    }
  };

  // Expose handleCommand to parent
  useEffect(() => {
    onCommandRef.current = handleCommand;
  }, [onCommandRef]);

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className="story-content min-h-[400px] p-4 outline-none"
      data-placeholder={placeholder}
      suppressContentEditableWarning={true}
      style={{
        background: 'white'
      }}
    />
  );
};

export default SimpleEditorContent;