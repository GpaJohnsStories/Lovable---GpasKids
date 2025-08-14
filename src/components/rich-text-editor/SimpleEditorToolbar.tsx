import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Link2
} from "lucide-react";
import InternalLinkDialog from './InternalLinkDialog';
import { insertInternalLink } from './EditorUtils';

interface SimpleEditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
}

const SimpleEditorToolbar: React.FC<SimpleEditorToolbarProps> = ({ onCommand }) => {
  const handleInternalLink = (url: string, text: string) => {
    insertInternalLink(url, text);
    // Trigger change event to update the parent component
    const event = new Event('input', { bubbles: true });
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.dispatchEvent(event);
    }
  };
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
        onClick={() => onCommand('insertUnorderedList')}
        className="h-8 w-8 p-0"
        title="Bullet List (Ctrl+L)"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('insertOrderedList')}
        className="h-8 w-8 p-0"
        title="Numbered List (Ctrl+Shift+L)"
      >
        <ListOrdered className="h-4 w-4" />
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
        title="Center (Ctrl+E)"
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

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('insertHTML', '—')}
        className="h-8 w-8 p-0 font-bold text-lg"
        title="Insert M-dash (long pause for audio)"
      >
        —
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onCommand('insertHTML', '–')}
        className="h-8 w-8 p-0 font-bold text-lg"
        title="Insert N-dash (short pause for audio)"
      >
        –
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Internal Link Button */}
      <InternalLinkDialog onInsertLink={handleInternalLink}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Insert Internal Link"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </InternalLinkDialog>
    </div>
  );
};

export default SimpleEditorToolbar;