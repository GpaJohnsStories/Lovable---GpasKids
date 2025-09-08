import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Trash2, Link2, Key, Minus, FileText, Package, FileCode } from "lucide-react";
import InternalLinkDialog from "@/components/rich-text-editor/InternalLinkDialog";
import { useTooltipContext } from "@/contexts/TooltipContext";

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
  onShowHelp: () => void;
  onInsertHorizontalLine: () => void;
  onInsertPageBreak: () => void;
  onWrapKeepTogether: () => void;
  onInsertFontSize: (fontType: string) => void;
  onSelectAllPreview: () => void;
  onInsertIconTokens: () => void;
  category?: string;
}

const StickyToolbar: React.FC<StickyToolbarProps> = ({
  onFormat,
  onInsertList,
  onAlign,
  onClearHtml,
  onClearAll,
  onInsertText,
  onFontChange,
  onFontSizeChange,
  onInsertLink,
  onShowHelp,
  onInsertHorizontalLine,
  onInsertPageBreak,
  onWrapKeepTogether,
  onInsertFontSize,
  onSelectAllPreview,
  onInsertIconTokens,
  category
}) => {
  const { shouldShowTooltips } = useTooltipContext();

  // Only render tooltips if they should be shown
  const ConditionalTooltip: React.FC<{ children: React.ReactNode; content: string }> = ({ children, content }) => {
    if (!shouldShowTooltips) {
      return <>{children}</>;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          align="center"
          className="bg-white border border-gray-300 shadow-lg"
          style={{ 
            fontFamily: 'Arial', 
            fontSize: '21px', 
            color: 'black',
            backgroundColor: 'white'
          }}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div id="format-menu" className="sticky top-0 z-10 border-b border-gray-200 p-3 shadow-sm" style={{
      backgroundColor: '#16a34a'
    }}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ConditionalTooltip content="Bold Text">
            <Button type="button" size="sm" onClick={() => onFormat('strong')} className="h-8 px-2 btn-toolbar-orange">
              <Bold className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Italic Text">
            <Button type="button" size="sm" onClick={() => onFormat('em')} className="h-8 px-2 btn-toolbar-orange">
              <Italic className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Underline Text">
            <Button type="button" size="sm" onClick={() => onFormat('u')} className="h-8 px-2 btn-toolbar-orange">
              <Underline className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
          
          {/* Dash buttons moved here for better accessibility */}
          <ConditionalTooltip content="Insert N-dash (short pause for audio)">
            <Button type="button" size="sm" onClick={() => onInsertText('–')} className="h-8 px-3 text-sm font-bold btn-toolbar-orange">
              –
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Insert M-dash (long pause for audio)">
            <Button type="button" size="sm" onClick={() => onInsertText('—')} className="h-8 px-3 text-sm font-bold btn-toolbar-orange">
              —
            </Button>
          </ConditionalTooltip>
        </div>

        <Separator orientation="vertical" className="h-6" style={{
          backgroundColor: '#9c441a'
        }} />

        {/* Text Alignment */}
        <div className="flex items-center gap-1">
          <ConditionalTooltip content="Align Left">
            <Button type="button" size="sm" onClick={() => onAlign('left')} className="h-8 px-2 btn-toolbar-blue">
              <AlignLeft className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Align Center">
            <Button type="button" size="sm" onClick={() => onAlign('center')} className="h-8 px-2 btn-toolbar-blue">
              <AlignCenter className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Align Right">
            <Button type="button" size="sm" onClick={() => onAlign('right')} className="h-8 px-2 btn-toolbar-blue">
              <AlignRight className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
        </div>

        <Separator orientation="vertical" className="h-6" style={{
          backgroundColor: '#9c441a'
        }} />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ConditionalTooltip content="Insert Bullet List">
            <Button type="button" size="sm" onClick={() => onInsertList(false)} className="h-8 px-2 btn-toolbar-purple">
              <List className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Insert Numbered List">
            <Button type="button" size="sm" onClick={() => onInsertList(true)} className="h-8 px-2 btn-toolbar-purple">
              <ListOrdered className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
        </div>

        <Separator orientation="vertical" className="h-6" style={{
          backgroundColor: '#9c441a'
        }} />

        {/* Icon Tokens Button */}
        <div className="flex items-center gap-1">
          <ConditionalTooltip content="Insert Icon Tokens">
            <Button 
              type="button" 
              size="sm" 
              onClick={onInsertIconTokens} 
              className="h-8 px-3 text-sm font-bold"
              style={{
                backgroundColor: '#D2691E',
                color: 'white',
                border: 'none'
              }}
            >
              Icons
            </Button>
          </ConditionalTooltip>
        </div>

        {/* Internal Link */}
        <div className="flex items-center gap-1">
          <InternalLinkDialog onInsertLink={onInsertLink}>
            <ConditionalTooltip content="Insert Internal Link">
              <Button type="button" size="sm" className="h-8 px-2 btn-toolbar-yellow">
                <Link2 className="h-4 w-4" />
              </Button>
            </ConditionalTooltip>
          </InternalLinkDialog>
        </div>

        {/* Page Break and Content Tools */}
        <div className="flex items-center gap-1">
          <ConditionalTooltip content="Insert Horizontal Line">
            <Button type="button" size="sm" onClick={onInsertHorizontalLine} className="h-8 px-2 btn-toolbar-slate">
              <Minus className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Insert Page Break (for printing)">
            <Button type="button" size="sm" onClick={onInsertPageBreak} className="h-8 px-2 btn-toolbar-indigo">
              <FileText className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
        </div>

        {/* Keep Together button */}
        <div className="flex items-center gap-1">
          <ConditionalTooltip content="Keep Selected Content Together">
            <Button type="button" size="sm" onClick={onWrapKeepTogether} className="h-8 px-2 btn-toolbar-purple">
              <Package className="h-4 w-4" />
            </Button>
          </ConditionalTooltip>
        </div>

        {/* Clear buttons */}
        <div className="flex items-center gap-1">
        </div>

        <Separator orientation="vertical" className="h-6" style={{
          backgroundColor: '#9c441a'
        }} />

        {/* Help */}
        <div className="flex items-center gap-1">
        </div>
      </div>

      {/* Second row for font size insertions */}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <div className="flex items-center gap-1">
          {/* Font selector moved from top row */}
          <Select onValueChange={onFontChange}>
            <SelectTrigger className="h-6 w-24 text-xs btn-toolbar-slate">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="Kalam" style={{
                fontFamily: 'Kalam'
              }}>Kalam (child-friendly)</SelectItem>
              <SelectItem value="Georgia" style={{
                fontFamily: 'Georgia'
              }}>Georgia (story content)</SelectItem>
              <SelectItem value="Arial" style={{
                fontFamily: 'Arial'
              }}>Arial (titles & headings)</SelectItem>
            </SelectContent>
          </Select>
          
          <ConditionalTooltip content="Insert Footer Text Style — 19px (14pt)">
            <Button 
              type="button" 
              size="sm" 
              onClick={() => onInsertFontSize('footer')} 
              className="h-6 px-3 text-xs btn-toolbar-slate"
            >
              Footer
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Insert Body Text Style — 21px (16pt)">
            <Button 
              type="button" 
              size="sm" 
              onClick={() => onInsertFontSize('body')} 
              className="h-6 px-3 text-xs btn-toolbar-slate"
            >
              Body
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Insert Heading 3 Style — 24px (18pt)">
            <Button 
              type="button" 
              size="sm" 
              onClick={() => onInsertFontSize('h3')} 
              className="h-6 px-3 text-xs btn-toolbar-slate"
            >
              H3
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Insert Heading 2 Style — 30px (23pt)">
            <Button 
              type="button" 
              size="sm" 
              onClick={() => onInsertFontSize('h2')} 
              className="h-6 px-3 text-xs btn-toolbar-slate"
            >
              H2
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Insert Heading 1 Style — 40px (30pt)">
            <Button 
              type="button" 
              size="sm" 
              onClick={() => onInsertFontSize('h1')} 
              className="h-6 px-3 text-xs btn-toolbar-slate"
            >
              H1
            </Button>
          </ConditionalTooltip>
          
          <Separator orientation="vertical" className="h-6" style={{
            backgroundColor: '#9c441a'
          }} />
          
          {/* Moved Clear and Help buttons to end */}
          <ConditionalTooltip content="Clear HTML from Selection">
            <Button type="button" size="sm" onClick={onClearHtml} className="h-6 px-2 text-xs btn-toolbar-orange">
              <span className="text-xs font-bold">&lt;X&gt;</span>
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Clear All Text (Start Over)">
            <Button type="button" size="sm" onClick={onClearAll} className="h-6 px-2 text-xs btn-toolbar-red">
              <Trash2 className="h-3 w-3" />
            </Button>
          </ConditionalTooltip>
          <ConditionalTooltip content="Show Help">
            <Button type="button" size="sm" onClick={onShowHelp} className="h-6 px-2 text-xs btn-toolbar-yellow">
              <Key className="h-3 w-3" />
            </Button>
          </ConditionalTooltip>
        </div>
      </div>
    </div>
  );
};

export default StickyToolbar;