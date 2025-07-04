
import React, { useRef, useEffect } from 'react';
import SimpleEditorToolbar from '@/components/rich-text-editor/SimpleEditorToolbar';
import SimpleEditorStyles from '@/components/rich-text-editor/SimpleEditorStyles';
import SimpleEditorContent from '@/components/rich-text-editor/SimpleEditorContent';

interface SimpleRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const SimpleRichTextEditor: React.FC<SimpleRichTextEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your story..." 
}) => {
  const commandRef = useRef<(command: string) => void>(() => {});

  const handleCommand = (command: string) => {
    commandRef.current(command);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <SimpleEditorStyles />
      <SimpleEditorToolbar onCommand={handleCommand} />
      <SimpleEditorContent
        content={content}
        onChange={onChange}
        placeholder={placeholder}
        onCommandRef={commandRef}
      />
    </div>
  );
};

export default SimpleRichTextEditor;
