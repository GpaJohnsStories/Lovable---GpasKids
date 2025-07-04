import React, { useRef, useEffect } from 'react';

interface SimpleEditorContentProps {
  content: string;
  onChange: (content: string) => void;
  placeholder: string;
  onCommandRef: React.MutableRefObject<(command: string, value?: string) => void>;
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

  const handleCommand = (command: string, value?: string) => {
    if (command === 'insertHTML' && value) {
      document.execCommand('insertHTML', false, value);
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