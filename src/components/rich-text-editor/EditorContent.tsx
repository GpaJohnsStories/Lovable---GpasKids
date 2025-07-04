
import React, { useRef, useEffect } from 'react';
import { applyDefaultStyles, handleKeyboardShortcuts, normalizeContent, handleEnterKey } from './EditorUtils';

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
    
    // Custom dash shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'n') {
        e.preventDefault();
        document.execCommand('insertHTML', false, '–');
        setTimeout(() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }, 0);
        return;
      }
      if (e.key === 'm') {
        e.preventDefault();
        document.execCommand('insertHTML', false, '—');
        setTimeout(() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }, 0);
        return;
      }
      if (e.key === '#') {
        e.preventDefault();
        document.execCommand('insertOrderedList', false);
        setTimeout(() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }, 0);
        return;
      }
    }
    
    // Handle Enter key for proper line breaks
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter creates a line break
        e.preventDefault();
        document.execCommand('insertHTML', false, '<br>');
        setTimeout(() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }, 0);
      }
      // Regular Enter creates a new paragraph (browser default)
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    // Preserve line breaks when pasting
    const htmlText = text.replace(/\n/g, '<br>');
    document.execCommand('insertHTML', false, htmlText);
    
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
        whiteSpace: 'pre-line',
        fontFamily: 'Georgia, serif',
        fontSize: '18px',
        color: '#000000',
        lineHeight: '1.6',
        fontWeight: 'normal',
        fontStyle: 'normal'
      }}
      data-placeholder={placeholder}
      suppressContentEditableWarning={true}
    />
  );
};

export default EditorContent;
