import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const PreferredColorsTable: React.FC = () => {
  // Organized preferred colors for the children's story website
  const colorGroups = [
    {
      title: "Primary Website Colors",
      colors: [
        { name: 'Bright Gold', hex: '#EAB308', description: 'Golden accent' },
        { name: 'Fresh Green', hex: '#16a34a', description: 'Vibrant nature' },
        { name: 'Sunset Orange', hex: '#FF8C42', description: 'Warm accent' },
        { name: 'Vibrant Orange', hex: '#F97316', description: 'Energetic tone' },
        { name: 'Warm Beige', hex: '#F5E6D3', description: 'Background warmth' },
        { name: 'Cream White', hex: '#FFFDD0', description: 'Light base' }
      ]
    },
    {
      title: "Supporting Website Colors", 
      colors: [
        { name: 'Forest Green', hex: '#4A7C59', description: 'Nature elements' },
        { name: 'Soft Gold', hex: '#E6C966', description: 'Accent highlights' },
        { name: 'Cherry Red', hex: '#DC2626', description: 'Bold accent' },
        { name: 'Peach', hex: '#FFCBA4', description: 'Warm tone' }
      ]
    },
    {
      title: "Other Colors - Use Sparingly",
      colors: [
        { name: 'Deep Green', hex: '#15803d', description: 'Forest depth' },
        { name: 'Rich Brown', hex: '#814d2e', description: 'Deep earth tone' },
        { name: 'Caramel', hex: '#a15c2a', description: 'Sweet brown' },
        { name: 'Rust Orange', hex: '#9c441a', description: 'Autumn warmth' },
        { name: 'Soft Gray', hex: '#D3D3D3', description: 'Neutral tone' },
        { name: 'Ivory', hex: '#FFFFF0', description: 'Clean base' }
      ]
    }
  ];

  // Organize all colors into 3x6 grid with section headers
  const allRows = [];
  
  colorGroups.forEach((group, groupIndex) => {
    // Add section header row
    allRows.push({
      type: 'header',
      title: group.title
    });
    
    // Add colors in rows of 3
    for (let i = 0; i < group.colors.length; i += 3) {
      const rowColors = group.colors.slice(i, i + 3);
      allRows.push({
        type: 'colors',
        colors: rowColors
      });
    }
  });

  return (
    <Card className="w-full bg-white shadow-lg rounded-2xl border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-black">
          Gpas Kids Preferred Colors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {allRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.type === 'header' ? (
                  <TableCell 
                    colSpan={3}
                    className="h-12 border border-gray-300 p-3 text-center bg-amber-100"
                  >
                    <div className="text-sm font-bold text-gray-800">
                      {row.title}
                    </div>
                  </TableCell>
                ) : (
                  <>
                    {row.colors.map((color, colIndex) => (
                      <TableCell 
                        key={colIndex}
                        className="h-20 w-32 border border-gray-300 p-2 text-center"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div 
                            className="w-12 h-12 rounded-lg border border-gray-400 shadow-sm"
                            style={{ backgroundColor: color.hex }}
                            title={`${color.name} - ${color.hex}`}
                          />
                          <div className="text-xs font-medium text-gray-700 leading-tight">
                            {color.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {color.hex}
                          </div>
                        </div>
                      </TableCell>
                    ))}
                    {/* Fill empty cells if needed */}
                    {row.colors.length < 3 && Array.from({ length: 3 - row.colors.length }).map((_, emptyIndex) => (
                      <TableCell 
                        key={`empty-${emptyIndex}`}
                        className="h-20 w-32 border border-gray-300"
                      />
                    ))}
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PreferredColorsTable;