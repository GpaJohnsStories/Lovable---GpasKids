import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface TitleToolsDialogProps {
  children: React.ReactNode;
  onInsertTitle: (titleHtml: string) => void;
}

interface TitleStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  color?: string;
}

const TitleToolsDialog: React.FC<TitleToolsDialogProps> = ({ children, onInsertTitle }) => {
  const [open, setOpen] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [style, setStyle] = useState<TitleStyle>({
    fontFamily: 'Gloria Hallelujah',
    fontSize: '28px',
    fontWeight: '600',
    fontStyle: 'normal',
    color: '#0B3D91'
  });

  const fontOptions = [
    { value: 'Gloria Hallelujah', label: 'Gloria Hallelujah (cursive)' },
    { value: 'Kalam', label: 'Kalam (child-friendly)' },
    { value: 'Georgia', label: 'Georgia (story content)' },
    { value: 'Arial', label: 'Arial (system)' }
  ];

  const sizeOptions = [
    { value: '21px', label: '21px (Body)' },
    { value: '24px', label: '24px (H3)' },
    { value: '28px', label: '28px (Large)' },
    { value: '30px', label: '30px (H2)' },
    { value: '36px', label: '36px (XL)' },
    { value: '40px', label: '40px (H1)' }
  ];

  const weightOptions = [
    { value: 'normal', label: 'Normal' },
    { value: '600', label: 'Semi-bold' },
    { value: 'bold', label: 'Bold' }
  ];

  const colorPresets = [
    { name: 'Navy Blue', value: '#0B3D91' },
    { name: 'Forest Green', value: '#228B22' },
    { name: 'Dark Orange', value: '#FF8C00' },
    { name: 'Purple', value: '#8B008B' },
    { name: 'Black', value: '#000000' },
    { name: 'Dark Red', value: '#8B0000' }
  ];

  const presetTitles = [
    { name: 'Hello Preset', text: 'Hello — ', style: { fontFamily: 'Gloria Hallelujah', fontSize: '28px', fontWeight: '600', fontStyle: 'italic', color: '#0B3D91' } },
    { name: 'Story Title', text: '', style: { fontFamily: 'Georgia', fontSize: '30px', fontWeight: 'bold', fontStyle: 'normal', color: '#228B22' } },
    { name: 'WebText Title', text: '', style: { fontFamily: 'Arial', fontSize: '24px', fontWeight: 'bold', fontStyle: 'normal', color: '#0B3D91' } }
  ];

  const handlePresetClick = (preset: typeof presetTitles[0]) => {
    setTitleText(preset.text);
    setStyle(preset.style);
  };

  const handleInsert = () => {
    if (!titleText.trim()) return;

    // Normalize font-weight: half-bold to 600
    const normalizedWeight = style.fontWeight === 'half-bold' ? '600' : style.fontWeight;

    // Build the style string
    const styleString = [
      style.fontFamily ? `font-family: '${style.fontFamily}', cursive` : '',
      style.color ? `color: ${style.color}` : '',
      style.fontSize ? `font-size: ${style.fontSize}` : '',
      normalizedWeight ? `font-weight: ${normalizedWeight}` : '',
      style.fontStyle ? `font-style: ${style.fontStyle}` : ''
    ].filter(Boolean).join('; ');

    // Create the complete title HTML with wrapper
    const titleHtml = `<span style="${styleString};">{{TITLE}}${titleText}{{/TITLE}}</span>`;
    
    onInsertTitle(titleHtml);
    setOpen(false);
    
    // Reset form
    setTitleText('');
    setStyle({
      fontFamily: 'Gloria Hallelujah',
      fontSize: '28px',
      fontWeight: '600',
      fontStyle: 'normal',
      color: '#0B3D91'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-18-system">Title/Tagline Tools</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Quick Presets */}
          <div>
            <Label className="text-16-system font-bold mb-2 block">Quick Presets</Label>
            <div className="flex gap-2 flex-wrap">
              {presetTitles.map((preset, index) => (
                <Button
                  key={index}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="btn-toolbar-blue text-14-system"
                  size="sm"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Title Text Input */}
          <div>
            <Label htmlFor="title-text" className="text-16-system font-bold">Title Text</Label>
            <Input
              id="title-text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              placeholder="Enter your title text..."
              className="text-16-system mt-1"
            />
          </div>

          {/* Font Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-16-system font-bold">Font Family</Label>
              <Select value={style.fontFamily} onValueChange={(value) => setStyle(prev => ({ ...prev, fontFamily: value }))}>
                <SelectTrigger className="text-16-system">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map(font => (
                    <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-16-system font-bold">Font Size</Label>
              <Select value={style.fontSize} onValueChange={(value) => setStyle(prev => ({ ...prev, fontSize: value }))}>
                <SelectTrigger className="text-16-system">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map(size => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-16-system font-bold">Font Weight</Label>
              <Select value={style.fontWeight} onValueChange={(value) => setStyle(prev => ({ ...prev, fontWeight: value }))}>
                <SelectTrigger className="text-16-system">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weightOptions.map(weight => (
                    <SelectItem key={weight.value} value={weight.value}>
                      {weight.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-16-system font-bold">Font Style</Label>
              <Select value={style.fontStyle} onValueChange={(value) => setStyle(prev => ({ ...prev, fontStyle: value }))}>
                <SelectTrigger className="text-16-system">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="italic">Italic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <Label className="text-16-system font-bold mb-2 block">Color</Label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {colorPresets.map((color, index) => (
                <Button
                  key={index}
                  type="button"
                  onClick={() => setStyle(prev => ({ ...prev, color: color.value }))}
                  className="h-10 text-14-system justify-start"
                  style={{ 
                    backgroundColor: color.value, 
                    color: 'white',
                    border: style.color === color.value ? '3px solid #FFD700' : 'none'
                  }}
                >
                  {color.name}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <Label htmlFor="custom-color" className="text-14-system">Custom:</Label>
              <Input
                id="custom-color"
                type="color"
                value={style.color}
                onChange={(e) => setStyle(prev => ({ ...prev, color: e.target.value }))}
                className="w-20 h-8"
              />
              <span className="text-14-system">{style.color}</span>
            </div>
          </div>

          {/* Preview */}
          <div>
            <Label className="text-16-system font-bold mb-2 block">Preview</Label>
            <div 
              className="border border-gray-200 rounded p-4 bg-gray-50"
              style={{
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight === 'half-bold' ? '600' : style.fontWeight,
                fontStyle: style.fontStyle,
                color: style.color
              }}
            >
              {titleText || 'Preview will appear here...'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="text-16-system">
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleInsert}
              disabled={!titleText.trim()}
              className="btn-toolbar-golden text-16-system"
            >
              Insert Title
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TitleToolsDialog;