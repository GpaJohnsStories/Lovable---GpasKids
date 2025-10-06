import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ColorPresetSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface ColorPreset {
  id: string;
  name: string;
  background_color_hex: string;
  box_border_color_hex: string;
  font_color_hex: string;
}

const ColorPresetSelector: React.FC<ColorPresetSelectorProps> = ({ value, onChange }) => {
  const { data: presets, isLoading } = useQuery({
    queryKey: ['color-presets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('color_presets')
        .select('id, name, background_color_hex, box_border_color_hex, font_color_hex')
        .order('id');
      
      if (error) throw error;
      return data as ColorPreset[];
    }
  });

  if (isLoading) {
    return (
      <div className="h-8 px-4 py-2 rounded-full bg-gray-200 animate-pulse" style={{ minWidth: '200px' }}>
        <span className="text-sm text-gray-500">Loading presets...</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      {/* Red Dot 4 - Required field */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold z-50" style={{ backgroundColor: '#DC143C', color: '#FFD700', fontSize: '16px' }}>4</div>
      <Select value={value} onValueChange={onChange}>
      <SelectTrigger 
        className="h-8 rounded-full border-2 border-orange-500 bg-white hover:bg-orange-50 transition-colors"
        style={{ 
          minWidth: '220px',
          fontSize: '16px',
          fontFamily: 'Arial',
          fontWeight: 'bold'
        }}
      >
        <SelectValue placeholder="Select Color Preset" />
      </SelectTrigger>
      <SelectContent className="bg-white z-50 max-h-64">
        {presets?.map((preset) => (
          <SelectItem 
            key={preset.id} 
            value={preset.id}
            style={{ 
              fontSize: '16px',
              fontFamily: 'Arial',
              padding: '8px 12px'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-5 h-5 rounded border"
                  style={{ 
                    backgroundColor: preset.background_color_hex || '#FFFFFF',
                    borderColor: preset.box_border_color_hex || '#000000',
                    borderWidth: '2px'
                  }}
                />
                <div 
                  className="w-2 h-5"
                  style={{ 
                    backgroundColor: preset.font_color_hex || '#000000'
                  }}
                />
              </div>
              <span className="font-bold">{preset.id} - {preset.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </div>
  );
};

export default ColorPresetSelector;
