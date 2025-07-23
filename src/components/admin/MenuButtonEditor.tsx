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

const COLOR_PRESETS = [
  { name: 'Blue', bg: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-white', shadow: 'hover:shadow-[0_4px_0_#1d4ed8,0_6px_12px_rgba(0,0,0,0.4)]' },
  { name: 'Green', bg: 'bg-green-500', hover: 'hover:bg-green-600', text: 'text-white', shadow: 'hover:shadow-[0_4px_0_#16a34a,0_6px_12px_rgba(0,0,0,0.4)]' },
  { name: 'Purple', bg: 'bg-purple-500', hover: 'hover:bg-purple-600', text: 'text-white', shadow: 'hover:shadow-[0_4px_0_#9333ea,0_6px_12px_rgba(0,0,0,0.4)]' },
  { name: 'Yellow', bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-green-800', shadow: 'hover:shadow-[0_4px_0_#ca8a04,0_6px_12px_rgba(0,0,0,0.4)]' },
  { name: 'Red', bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-white', shadow: 'hover:shadow-[0_4px_0_#dc2626,0_6px_12px_rgba(0,0,0,0.4)]' },
  { name: 'Gray', bg: 'bg-gray-700', hover: 'hover:bg-gray-800', text: 'text-white', shadow: 'hover:shadow-[0_4px_0_#374151,0_6px_12px_rgba(0,0,0,0.4)]' },
];

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

  const handleColorPresetSelect = (preset: typeof COLOR_PRESETS[0]) => {
    setFormData(prev => ({
      ...prev,
      bg_color: preset.bg,
      hover_bg_color: preset.hover,
      text_color: preset.text,
      hover_shadow: preset.shadow,
    }));
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
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {COLOR_PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => handleColorPresetSelect(preset)}
                      className={`${preset.bg} ${preset.text} hover:opacity-80`}
                    >
                      {preset.name}
                    </Button>
                  ))}
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
                      ${formData.bg_color} ${formData.text_color}
                      min-h-[48px] min-w-[48px]
                    `}
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