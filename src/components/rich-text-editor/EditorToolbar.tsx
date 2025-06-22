
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Heading3
} from "lucide-react";

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onInsertLink: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand, onInsertLink }) => {
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
    { value: 'Georgia', label: 'Georgia (Default)' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' }
  ];

  const handleFontChange = (value: string) => {
    onCommand('fontName', value);
    // Reapply default font size after font change
    setTimeout(() => onCommand('fontSize', '4'), 10);
  };

  const handleFontSizeChange = (value: string) => {
    onCommand('fontSize', value);
  };

  return (
    <div className="flex items-center gap-1 p-3 bg-gray-50 border-b border-gray-200 flex-wrap">
      {/* Font Family */}
      <Select defaultValue="Georgia" onValueChange={handleFontChange}>
        <SelectTrigger className="w-36 h-8">
          <SelectValue placeholder="Georgia" />
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
      <Select defaultValue="4" onValueChange={handleFontSizeChange}>
        <SelectTrigger className="w-24 h-8">
          <SelectValue placeholder="Medium" />
        </SelectTrigger>
        <SelectContent>
          {fontSizes.map(size => (
            <SelectItem key={size.value} value={size.value}>
              {size.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text formatting */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('bold')}
        className="h-8 w-8 p-0"
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('italic')}
        className="h-8 w-8 p-0"
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('underline')}
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
        onClick={() => onCommand('formatBlock', 'h1')}
        className="h-8 w-8 p-0"
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('formatBlock', 'h2')}
        className="h-8 w-8 p-0"
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('formatBlock', 'h3')}
        className="h-8 w-8 p-0"
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('formatBlock', 'p')}
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
        onClick={() => onCommand('justifyLeft')}
        className="h-8 w-8 p-0"
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('justifyCenter')}
        className="h-8 w-8 p-0"
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('justifyRight')}
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
        onClick={() => onCommand('insertUnorderedList')}
        className="h-8 w-8 p-0"
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('insertOrderedList')}
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
        onClick={onInsertLink}
        className="h-8 w-8 p-0"
        title="Insert Link (Ctrl+K)"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditorToolbar;
