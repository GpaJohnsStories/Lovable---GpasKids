import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import MenuSubitemsEditor from './MenuSubitemsEditor';

interface MenuButtonEditorProps {
  buttonCode: string | null;
  menuGroup: string;
  onClose: () => void;
}

// Simplified color presets with just names and hex values
const COLOR_PRESETS = {
  "Blue": { top: "#3B82F6", bottom: "#1D4ED8" },
  "Green": { top: "#10B981", bottom: "#047857" },
  "Purple": { top: "#8B5CF6", bottom: "#6D28D9" },
  "Red": { top: "#EF4444", bottom: "#B91C1C" },
  "Orange": { top: "#F97316", bottom: "#C2410C" },
  "Pink": { top: "#EC4899", bottom: "#BE185D" },
  "Teal": { top: "#14B8A6", bottom: "#0F766E" },
  "Indigo": { top: "#6366F1", bottom: "#4338CA" },
  "Yellow": { top: "#F59E0B", bottom: "#D97706" },
  "Gray": { top: "#6B7280", bottom: "#374151" },
};

const MenuButtonEditor: React.FC<MenuButtonEditorProps> = ({ buttonCode, menuGroup, onClose }) => {
  const { toast } = useToast();
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
    hover_shadow: 'hover:shadow-lg',
    button_width: 60,
    button_height: 60,
    top_color: '#3B82F6',
    bottom_color: '#1D4ED8',
    button_shape: 'button',
    is_active: true,
    path: '',
    description: '',
  });
  const [selectedPreset, setSelectedPreset] = useState<string>('Blue');

  useEffect(() => {
    if (buttonCode) {
      loadButtonData();
    }
  }, [buttonCode]);

  const loadButtonData = async () => {
    if (!buttonCode) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_buttons')
        .select('*')
        .eq('button_code', buttonCode)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          button_code: data.button_code,
          button_name: data.button_name || '',
          menu_group: data.menu_group,
          display_order: data.display_order,
          icon_url: data.icon_url || '',
          bg_color: data.bg_color,
          hover_bg_color: data.hover_bg_color,
          text_color: data.text_color,
          hover_shadow: data.hover_shadow || '',
          button_width: data.button_width || 60,
          button_height: data.button_height || 60,
          top_color: data.top_color || '#3B82F6',
          bottom_color: data.bottom_color || '#1D4ED8',
          button_shape: data.button_shape || 'button',
          is_active: data.is_active,
          path: data.path || '',
          description: data.description || '',
        });
      }
    } catch (error) {
      console.error('Error loading button data:', error);
      toast({
        title: "Error",
        description: "Failed to load button data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-icons')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-icons')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, icon_url: publicUrl }));
      toast({
        title: "Success",
        description: "Icon uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading icon:', error);
      toast({
        title: "Error",
        description: "Failed to upload icon",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleColorPresetSelect = (presetName: string) => {
    setSelectedPreset(presetName);
    if (presetName !== 'Custom') {
      const preset = COLOR_PRESETS[presetName as keyof typeof COLOR_PRESETS];
      setFormData(prev => ({
        ...prev,
        top_color: preset.top,
        bottom_color: preset.bottom,
      }));
    }
  };

  const getButtonStyle = () => {
    const isGradient = formData.top_color !== formData.bottom_color;
    const background = isGradient 
      ? `linear-gradient(135deg, ${formData.top_color}, ${formData.bottom_color})`
      : formData.top_color;
    
    const borderRadius = formData.button_shape === 'button' ? '8px' : '4px';
    
    return {
      width: `${formData.button_width}px`,
      height: `${formData.button_height}px`,
      background,
      borderRadius,
      border: '2px solid rgba(255,255,255,0.2)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      gap: '4px'
    };
  };

  const handleSave = async () => {
    if (!formData.button_code.trim()) {
      toast({
        title: "Error",
        description: "Button code is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const buttonData = {
        button_code: formData.button_code,
        button_name: formData.button_name || null,
        menu_group: formData.menu_group,
        display_order: formData.display_order,
        icon_url: formData.icon_url || null,
        bg_color: formData.bg_color,
        hover_bg_color: formData.hover_bg_color,
        text_color: formData.text_color,
        hover_shadow: formData.hover_shadow || null,
        button_width: formData.button_width,
        button_height: formData.button_height,
        top_color: formData.top_color,
        bottom_color: formData.bottom_color,
        button_shape: formData.button_shape,
        is_active: formData.is_active,
        path: formData.path || null,
        description: formData.description || null,
      };

      if (buttonCode) {
        // Update existing button
        const { error } = await supabase
          .from('menu_buttons')
          .update(buttonData)
          .eq('button_code', buttonCode);
        
        if (error) throw error;
      } else {
        // Create new button
        const { error } = await supabase
          .from('menu_buttons')
          .insert([buttonData]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Menu button ${buttonCode ? 'updated' : 'created'} successfully!`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving button:', error);
      toast({
        title: "Error",
        description: `Failed to ${buttonCode ? 'update' : 'create'} menu button`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {buttonCode ? 'Edit Menu Button' : 'Create New Menu Button'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <Label htmlFor="button_code">Button Code *</Label>
                <Input
                  id="button_code"
                  value={formData.button_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_code: e.target.value }))}
                  placeholder="e.g., stories, about, comments"
                  disabled={!!buttonCode}
                />
              </div>

              <div>
                <Label htmlFor="button_name">Button Name (Leave empty for icon-only)</Label>
                <Input
                  id="button_name"
                  value={formData.button_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_name: e.target.value }))}
                  placeholder="Display name for the button"
                />
              </div>

              <div>
                <Label htmlFor="path">Link Path</Label>
                <Input
                  id="path"
                  value={formData.path}
                  onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                  placeholder="e.g., /stories, /about"
                />
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

              <div>
                <Label htmlFor="description">Description (Tooltip)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description shown on hover"
                  rows={2}
                />
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

            {/* Button Dimensions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Button Size</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_width">Width (px)</Label>
                  <Input
                    id="button_width"
                    type="number"
                    min="40"
                    max="200"
                    value={formData.button_width}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_width: parseInt(e.target.value) || 60 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="button_height">Height (px)</Label>
                  <Input
                    id="button_height"
                    type="number"
                    min="40"
                    max="200"
                    value={formData.button_height}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_height: parseInt(e.target.value) || 60 }))}
                  />
                </div>
              </div>
            </div>

            {/* Button Shape */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Button Shape</h3>
              <RadioGroup
                value={formData.button_shape}
                onValueChange={(value) => setFormData(prev => ({ ...prev, button_shape: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="button" id="shape-button" />
                  <Label htmlFor="shape-button">Button (rounded corners)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="label" id="shape-label" />
                  <Label htmlFor="shape-label">Label (square corners)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Icon Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Icon</h3>
              <div>
                <Label htmlFor="icon_upload">Upload Icon</Label>
                <div className="mt-2">
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {uploading ? 'Uploading...' : 'Click to upload icon'}
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleIconUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {formData.icon_url && (
                  <div className="mt-2">
                    <img
                      src={formData.icon_url}
                      alt="Icon preview"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Colors</h3>
              
              <div>
                <Label>Color Presets</Label>
                <Select value={selectedPreset} onValueChange={handleColorPresetSelect}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(COLOR_PRESETS).map((presetName) => (
                      <SelectItem key={presetName} value={presetName}>
                        {presetName}
                      </SelectItem>
                    ))}
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="top_color">Top Color</Label>
                  <Input
                    id="top_color"
                    type="color"
                    value={formData.top_color}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, top_color: e.target.value }));
                      setSelectedPreset('Custom');
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="bottom_color">Bottom Color</Label>
                  <Input
                    id="bottom_color"
                    type="color"
                    value={formData.bottom_color}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, bottom_color: e.target.value }));
                      setSelectedPreset('Custom');
                    }}
                  />
                </div>
              </div>
              
              {formData.top_color === formData.bottom_color ? (
                <p className="text-sm text-gray-600">Solid color will be applied</p>
              ) : (
                <p className="text-sm text-gray-600">Gradient will be applied</p>
              )}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="border-2 border-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
              <div style={getButtonStyle()}>
                {formData.icon_url && (
                  <img 
                    src={formData.icon_url} 
                    alt="" 
                    className="w-5 h-5 object-contain"
                  />
                )}
                {formData.button_name && (
                  <span className="hidden sm:inline text-xs">
                    {formData.button_name}
                  </span>
                )}
              </div>
            </div>
            
            {buttonCode && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Subitems</h3>
                <MenuSubitemsEditor parentButtonCode={buttonCode} subitems={[]} onUpdate={() => {}} />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : buttonCode ? 'Update Button' : 'Create Button'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuButtonEditor;