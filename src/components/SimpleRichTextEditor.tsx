
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight
} from "lucide-react";

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
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
    
    // Force paragraph mode for proper spacing
    if (editorRef.current) {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    }
  }, [content]);

  const handleCommand = (command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
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

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <style dangerouslySetInnerHTML={{
        __html: `
          .story-content[contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            font-style: italic;
          }
          
          /* Force the admin editor to match public story page styling exactly */
          .story-content[contenteditable] {
            font-family: 'Georgia', serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
            font-weight: normal !important;
            font-style: normal !important;
          }
          
          .story-content[contenteditable] * {
            font-family: 'Georgia', serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content[contenteditable] p {
            font-family: 'Georgia', serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
            font-weight: normal !important;
            font-style: normal !important;
            margin: 0 0 1.5em 0 !important;
            min-height: 1.6em !important;
          }
          
          .story-content[contenteditable] div {
            font-family: 'Georgia', serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
            margin: 0 0 1.5em 0 !important;
            min-height: 1.6em !important;
          }
          
          /* Preserve text alignment styles */
          .story-content[contenteditable] p[style*="text-align"],
          .story-content[contenteditable] div[style*="text-align"] {
            /* Keep alignment but force other styles */
            font-family: 'Georgia', serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          /* Force heading styles to match */
          .story-content[contenteditable] h1 {
            font-size: 2em !important;
            font-weight: bold !important;
            margin: 0 0 1.5em 0 !important;
            font-family: 'Georgia', serif !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content[contenteditable] h2 {
            font-size: 1.5em !important;
            font-weight: bold !important;
            margin: 0 0 1.5em 0 !important;
            font-family: 'Georgia', serif !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content[contenteditable] h3 {
            font-size: 1.17em !important;
            font-weight: bold !important;
            margin: 0 0 1.5em 0 !important;
            font-family: 'Georgia', serif !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content[contenteditable] strong,
          .story-content[contenteditable] b {
            font-weight: bold !important;
            font-family: 'Georgia', serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content[contenteditable] em,
          .story-content[contenteditable] i {
            font-style: italic !important;
            font-family: 'Georgia', serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content[contenteditable] u {
            text-decoration: underline !important;
            font-family: 'Georgia', serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
        `
      }} />
      
      {/* Simple Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleCommand('bold')}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleCommand('italic')}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleCommand('underline')}
          className="h-8 w-8 p-0"
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleCommand('justifyLeft')}
          className="h-8 w-8 p-0"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleCommand('justifyCenter')}
          className="h-8 w-8 p-0"
          title="Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleCommand('justifyRight')}
          className="h-8 w-8 p-0"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Simple Editor */}
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
    </div>
  );
};

export default SimpleRichTextEditor;
