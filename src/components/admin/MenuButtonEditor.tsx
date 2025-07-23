import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Upload, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MenuButton, MenuSubitem } from '@/hooks/useMenuData';
import MenuSubitemsEditor from './MenuSubitemsEditor';

interface MenuButtonEditorProps {
  buttonCode: string | null;
  menuGroup: string;
  onClose: () => void;
}

const COLOR_PRESETS = {
  primary: [
    // Primary Palette (Core Brand Colors) - Top Row
    { 
      name: 'Forest Green', 
      hex: '#16A34A',
      bg: 'bg-emerald-500', 
      hover: 'hover:bg-emerald-600', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#059669,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Nature & adventure - perfect for outdoor story themes. — Ideal for: Library/Stories, Nature Tales category'
    },
    { 
      name: 'Banner Blue', 
      hex: '#2563EB',
      bg: 'bg-blue-600', 
      hover: 'hover:bg-blue-700', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#1d4ed8,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Trustworthy & calm - great for educational content. — Ideal for: How-To guides, About page, main navigation'
    },
    { 
      name: 'Gold', 
      hex: '#EAB308',
      bg: 'bg-yellow-500', 
      hover: 'hover:bg-yellow-600', 
      text: 'text-yellow-900', 
      shadow: 'hover:shadow-[0_4px_0_#ca8a04,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Warm treasure feel - creates Grandpa\'s cozy atmosphere. — Ideal for: Featured stories, special announcements'
    },
    { 
      name: 'Sunset Orange', 
      hex: '#F97316',
      bg: 'bg-orange-500', 
      hover: 'hover:bg-orange-600', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#ea580c,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Storytelling warmth - evokes fireside tale moments. — Ideal for: Story submission, writing tools, creative sections'
    },
  ],
  secondary: [
    // Secondary Palette - Second Row
    { 
      name: 'Cherry Red', 
      hex: '#EF4444',
      bg: 'bg-red-500', 
      hover: 'hover:bg-red-600', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#dc2626,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Gentle excitement - not harsh, perfect for highlights. — Ideal for: Important alerts, featured content, call-to-action'
    },
    { 
      name: 'Royal Purple', 
      hex: '#8B5CF6',
      bg: 'bg-violet-500', 
      hover: 'hover:bg-violet-600', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#7c3aed,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Magical wonder - sparks imagination in young minds. — Ideal for: Fantasy stories, creative writing, imagination sections'
    },
    { 
      name: 'Slate Gray', 
      hex: '#64748B',
      bg: 'bg-slate-500', 
      hover: 'hover:bg-slate-600', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#475569,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Calm neutrality - accessible with good contrast. — Ideal for: Settings, admin tools, secondary navigation'
    },
  ],
  additional: [
    // Additional Colors - Bottom Rows
    { 
      name: 'Banner Orange', 
      hex: '#E27D09',
      bg: 'bg-orange-600', 
      hover: 'hover:bg-orange-700', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#c2410c,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Welcoming comfort - matches living room atmosphere. — Ideal for: Home page, welcome sections, cozy story categories'
    },
    { 
      name: 'Bright Yellow', 
      hex: '#FACC15',
      bg: 'bg-yellow-400', 
      hover: 'hover:bg-yellow-500', 
      text: 'text-yellow-900', 
      shadow: 'hover:shadow-[0_4px_0_#eab308,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Cheerful & energetic - draws children\'s attention safely. — Ideal for: Games, interactive features, fun activities'
    },
    { 
      name: 'Meadow Green', 
      hex: '#65A30D',
      bg: 'bg-lime-600', 
      hover: 'hover:bg-lime-700', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#4d7c0f,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Fresh growth - encourages learning and discovery. — Ideal for: Educational content, new features, learning tools'
    },
    { 
      name: 'Cream', 
      hex: '#FEF3C7',
      bg: 'bg-amber-100', 
      hover: 'hover:bg-amber-200', 
      text: 'text-amber-900', 
      shadow: 'hover:shadow-[0_4px_0_#fbbf24,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Soft comfort - gentle on young eyes with high contrast. — Ideal for: Quiet reading sections, calm content areas'
    },
    { 
      name: 'Peach', 
      hex: '#FDBA74',
      bg: 'bg-orange-300', 
      hover: 'hover:bg-orange-400', 
      text: 'text-orange-900', 
      shadow: 'hover:shadow-[0_4px_0_#fb923c,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Gentle warmth - creates welcoming child-friendly feel. — Ideal for: Comments section, community features, safe spaces'
    },
    { 
      name: 'Birch Wood', 
      hex: '#A15C2A',
      bg: 'bg-orange-700', 
      hover: 'hover:bg-orange-800', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#9a3412,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Warm wood grain - perfect for cozy reading sections and welcoming spaces. — Ideal for: Library entrance, story collections'
    },
    { 
      name: 'Oak Wood', 
      hex: '#814D2E',
      bg: 'bg-amber-800', 
      hover: 'hover:bg-amber-900', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#713f12,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Classic study wood - brings authentic Grandpa\'s den atmosphere to life. — Ideal for: About page, wisdom sections, traditional content'
    },
    { 
      name: 'Mahogany Wood', 
      hex: '#9C441A',
      bg: 'bg-red-900', 
      hover: 'hover:bg-red-950', 
      text: 'text-white', 
      shadow: 'hover:shadow-[0_4px_0_#7f1d1d,0_6px_12px_rgba(0,0,0,0.4)]',
      description: 'Rich heritage wood - sophisticated warmth for premium storytelling content. — Ideal for: Featured stories, author spotlights, legacy collections'
    },
  ]
};

const MenuButtonEditor: React.FC<MenuButtonEditorProps> = ({ 
  buttonCode, 
  menuGroup, 
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    button_code: '',
    button_name: '',
    menu_group: menuGroup,
    display_order: 0,
    icon_url: '',
    bg_color: 'bg-blue-500',
    hover_bg_color: 'hover:bg-blue-600',
    text_color: 'text-white',
    hover_shadow: 'hover:shadow-[0_4px_0_#1d4ed8,0_6px_12px_rgba(0,0,0,0.4)]',
    button_size: 'default',
    is_active: true,
    path: '',
    description: '',
  });
  const [subitems, setSubitems] = useState<MenuSubitem[]>([]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('');

  useEffect(() => {
    if (buttonCode) {
      loadButtonData();
    }
  }, [buttonCode]);

  const loadButtonData = async () => {
    if (!buttonCode) return;

    try {
      setLoading(true);
      
      // Load button data
      const { data: button, error: buttonError } = await supabase
        .from('menu_buttons')
        .select('*')
        .eq('button_code', buttonCode)
        .single();

      if (buttonError) throw buttonError;

      setFormData({
        button_code: button.button_code,
        button_name: button.button_name || '',
        menu_group: button.menu_group,
        display_order: button.display_order,
        icon_url: button.icon_url || '',
        bg_color: button.bg_color,
        hover_bg_color: button.hover_bg_color,
        text_color: button.text_color,
        hover_shadow: button.hover_shadow || '',
        button_size: button.button_size,
        is_active: button.is_active,
        path: button.path || '',
        description: button.description || '',
      });

      // Load subitems
      const { data: subitemsData, error: subitemsError } = await supabase
        .from('menu_subitems')
        .select('*')
        .eq('parent_button_code', buttonCode)
        .order('display_order');

      if (subitemsError) throw subitemsError;

      setSubitems(subitemsData || []);
    } catch (error) {
      console.error('Error loading button data:', error);
      toast.error('Failed to load button data');
    } finally {
      setLoading(false);
    }
  };

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('menu-icons')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('menu-icons')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, icon_url: data.publicUrl }));
      toast.success('Icon uploaded successfully');
    } catch (error) {
      console.error('Error uploading icon:', error);
      toast.error('Failed to upload icon');
    } finally {
      setUploading(false);
    }
  };

  const handleColorPresetSelect = (preset: {
    name: string;
    hex: string;
    bg: string;
    hover: string;
    text: string;
    shadow: string;
    description: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      bg_color: preset.bg,
      hover_bg_color: preset.hover,
      text_color: preset.text,
      hover_shadow: preset.shadow,
    }));
  };

  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const getContrastColor = (hex: string) => {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    // Convert to RGB
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const handleApplyCustomColor = () => {
    if (!customColorName.trim()) {
      toast.error('Please enter a color name');
      return;
    }
    
    if (!isValidHex(customColorHex)) {
      toast.error('Please enter a valid hex color code (e.g., #FF5733)');
      return;
    }

    const textColor = getContrastColor(customColorHex);
    
    setFormData(prev => ({
      ...prev,
      bg_color: '',
      hover_bg_color: '',
      text_color: textColor === '#FFFFFF' ? 'text-white' : 'text-black',
      hover_shadow: `hover:shadow-[0_4px_0_${customColorHex},0_6px_12px_rgba(0,0,0,0.4)]`,
    }));

    toast.success(`Applied custom color: ${customColorName}`);
  };

  const handleSave = async () => {
    if (!formData.button_code.trim()) {
      toast.error('Button code is required');
      return;
    }

    try {
      setLoading(true);

      if (buttonCode) {
        // Update existing button
        const { error } = await supabase
          .from('menu_buttons')
          .update(formData)
          .eq('button_code', buttonCode);

        if (error) throw error;
      } else {
        // Create new button
        const { error } = await supabase
          .from('menu_buttons')
          .insert(formData);

        if (error) throw error;
      }

      toast.success(`Button ${buttonCode ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error: any) {
      console.error('Error saving button:', error);
      if (error.code === '23505') {
        toast.error('Button code already exists. Please choose a different code.');
      } else {
        toast.error('Failed to save button');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    return formData.button_name.trim() || 
           (formData.button_code.charAt(0).toUpperCase() + formData.button_code.slice(1));
  };

  if (loading && buttonCode) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading button data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
            <div>
              <CardTitle>
                {buttonCode ? 'Edit Menu Button' : 'Create New Menu Button'}
              </CardTitle>
              <CardDescription>
                Configure the appearance and behavior of your navigation button
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_code">Button Code *</Label>
                  <Input
                    id="button_code"
                    value={formData.button_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_code: e.target.value }))}
                    placeholder="e.g., stories, about"
                    disabled={!!buttonCode}
                  />
                </div>
                <div>
                  <Label htmlFor="button_name">Button Name</Label>
                  <Input
                    id="button_name"
                    value={formData.button_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_name: e.target.value }))}
                    placeholder="Leave blank to use code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="menu_group">Menu Group</Label>
                  <Select value={formData.menu_group} onValueChange={(value) => setFormData(prev => ({ ...prev, menu_group: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="path">Path</Label>
                <Input
                  id="path"
                  value={formData.path}
                  onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                  placeholder="e.g., /library, /about"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tooltip description for the button"
                />
              </div>

              <div>
                <Label>Icon Upload</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  )}
                </div>
                {formData.icon_url && (
                  <img src={formData.icon_url} alt="Icon preview" className="w-8 h-8 mt-2 object-contain" />
                )}
              </div>

              <div>
                <Label>Color Presets</Label>
                <div className="mt-2 max-h-96 overflow-y-auto space-y-6">
                  {/* Primary Palette */}
                  <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                    <h4 className="font-semibold text-sm mb-3 text-primary">Primary Palette (Core Brand Colors)</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_PRESETS.primary.map((preset) => (
                        <div
                          key={preset.name}
                          onClick={() => handleColorPresetSelect(preset)}
                          className="min-h-52 p-3 flex flex-col items-center gap-2 border-2 border-border rounded-lg cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all bg-card"
                        >
                          {/* Color Swatch */}
                          <div 
                            className="w-[50px] h-[50px] rounded-lg border-2 border-white shadow-md flex-shrink-0"
                            style={{ backgroundColor: preset.hex }}
                          />
                          {/* Color Info */}
                          <div className="flex flex-col gap-1 w-full text-center flex-1 justify-center">
                            <div className="font-semibold text-xs">{preset.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{preset.hex}</div>
                            <div className="text-xs text-muted-foreground leading-tight break-words word-wrap hyphens-auto px-1">
                              {preset.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Palette */}
                  <div className="p-4 border-2 border-secondary/20 rounded-lg bg-secondary/5">
                    <h4 className="font-semibold text-sm mb-3 text-secondary-foreground">Secondary Palette</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {COLOR_PRESETS.secondary.map((preset) => (
                        <div
                          key={preset.name}
                          onClick={() => handleColorPresetSelect(preset)}
                          className="min-h-52 p-3 flex flex-col items-center gap-2 border-2 border-border rounded-lg cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all bg-card"
                        >
                          {/* Color Swatch */}
                          <div 
                            className="w-[50px] h-[50px] rounded-lg border-2 border-white shadow-md flex-shrink-0"
                            style={{ backgroundColor: preset.hex }}
                          />
                          {/* Color Info */}
                          <div className="flex flex-col gap-1 w-full text-center flex-1 justify-center">
                            <div className="font-semibold text-xs">{preset.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{preset.hex}</div>
                            <div className="text-xs text-muted-foreground leading-tight break-words word-wrap hyphens-auto px-1">
                              {preset.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Colors */}
                  <div className="p-4 border-2 border-muted-foreground/20 rounded-lg bg-muted/5">
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Additional Colors</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {COLOR_PRESETS.additional.map((preset) => (
                        <div
                          key={preset.name}
                          onClick={() => handleColorPresetSelect(preset)}
                          className="min-h-52 p-3 flex flex-col items-center gap-2 border-2 border-border rounded-lg cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all bg-card"
                        >
                          {/* Color Swatch */}
                          <div 
                            className="w-[50px] h-[50px] rounded-lg border-2 border-white shadow-md flex-shrink-0"
                            style={{ backgroundColor: preset.hex }}
                          />
                          {/* Color Info */}
                          <div className="flex flex-col gap-1 w-full text-center flex-1 justify-center">
                            <div className="font-semibold text-xs">{preset.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{preset.hex}</div>
                            <div className="text-xs text-muted-foreground leading-tight break-words word-wrap hyphens-auto px-1">
                              {preset.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Custom Color</Label>
                <div className="space-y-3 mt-2 p-4 border rounded-lg bg-muted/20">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="customColorName" className="text-sm">Color Name</Label>
                      <Input
                        id="customColorName"
                        value={customColorName}
                        onChange={(e) => setCustomColorName(e.target.value)}
                        placeholder="e.g., Coral Pink"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customColorHex" className="text-sm">Hex Code</Label>
                      <Input
                        id="customColorHex"
                        value={customColorHex}
                        onChange={(e) => setCustomColorHex(e.target.value)}
                        placeholder="#FF5733"
                        className="mt-1 font-mono"
                      />
                    </div>
                  </div>
                  
                  {/* Color Preview */}
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-md border-2 border-white shadow-sm"
                      style={{ 
                        backgroundColor: isValidHex(customColorHex) ? customColorHex : '#f3f4f6' 
                      }}
                    />
                    <div className="flex-1">
                      {customColorName && (
                        <div className="font-medium text-sm">{customColorName}</div>
                      )}
                      {isValidHex(customColorHex) && (
                        <div className="text-xs text-muted-foreground font-mono">{customColorHex.toUpperCase()}</div>
                      )}
                      {customColorHex && !isValidHex(customColorHex) && (
                        <div className="text-xs text-red-500">Invalid hex format</div>
                      )}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleApplyCustomColor}
                      disabled={!customColorName.trim() || !isValidHex(customColorHex)}
                      className="shrink-0"
                    >
                      Apply Color
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="p-6 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg">
                <div className="flex justify-center">
                  <div
                    className={`
                      px-6 py-3 rounded-lg font-semibold transition-all duration-200 border-2
                      ${formData.bg_color || 'border-2'} ${formData.text_color}
                      min-h-[48px] min-w-[48px]
                    `}
                    style={{
                      backgroundColor: !formData.bg_color && isValidHex(customColorHex) ? customColorHex : undefined,
                      color: !formData.bg_color && isValidHex(customColorHex) ? getContrastColor(customColorHex) : undefined
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {formData.icon_url && (
                        <img 
                          src={formData.icon_url} 
                          alt="" 
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span>{getDisplayName()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Code:</strong> {formData.button_code || 'Not set'}</p>
                <p><strong>Path:</strong> {formData.path || 'No direct path'}</p>
                <p><strong>Group:</strong> {formData.menu_group}</p>
                <p><strong>Order:</strong> {formData.display_order}</p>
              </div>
            </div>
          </div>

          {/* Subitems Editor */}
          {buttonCode && (
            <MenuSubitemsEditor
              parentButtonCode={buttonCode}
              subitems={subitems}
              onUpdate={setSubitems}
            />
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : (buttonCode ? 'Update Button' : 'Create Button')}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuButtonEditor;