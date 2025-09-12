import React from 'react';

interface ColorPreset {
  number: number;
  name: string;
  borderColor: string;
  borderColorName: string;
  photoBorderColor: string;
  photoBorderColorName: string;
  backgroundColor: string;
  backgroundColorName: string;
  fontColor: string;
  fontColorName: string;
  page: string;
  textCode: string;
}

const ColorPresetsSection = () => {
  // Color presets data based on existing implementations
  const colorPresets: ColorPreset[] = [
    {
      number: 1,
      name: 'Orange',
      borderColor: '#F97316',
      borderColorName: 'Orange-600',
      photoBorderColor: '#F97316',
      photoBorderColorName: 'Orange-600',
      backgroundColor: 'rgba(249, 115, 22, 0.2)',
      backgroundColorName: 'Orange-600/20',
      fontColor: '#333333',
      fontColorName: 'Gray-800',
      page: '/guide',
      textCode: 'SYS-GeA'
    },
    {
      number: 2,
      name: 'Green',
      borderColor: '#16a34a',
      borderColorName: 'Green-600',
      photoBorderColor: '#16a34a',
      photoBorderColorName: 'Green-600',
      backgroundColor: 'rgba(22, 163, 74, 0.2)',
      backgroundColorName: 'Green-600/20',
      fontColor: '#333333',
      fontColorName: 'Gray-800',
      page: '/guide',
      textCode: 'SYS-G1A'
    },
    {
      number: 3,
      name: 'Blue',
      borderColor: '#3b82f6',
      borderColorName: 'Blue-600',
      photoBorderColor: '#3b82f6',
      photoBorderColorName: 'Blue-600',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      backgroundColorName: 'Blue-600/20',
      fontColor: '#333333',
      fontColorName: 'Gray-800',
      page: '/guide',
      textCode: 'SYS-G3B'
    },
    {
      number: 4,
      name: 'Purple',
      borderColor: '#6366f1',
      borderColorName: 'Indigo-600',
      photoBorderColor: '#6366f1',
      photoBorderColorName: 'Indigo-600',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      backgroundColorName: 'Indigo-600/20',
      fontColor: '#333333',
      fontColorName: 'Gray-800',
      page: '/privacy',
      textCode: 'SYS-PR3'
    },
    // Empty presets for future use
    {
      number: 5,
      name: 'TBD',
      borderColor: '#000000',
      borderColorName: 'To be set',
      photoBorderColor: '#000000',
      photoBorderColorName: 'To be set',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backgroundColorName: 'To be set',
      fontColor: '#000000',
      fontColorName: 'To be set',
      page: 'TBD',
      textCode: 'TBD'
    },
    {
      number: 6,
      name: 'TBD',
      borderColor: '#000000',
      borderColorName: 'To be set',
      photoBorderColor: '#000000',
      photoBorderColorName: 'To be set',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backgroundColorName: 'To be set',
      fontColor: '#000000',
      fontColorName: 'To be set',
      page: 'TBD',
      textCode: 'TBD'
    },
    {
      number: 7,
      name: 'TBD',
      borderColor: '#000000',
      borderColorName: 'To be set',
      photoBorderColor: '#000000',
      photoBorderColorName: 'To be set',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backgroundColorName: 'To be set',
      fontColor: '#000000',
      fontColorName: 'To be set',
      page: 'TBD',
      textCode: 'TBD'
    },
    {
      number: 8,
      name: 'TBD',
      borderColor: '#000000',
      borderColorName: 'To be set',
      photoBorderColor: '#000000',
      photoBorderColorName: 'To be set',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backgroundColorName: 'To be set',
      fontColor: '#000000',
      fontColorName: 'To be set',
      page: 'TBD',
      textCode: 'TBD'
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
        ABC<br />abc<br />123
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

          {/* Data Rows */}
          {[0, 1, 2, 3].map((rowIndex) => {
            const leftPreset = colorPresets[rowIndex];
            const rightPreset = colorPresets[rowIndex + 4];
            
            return (
              <React.Fragment key={rowIndex}>
                {/* Left Side - Presets 1-4 */}
                {rowIndex === 0 ? (
                  <div className="row-span-4 border p-2 text-center font-bold flex items-center justify-center">
                    Preset {leftPreset.number}<br />{leftPreset.name}
                  </div>
                ) : null}
                
                {rowIndex === 0 ? (
                  <div className="row-span-4 border p-2">
                    <ColorSwatch preset={leftPreset} />
                  </div>
                ) : null}

                {/* Names column for left side */}
                <div className="border p-2 text-sm">
                  {rowIndex === 0 && leftPreset.borderColorName}
                  {rowIndex === 1 && leftPreset.photoBorderColorName}
                  {rowIndex === 2 && leftPreset.backgroundColorName}
                  {rowIndex === 3 && leftPreset.fontColorName}
                </div>

                {/* Codes column for left side */}
                <div className="border p-2 text-sm font-mono">
                  {rowIndex === 0 && leftPreset.borderColor}
                  {rowIndex === 1 && leftPreset.photoBorderColor}
                  {rowIndex === 2 && leftPreset.backgroundColor}
                  {rowIndex === 3 && leftPreset.fontColor}
                </div>

                {/* Pages column for left side */}
                <div className="border p-2 text-sm">
                  {rowIndex === 0 && `${leftPreset.page} - ${leftPreset.textCode}`}
                  {rowIndex === 1 && ''}
                  {rowIndex === 2 && ''}
                  {rowIndex === 3 && ''}
                </div>

                {/* Right Side - Presets 5-8 */}
                {rowIndex === 0 ? (
                  <div className="row-span-4 border p-2 text-center font-bold flex items-center justify-center">
                    Preset {rightPreset.number}<br />{rightPreset.name}
                  </div>
                ) : null}
                
                {rowIndex === 0 ? (
                  <div className="row-span-4 border p-2">
                    <ColorSwatch preset={rightPreset} />
                  </div>
                ) : null}

                {/* Names column for right side */}
                <div className="border p-2 text-sm">
                  {rowIndex === 0 && rightPreset.borderColorName}
                  {rowIndex === 1 && rightPreset.photoBorderColorName}
                  {rowIndex === 2 && rightPreset.backgroundColorName}
                  {rowIndex === 3 && rightPreset.fontColorName}
                </div>

                {/* Codes column for right side */}
                <div className="border p-2 text-sm font-mono">
                  {rowIndex === 0 && rightPreset.borderColor}
                  {rowIndex === 1 && rightPreset.photoBorderColor}
                  {rowIndex === 2 && rightPreset.backgroundColor}
                  {rowIndex === 3 && rightPreset.fontColor}
                </div>

                {/* Pages column for right side */}
                <div className="border p-2 text-sm">
                  {rowIndex === 0 && `${rightPreset.page} - ${rightPreset.textCode}`}
                  {rowIndex === 1 && ''}
                  {rowIndex === 2 && ''}
                  {rowIndex === 3 && ''}
                </div>
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