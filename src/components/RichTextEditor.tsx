
import React, { useRef } from 'react';
import EditorToolbar from './rich-text-editor/EditorToolbar';
import EditorContent from './rich-text-editor/EditorContent';
import EditorStyles from './rich-text-editor/EditorStyles';
import { execCommand, insertLink } from './rich-text-editor/EditorUtils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your story..." 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleCommand = (command: string, value?: string) => {
    execCommand(command, value);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInsertLink = () => {
    const url = insertLink();
    if (url && editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <EditorStyles />
      
      <EditorToolbar
        onCommand={handleCommand}
        onInsertLink={handleInsertLink}
      />
      
      <EditorContent
        content={content}
        onChange={onChange}
        placeholder={placeholder}
        onCommand={handleCommand}
      />
    </div>
  );
};

export default RichTextEditor;
