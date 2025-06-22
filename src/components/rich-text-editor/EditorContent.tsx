
import React, { useRef, useEffect } from 'react';
import { applyDefaultStyles, handleKeyboardShortcuts, normalizeContent } from './EditorUtils';

interface EditorContentProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onCommand: (command: string, value?: string) => void;
}

const EditorContent: React.FC<EditorContentProps> = ({
  content,
  onChange,
  placeholder = "Start writing your story...",
  onCommand
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      if (content && editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
        normalizeContent(editorRef.current);
      } else if (!content) {
        applyDefaultStyles(editorRef.current);
      }
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      normalizeContent(editorRef.current);
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFocus = () => {
    if (editorRef.current) {
      applyDefaultStyles(editorRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyboardShortcuts(e, onCommand);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    
    setTimeout(() => {
      if (editorRef.current) {
        normalizeContent(editorRef.current);
        onChange(editorRef.current.innerHTML);
      }
    }, 0);
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className="rich-editor min-h-[400px] p-4 focus:outline-none"
      style={{ 
        whiteSpace: 'pre-wrap',
        fontFamily: 'Georgia, serif',
        fontSize: '18px',
        color: '#000000',
        lineHeight: '1.15',
        fontWeight: 'normal',
        fontStyle: 'normal'
      }}
      data-placeholder={placeholder}
      suppressContentEditableWarning={true}
    />
  );
};

export default EditorContent;
