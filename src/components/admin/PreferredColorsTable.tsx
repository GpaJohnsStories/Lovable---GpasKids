import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const PreferredColorsTable: React.FC = () => {
  // Hard-coded preferred colors for the children's story website
  const preferredColors = [
    { name: 'Warm Beige', hex: '#F5E6D3', description: 'Background warmth' },
    { name: 'Soft Gold', hex: '#E6C966', description: 'Accent highlights' },
    { name: 'Forest Green', hex: '#4A7C59', description: 'Nature elements' },
    { name: 'Sky Blue', hex: '#87CEEB', description: 'Calming blue' },
    { name: 'Sunset Orange', hex: '#FF8C42', description: 'Warm accent' },
    { name: 'Lavender', hex: '#E6E6FA', description: 'Gentle purple' },
    { name: 'Rose Pink', hex: '#F4C2C2', description: 'Soft pink' },
    { name: 'Cream White', hex: '#FFFDD0', description: 'Light base' },
    { name: 'Chocolate Brown', hex: '#8B4513', description: 'Earth tone' },
    { name: 'Sage Green', hex: '#9CAF88', description: 'Muted green' },
    { name: 'Dusty Blue', hex: '#6B8CAE', description: 'Calm blue' },
    { name: 'Peach', hex: '#FFCBA4', description: 'Warm tone' },
    { name: 'Ivory', hex: '#FFFFF0', description: 'Clean base' },
    { name: 'Coral', hex: '#FF7F7F', description: 'Cheerful red' },
    { name: 'Mint Green', hex: '#98FB98', description: 'Fresh accent' },
    { name: 'Soft Gray', hex: '#D3D3D3', description: 'Neutral tone' }
  ];

  // Organize colors into 4x4 grid
  const rows = [];
  for (let i = 0; i < preferredColors.length; i += 4) {
    rows.push(preferredColors.slice(i, i + 4));
  }

  return (
    <Card className="w-full bg-white shadow-lg rounded-2xl border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-black">
          Preferred Colors for Children's Stories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((color, colIndex) => (
                  <TableCell 
                    key={colIndex}
                    className="h-20 w-20 border border-gray-300 p-2 text-center"
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
                {/* Fill empty cells in the last row if needed */}
                {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, emptyIndex) => (
                  <TableCell 
                    key={`empty-${emptyIndex}`}
                    className="h-20 w-20 border border-gray-300"
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PreferredColorsTable;