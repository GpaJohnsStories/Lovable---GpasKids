import React from 'react';

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
  // Color presets data based on existing implementations
  const colorPresets: ColorPreset[] = [
    {
      number: 1,
      name: 'Orange',
      borderColor: '#F97316',
      backgroundColor: 'rgba(249, 115, 22, 0.2)',
      fontColor: '#333333',
      colorDetails: [
        { name: 'Border', code: '#F97316', pages: '/guide - SYS-GeA' },
        { name: 'Photo Border', code: '#F97316', pages: '' },
        { name: 'Background', code: 'rgba(249, 115, 22, 0.2)', pages: '' },
        { name: 'Font', code: '#333333', pages: '' }
      ]
    },
    {
      number: 2,
      name: 'Green',
      borderColor: '#16a34a',
      backgroundColor: 'rgba(22, 163, 74, 0.2)',
      fontColor: '#333333',
      colorDetails: [
        { name: 'Border', code: '#16a34a', pages: '/guide - SYS-G1A' },
        { name: 'Photo Border', code: '#16a34a', pages: '' },
        { name: 'Background', code: 'rgba(22, 163, 74, 0.2)', pages: '' },
        { name: 'Font', code: '#333333', pages: '' }
      ]
    },
    {
      number: 3,
      name: 'Blue',
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fontColor: '#333333',
      colorDetails: [
        { name: 'Border', code: '#3b82f6', pages: '/guide - SYS-G3B' },
        { name: 'Photo Border', code: '#3b82f6', pages: '' },
        { name: 'Background', code: 'rgba(59, 130, 246, 0.2)', pages: '' },
        { name: 'Font', code: '#333333', pages: '' }
      ]
    },
    {
      number: 4,
      name: 'Purple',
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      fontColor: '#333333',
      colorDetails: [
        { name: 'Border', code: '#6366f1', pages: '/privacy - SYS-PR3' },
        { name: 'Photo Border', code: '#6366f1', pages: '' },
        { name: 'Background', code: 'rgba(99, 102, 241, 0.2)', pages: '' },
        { name: 'Font', code: '#333333', pages: '' }
      ]
    }
  ];

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
            const isLeftColumn = presetIndex < 2; // Presets 1-2 on left, 3-4 on right
            const colStart = isLeftColumn ? 1 : 6;
            const rowStart = isLeftColumn ? 2 + (presetIndex * 4) : 2 + ((presetIndex - 2) * 4);
            
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