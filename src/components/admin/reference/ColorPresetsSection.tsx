import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Pencil, Save, X } from 'lucide-react';

interface ColorDetail {
  name: string;
  code: string;
  pages: string;
}

interface ColorPreset {
  number: number;
  name: string;
  borderColor: string;
  backgroundColor: string;
  fontColor: string;
  colorDetails: ColorDetail[];
}

const ColorPresetsSection = () => {
  const queryClient = useQueryClient();
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});

  // Fetch color presets from Supabase
  const { data: colorPresetsData, isLoading, error } = useQuery({
    queryKey: ['color-presets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('color_presets')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    }
  });

  // Transform Supabase data to match ColorPreset interface
  const colorPresets: ColorPreset[] = colorPresetsData?.map(preset => ({
    number: parseInt(preset.id),
    name: preset.name,
    borderColor: preset.box_border_color_hex || '#9ca3af',
    backgroundColor: preset.background_color_hex || 'rgba(156, 163, 175, 0.2)',
    fontColor: preset.font_color_hex || '#333333',
    colorDetails: [
      { name: preset.box_border_color_name || 'Border', code: preset.box_border_color_hex || 'To be set', pages: preset.pages || '' },
      { name: preset.photo_border_color_name || 'Photo Border', code: preset.photo_border_color_hex || 'To be set', pages: '' },
      { name: preset.background_color_name || 'Background', code: preset.background_color_hex || 'To be set', pages: '' },
      { name: preset.font_color_name || 'Font', code: preset.font_color_hex || 'To be set', pages: '' }
    ]
  })) || [];

  // Mutation to update color preset
  const updatePresetMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('color_presets')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['color-presets'] });
      toast.success('Color preset updated successfully');
      setEditingPreset(null);
      setEditValues({});
    },
    onError: (error: any) => {
      toast.error(`Failed to update preset: ${error.message}`);
    }
  });

  const startEdit = (presetId: string, currentData: any) => {
    setEditingPreset(presetId);
    setEditValues(currentData);
  };

  const cancelEdit = () => {
    setEditingPreset(null);
    setEditValues({});
  };

  const saveEdit = (presetId: string) => {
    // Trim all 7-character hex fields to remove trailing spaces
    const trimmedUpdates = {
      ...editValues,
      box_border_color_hex: editValues.box_border_color_hex?.trim() || editValues.box_border_color_hex,
      photo_border_color_hex: editValues.photo_border_color_hex?.trim() || editValues.photo_border_color_hex,
      font_color_hex: editValues.font_color_hex?.trim() || editValues.font_color_hex,
    };
    updatePresetMutation.mutate({ id: presetId, updates: trimmedUpdates });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-black" style={{ fontSize: '21px' }}>
          Color Presets
        </h3>
        <div className="p-4 text-center">Loading color presets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-black" style={{ fontSize: '21px' }}>
          Color Presets
        </h3>
        <div className="p-4 text-center text-red-600">
          Error loading color presets: {error.message}
        </div>
      </div>
    );
  }

  const ColorSwatch: React.FC<{ preset: ColorPreset }> = ({ preset }) => (
    <div
      className="flex items-center justify-center h-20 text-center"
      style={{
        backgroundColor: preset.backgroundColor,
        border: `4px solid ${preset.borderColor}`,
        borderRadius: '8px'
      }}
    >
      <div
        style={{
          color: preset.fontColor,
          fontFamily: 'Kalam, cursive',
          fontSize: '21px',
          fontWeight: 'bold',
          lineHeight: '1.2'
        }}
        dangerouslySetInnerHTML={{ __html: 'ABC<br>abc<br>123' }}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-black" style={{ fontSize: '21px' }}>
        Color Presets
      </h3>
      
      {/* Color Presets Grid */}
      <div className="overflow-x-auto">
        <div 
          className="grid gap-2 min-w-[1000px]"
          style={{ 
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(25, minmax(0, 1fr))',
            fontSize: '21px'
          }}
        >
          {/* Headers Row */}
          <div className="col-span-1 font-bold border px-2 py-0.5 text-center bg-gray-100">
            Preset #<br />Name<br />Color Swatch
          </div>
          <div className="col-span-1 font-bold border px-2 py-0.5 text-center bg-gray-100">
            Names
          </div>
          <div className="col-span-1 font-bold border px-2 py-0.5 text-center bg-gray-100">
            Codes
          </div>
          <div className="col-span-1 font-bold border px-2 py-0.5 text-center bg-gray-100">
            Pages
          </div>
          <div className="col-span-1 font-bold border px-2 py-0.5 text-center bg-gray-100">
            Preset #<br />Name<br />Color Swatch
          </div>
          <div className="col-span-1 font-bold border px-2 py-0.5 text-center bg-gray-100">
            Names
          </div>
          <div className="col-span-1 font-bold border px-2 py-0.5 text-center bg-gray-100">
            Codes
          </div>
          <div className="col-span-1 font-bold border px-2 py-0.5 text-center bg-gray-100">
            Pages
          </div>

          {/* Render each preset */}
          {colorPresets.map((preset, presetIndex) => {
            const isLeftColumn = presetIndex < 4; // Presets 1-4 on left, 5-8 on right
            const colStart = isLeftColumn ? 1 : 5;
            const rowStart = isLeftColumn ? 2 + (presetIndex * 6) : 2 + ((presetIndex - 4) * 6);
            const presetData = colorPresetsData?.find(p => p.id === preset.number.toString());
            const isEditing = editingPreset === preset.number.toString();
            
            return (
              <React.Fragment key={`preset-${preset.number}`}>
                {/* Preset number and name - 1 row */}
                <div 
                  className="border px-2 py-1 text-center font-bold flex flex-col items-center justify-center bg-gray-50 gap-1"
                  style={{ 
                    gridColumn: `${colStart} / ${colStart + 1}`,
                    gridRow: `${rowStart} / ${rowStart + 1}`
                  }}
                >
                  <div className="text-lg">{preset.number}</div>
                  {isEditing ? (
                    <Input
                      value={editValues.name || ''}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      className="h-7 text-sm text-center"
                    />
                  ) : (
                    <div className="text-sm">{preset.name}</div>
                  )}
                  {!isEditing ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(preset.number.toString(), presetData)}
                      className="mt-1"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => saveEdit(preset.number.toString())}
                        disabled={updatePresetMutation.isPending}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Color swatch - 1 row */}
                <div 
                  className="border px-2 py-1 flex items-center justify-center"
                  style={{ 
                    gridColumn: `${colStart} / ${colStart + 1}`,
                    gridRow: `${rowStart + 1} / ${rowStart + 2}`
                  }}
                >
                  <ColorSwatch preset={preset} />
                </div>
                
                {/* Color details - 4 individual rows */}
                {preset.colorDetails.map((detail, detailIndex) => {
                  const fieldMap = [
                    { nameKey: 'box_border_color_name', hexKey: 'box_border_color_hex' },
                    { nameKey: 'photo_border_color_name', hexKey: 'photo_border_color_hex' },
                    { nameKey: 'background_color_name', hexKey: 'background_color_hex' },
                    { nameKey: 'font_color_name', hexKey: 'font_color_hex' }
                  ][detailIndex];

                  return (
                    <React.Fragment key={`preset-${preset.number}-detail-${detailIndex}`}>
                      <div 
                        className="border px-2 py-0.5 text-sm"
                        style={{ 
                          gridColumn: `${colStart + 1} / ${colStart + 2}`,
                          gridRow: `${rowStart + 2 + detailIndex} / ${rowStart + 3 + detailIndex}`
                        }}
                      >
                        {isEditing ? (
                          <Input
                            value={editValues[fieldMap.nameKey] || ''}
                            onChange={(e) => setEditValues({ ...editValues, [fieldMap.nameKey]: e.target.value })}
                            className="h-7 text-sm"
                          />
                        ) : (
                          detail.name
                        )}
                      </div>
                      <div 
                        className="border px-2 py-0.5 text-xs font-mono"
                        style={{ 
                          gridColumn: `${colStart + 2} / ${colStart + 3}`,
                          gridRow: `${rowStart + 2 + detailIndex} / ${rowStart + 3 + detailIndex}`
                        }}
                      >
                        {isEditing ? (
                          <Input
                            value={editValues[fieldMap.hexKey] || ''}
                            onChange={(e) => setEditValues({ ...editValues, [fieldMap.hexKey]: e.target.value })}
                            className="h-7 text-xs font-mono"
                            placeholder="#RRGGBB"
                          />
                        ) : (
                          detail.code
                        )}
                      </div>
                      <div 
                        className="border px-2 py-0.5 text-xs"
                        style={{ 
                          gridColumn: `${colStart + 3} / ${colStart + 4}`,
                          gridRow: `${rowStart + 2 + detailIndex} / ${rowStart + 3 + detailIndex}`
                        }}
                      >
                        {isEditing && detailIndex === 0 ? (
                          <Input
                            value={editValues.pages || ''}
                            onChange={(e) => setEditValues({ ...editValues, pages: e.target.value })}
                            className="h-7 text-xs"
                          />
                        ) : (
                          detail.pages
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ColorPresetsSection;