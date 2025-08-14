import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Trash2, Link2 } from "lucide-react";
import InternalLinkDialog from "@/components/rich-text-editor/InternalLinkDialog";

interface StickyToolbarProps {
  onFormat: (tag: string) => void;
  onInsertList: (ordered: boolean) => void;
  onAlign: (alignment: string) => void;
  onClearHtml: () => void;
  onClearAll: () => void;
  onInsertText: (text: string) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  onInsertLink: (url: string, text: string) => void;
}

const StickyToolbar: React.FC<StickyToolbarProps> = ({ onFormat, onInsertList, onAlign, onClearHtml, onClearAll, onInsertText, onFontChange, onFontSizeChange, onInsertLink }) => {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 p-3 shadow-sm" style={{ backgroundColor: '#16a34a' }}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Font Controls */}
        <div className="flex items-center gap-1">
          <Select onValueChange={onFontChange}>
            <SelectTrigger className="h-8 w-36 text-sm btn-toolbar-slate">
              <SelectValue placeholder="Font Family" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</SelectItem>
              <SelectItem value="Arial" style={{ fontFamily: 'Arial' }}>Arial</SelectItem>
              <SelectItem value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</SelectItem>
              <SelectItem value="Helvetica" style={{ fontFamily: 'Helvetica' }}>Helvetica</SelectItem>
              <SelectItem value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</SelectItem>
              <SelectItem value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</SelectItem>
              <SelectItem value="Impact" style={{ fontFamily: 'Impact' }}>Impact</SelectItem>
              <SelectItem value="Comic Sans MS" style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans MS</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={onFontSizeChange}>
            <SelectTrigger className="h-8 w-28 text-sm btn-toolbar-slate">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="1">Very Small</SelectItem>
              <SelectItem value="2">Small</SelectItem>
              <SelectItem value="3">Medium</SelectItem>
              <SelectItem value="4">Large</SelectItem>
              <SelectItem value="5">Very Large</SelectItem>
              <SelectItem value="6">Extra Large</SelectItem>
              <SelectItem value="7">Huge</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            onClick={() => onFormat('strong')}
            className="h-8 px-2 btn-toolbar-orange"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onFormat('em')}
            className="h-8 px-2 btn-toolbar-orange"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onFormat('u')}
            className="h-8 px-2 btn-toolbar-orange"
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          {/* Dash buttons moved here for better accessibility */}
          <Button
            type="button"
            size="sm"
            onClick={() => onInsertText('–')}
            className="h-8 px-3 text-sm font-bold btn-toolbar-orange"
            title="Insert N-dash (short pause for audio)"
          >
            –
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onInsertText('—')}
            className="h-8 px-3 text-sm font-bold btn-toolbar-orange"
            title="Insert M-dash (long pause for audio)"
          >
            —
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />

        {/* Text Alignment */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            onClick={() => onAlign('left')}
            className="h-8 px-2 btn-toolbar-blue"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onAlign('center')}
            className="h-8 px-2 btn-toolbar-blue"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onAlign('right')}
            className="h-8 px-2 btn-toolbar-blue"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            onClick={() => onInsertList(false)}
            className="h-8 px-2 btn-toolbar-purple"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onInsertList(true)}
            className="h-8 px-2 btn-toolbar-purple"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />

        {/* Quick Tags */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            onClick={() => onFormat('big')}
            className="h-8 px-3 text-sm btn-toolbar-indigo"
          >
            Big
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onFormat('med')}
            className="h-8 px-3 text-sm btn-toolbar-indigo"
          >
            Med
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onFormat('large')}
            className="h-8 px-3 text-sm btn-toolbar-indigo"
          >
            Large
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onFormat('p')}
            className="h-8 px-3 text-sm btn-toolbar-indigo"
          >
            P
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />

        {/* Internal Link */}
        <div className="flex items-center gap-1">
          <InternalLinkDialog onInsertLink={onInsertLink}>
            <Button
              type="button"
              size="sm"
              className="h-8 px-2 btn-toolbar-green"
              title="Insert internal link"
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </InternalLinkDialog>
        </div>


        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />
        
        {/* Clear buttons */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            onClick={onClearHtml}
            className="h-8 px-2 btn-toolbar-yellow"
            title="Clear HTML from selection"
          >
            <span className="text-sm font-bold">&lt;X&gt;</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2 btn-toolbar-red"
            title="Clear all content"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyToolbar;