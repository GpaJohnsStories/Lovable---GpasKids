import React from 'react';
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

interface SimpleEditorToolbarProps {
  onCommand: (command: string) => void;
}

const SimpleEditorToolbar: React.FC<SimpleEditorToolbarProps> = ({ onCommand }) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
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
        title="Center"
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
    </div>
  );
};

export default SimpleEditorToolbar;