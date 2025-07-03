import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Trash2 } from "lucide-react";

interface StickyToolbarProps {
  onFormat: (tag: string) => void;
  onInsertList: (ordered: boolean) => void;
  onAlign: (alignment: string) => void;
  onClearHtml: () => void;
}

const StickyToolbar: React.FC<StickyToolbarProps> = ({ onFormat, onInsertList, onAlign, onClearHtml }) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 shadow-sm">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('strong')}
            className="h-8 px-2"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('em')}
            className="h-8 px-2"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('u')}
            className="h-8 px-2"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Alignment */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAlign('left')}
            className="h-8 px-2"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAlign('center')}
            className="h-8 px-2"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAlign('right')}
            className="h-8 px-2"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertList(false)}
            className="h-8 px-2"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertList(true)}
            className="h-8 px-2"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Quick Tags */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('h3')}
            className="h-8 px-3 text-sm"
          >
            H3
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFormat('p')}
            className="h-8 px-3 text-sm"
          >
            P
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Clear HTML */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClearHtml}
          className="h-8 px-2"
          title="Clear HTML from selection"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StickyToolbar;