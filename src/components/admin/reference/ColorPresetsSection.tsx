import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      >
        ABC\abc\123
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-black" style={{ fontSize: '21px' }}>
        Color Presets
      </h3>
      
      {/* Desktop Grid - Big Screen Only */}
      <div className="hidden lg:block overflow-x-auto">
        <div 
          className="grid gap-2 min-w-[1200px]"
          style={{ 
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridTemplateRows: 'repeat(17, minmax(0, 1fr))',
            fontSize: '21px'
          }}
        >
          {/* Headers Row */}
          <div className="col-span-1 font-bold border p-2 text-center bg-gray-100">
            Preset #<br />Name
          </div>
          <div className="col-span-1 font-bold border p-2 text-center bg-gray-100">
            Color Swatch
          </div>
          <div className="col-span-1 font-bold border p-2 text-center bg-gray-100">
            Names
          </div>
          <div className="col-span-1 font-bold border p-2 text-center bg-gray-100">
            Codes
          </div>
          <div className="col-span-1 font-bold border p-2 text-center bg-gray-100">
            Pages
          </div>
          <div className="col-span-1 font-bold border p-2 text-center bg-gray-100">
            Preset #<br />Name
          </div>
          <div className="col-span-1 font-bold border p-2 text-center bg-gray-100">
            Color Swatch
          </div>
          <div className="col-span-1 font-bold border p-2 text-center bg-gray-100">
            Names
          </div>
          <div className="col-span-1 font-bold border p-2 text-center bg-gray-100">
            Codes
          </div>
          <div className="col-span-1 font-bold border p-2 text-center bg-gray-100">
            Pages
          </div>

          {/* Render each preset */}
          {colorPresets.map((preset, presetIndex) => {
            const isLeftColumn = presetIndex < 4; // Presets 1-4 on left, 5-8 on right
            const colStart = isLeftColumn ? 1 : 6;
            const rowStart = isLeftColumn ? 2 + (presetIndex * 4) : 2 + ((presetIndex - 4) * 4);
            
            return (
              <React.Fragment key={`preset-${preset.number}`}>
                {/* Preset number and name - spans 4 rows */}
                <div 
                  className="border p-2 text-center font-bold flex flex-col items-center justify-center bg-gray-50"
                  style={{ 
                    gridColumn: `${colStart} / ${colStart + 1}`,
                    gridRow: `${rowStart} / ${rowStart + 4}`
                  }}
                >
                  <div className="text-lg">{preset.number}</div>
                  <div className="text-sm">{preset.name}</div>
                </div>
                
                {/* Color swatch - spans 4 rows */}
                <div 
                  className="border p-2 flex items-center justify-center"
                  style={{ 
                    gridColumn: `${colStart + 1} / ${colStart + 2}`,
                    gridRow: `${rowStart} / ${rowStart + 4}`
                  }}
                >
                  <ColorSwatch preset={preset} />
                </div>
                
                {/* Color details - 4 individual rows */}
                {preset.colorDetails.map((detail, detailIndex) => (
                  <React.Fragment key={`preset-${preset.number}-detail-${detailIndex}`}>
                    <div 
                      className="border p-2 text-sm"
                      style={{ 
                        gridColumn: `${colStart + 2} / ${colStart + 3}`,
                        gridRow: `${rowStart + detailIndex} / ${rowStart + detailIndex + 1}`
                      }}
                    >
                      {detail.name}
                    </div>
                    <div 
                      className="border p-2 text-xs font-mono"
                      style={{ 
                        gridColumn: `${colStart + 3} / ${colStart + 4}`,
                        gridRow: `${rowStart + detailIndex} / ${rowStart + detailIndex + 1}`
                      }}
                    >
                      {detail.code}
                    </div>
                    <div 
                      className="border p-2 text-xs"
                      style={{ 
                        gridColumn: `${colStart + 4} / ${colStart + 5}`,
                        gridRow: `${rowStart + detailIndex} / ${rowStart + detailIndex + 1}`
                      }}
                    >
                      {detail.pages}
                    </div>
                  </React.Fragment>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile/Tablet Notice */}
      <div className="lg:hidden p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-sm">Color Presets grid is available on large screens only.</p>
      </div>
    </div>
  );
};

export default ColorPresetsSection;