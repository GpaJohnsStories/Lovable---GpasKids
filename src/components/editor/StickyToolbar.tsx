import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Trash2, X } from "lucide-react";

interface StickyToolbarProps {
  onFormat: (tag: string) => void;
  onInsertList: (ordered: boolean) => void;
  onAlign: (alignment: string) => void;
  onClearHtml: () => void;
  onClearAll: () => void;
  onInsertText: (text: string) => void;
}

const StickyToolbar: React.FC<StickyToolbarProps> = ({ onFormat, onInsertList, onAlign, onClearHtml, onClearAll, onInsertText }) => {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 p-3 shadow-sm" style={{ backgroundColor: '#16a34a' }}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('strong')}
            className="h-8 px-2"
            style={{ borderColor: '#9c441a' }}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('em')}
            className="h-8 px-2"
            style={{ borderColor: '#9c441a' }}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('u')}
            className="h-8 px-2"
            style={{ borderColor: '#9c441a' }}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />

        {/* Text Alignment */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAlign('left')}
            className="h-8 px-2"
            style={{ borderColor: '#9c441a' }}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAlign('center')}
            className="h-8 px-2"
            style={{ borderColor: '#9c441a' }}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAlign('right')}
            className="h-8 px-2"
            style={{ borderColor: '#9c441a' }}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertList(false)}
            className="h-8 px-2"
            style={{ borderColor: '#9c441a' }}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertList(true)}
            className="h-8 px-2"
            style={{ borderColor: '#9c441a' }}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />

        {/* Quick Tags */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('big')}
            className="h-8 px-3 text-sm"
            style={{ borderColor: '#9c441a' }}
          >
            Big
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('med')}
            className="h-8 px-3 text-sm"
            style={{ borderColor: '#9c441a' }}
          >
            Med
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('large')}
            className="h-8 px-3 text-sm"
            style={{ borderColor: '#9c441a' }}
          >
            Large
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('p')}
            className="h-8 px-3 text-sm"
            style={{ borderColor: '#9c441a' }}
          >
            P
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />

        {/* Dash buttons for audio pauses */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertText('–')}
            className="h-8 px-3 text-sm font-bold"
            style={{ borderColor: '#9c441a' }}
            title="Insert N-dash (short pause for audio)"
          >
            –
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertText('—')}
            className="h-8 px-3 text-sm font-bold"
            style={{ borderColor: '#9c441a' }}
            title="Insert M-dash (long pause for audio)"
          >
            —
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" style={{ backgroundColor: '#9c441a' }} />
        
        {/* Clear buttons */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            onClick={onClearHtml}
            className="h-8 px-2 text-black border-0 hover:opacity-90"
            style={{ backgroundColor: '#F2BA15' }}
            title="Clear HTML from selection"
          >
            <span className="text-sm font-bold">&lt;X&gt;</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2 text-white border-0 hover:opacity-90"
            style={{ backgroundColor: '#DC2626' }}
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