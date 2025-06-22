
import React, { useRef, useEffect } from 'react';
import { applyDefaultStyles, handleKeyboardShortcuts } from './EditorUtils';

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
      } else if (!content) {
        applyDefaultStyles(editorRef.current);
      }
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFocus = () => {
    if (editorRef.current && !content) {
      applyDefaultStyles(editorRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyboardShortcuts(e, onCommand);
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      className="rich-editor min-h-[400px] p-4 leading-relaxed focus:outline-none"
      style={{ whiteSpace: 'pre-wrap' }}
      data-placeholder={placeholder}
      suppressContentEditableWarning={true}
    />
  );
};

export default EditorContent;
