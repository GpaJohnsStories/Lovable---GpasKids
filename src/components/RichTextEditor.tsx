import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Link,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Palette
} from "lucide-react";

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
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      if (content && editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
      } else if (!content) {
        // Apply default styles for new stories
        applyDefaultStyles();
      }
    }
  }, [content]);

  const applyDefaultStyles = () => {
    if (editorRef.current) {
      // Set default font family, size, and color
      editorRef.current.style.fontFamily = 'Georgia, serif';
      editorRef.current.style.fontSize = '16px'; // Medium size
      editorRef.current.style.color = '#000000'; // Black
      editorRef.current.focus();
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFocus = () => {
    if (editorRef.current && !content) {
      // Ensure default styles are applied when focusing on empty editor
      applyDefaultStyles();
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleFontSize = (size: string) => {
    execCommand('fontSize', size);
  };

  const handleFontFamily = (fontFamily: string) => {
    execCommand('fontName', fontFamily);
  };

  const handleFontColor = (color: string) => {
    execCommand('foreColor', color);
    setColorPopoverOpen(false); // Close the popover after selecting a color
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle common shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          insertLink();
          break;
      }
    }
  };

  const fontSizes = [
    { value: '1', label: 'Very Small' },
    { value: '2', label: 'Small' },
    { value: '3', label: 'Normal' },
    { value: '4', label: 'Medium' },
    { value: '5', label: 'Large' },
    { value: '6', label: 'Very Large' },
    { value: '7', label: 'Huge' }
  ];

  const fontFamilies = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' }
  ];

  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6666', '#FF9999', '#FFCCCC',
    '#00FF00', '#66FF66', '#99FF99', '#CCFFCC',
    '#0000FF', '#6666FF', '#9999FF', '#CCCCFF',
    '#FFFF00', '#FFFF66', '#FFFF99', '#FFFFCC',
    '#FF00FF', '#FF66FF', '#FF99FF', '#FFCCFF',
    '#00FFFF', '#66FFFF', '#99FFFF', '#CCFFFF',
    '#FFA500', '#FFB366', '#FFC999', '#FFDCCC'
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <style dangerouslySetInnerHTML={{
        __html: `
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            font-style: italic;
          }
          .rich-editor {
            font-family: Georgia, serif;
            font-size: 16px;
            color: #000000;
          }
          .rich-editor h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 0.67em 0;
          }
          .rich-editor h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.75em 0;
          }
          .rich-editor h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin: 0.83em 0;
          }
          .rich-editor ul {
            list-style-type: disc;
            margin: 1em 0;
            padding-left: 2em;
          }
          .rich-editor ol {
            list-style-type: decimal;
            margin: 1em 0;
            padding-left: 2em;
          }
          .rich-editor li {
            margin: 0.25em 0;
          }
          .rich-editor a {
            color: #3b82f6;
            text-decoration: underline;
          }
          .rich-editor p {
            margin: 1em 0;
          }
          .color-palette {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 4px;
            padding: 8px;
          }
          .color-option {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            border: 2px solid transparent;
          }
          .color-option:hover {
            border-color: #374151;
          }
        `
      }} />
      
      <div className="flex items-center gap-1 p-3 bg-gray-50 border-b border-gray-200 flex-wrap">
        {/* Font Family */}
        <Select onValueChange={handleFontFamily}>
          <SelectTrigger className="w-32 h-8">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map(font => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value }}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Font Size */}
        <Select onValueChange={handleFontSize}>
          <SelectTrigger className="w-24 h-8">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map(size => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Font Color */}
        <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Text Color"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="color-palette">
              {colors.map(color => (
                <div
                  key={color}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => handleFontColor(color)}
                  title={color}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline')}
          className="h-8 w-8 p-0"
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'h1')}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'h2')}
          className="h-8 w-8 p-0"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'h3')}
          className="h-8 w-8 p-0"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'p')}
          className="h-8 w-8 p-0"
          title="Normal Text"
        >
          <Type className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text alignment */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyLeft')}
          className="h-8 w-8 p-0"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyCenter')}
          className="h-8 w-8 p-0"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyRight')}
          className="h-8 w-8 p-0"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertOrderedList')}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Links */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className="h-8 w-8 p-0"
          title="Insert Link (Ctrl+K)"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>
      
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
    </div>
  );
};

export default RichTextEditor;
