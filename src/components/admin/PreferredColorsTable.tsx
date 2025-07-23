import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const PreferredColorsTable: React.FC = () => {
  // Organized preferred colors for the children's story website
  const colorGroups = [
    {
      title: "Primary Website Colors",
      colors: [
        { name: 'Bright Gold', hex: '#EAB308', description: 'Best Used for: Primary buttons, story titles, magical elements, treasure themes, and positive highlights. Creates warmth and excitement for children. Perfect for "Grandpa\'s special moments" and celebration scenes.' },
        { name: 'Fresh Green', hex: '#16a34a', description: 'Best Used for: Nature stories, adventure themes, "go" buttons, positive feedback, and outdoor scenes. Represents growth, safety, and natural wonder. Ideal for forest adventures and garden tales.' },
        { name: 'Sunset Orange', hex: '#FF8C42', description: 'Best Used for: Warm story backgrounds, cozy evening scenes, autumn themes, and friendly characters. Creates a comforting "Grandpa\'s living room" atmosphere. Perfect for bedtime stories and fireside moments.' },
        { name: 'Vibrant Orange', hex: '#F97316', description: 'Best Used for: Action buttons, exciting moments, playful elements, and energetic characters. Captures children\'s attention without being overwhelming. Great for adventure calls-to-action and fun interactions.' },
        { name: 'Warm Beige', hex: '#F5E6D3', description: 'Best Used for: Content backgrounds, reading areas, story text containers, and calm sections. Provides excellent readability while maintaining warmth. Perfect for extended reading comfort and accessibility.' },
        { name: 'Cream White', hex: '#FFFDD0', description: 'Best Used for: Main page backgrounds, text overlays, clean sections, and peaceful story moments. Offers gentle contrast without harsh brightness. Ideal for creating safe, comfortable reading spaces.' }
      ]
    },
    {
      title: "Supporting Website Colors", 
      colors: [
        { name: 'Forest Green', hex: '#4A7C59', description: 'Best Used for: Deep nature themes, mysterious forest scenes, secondary navigation, and wisdom elements. Represents depth and knowledge. Perfect for "Grandpa\'s deep thoughts" and contemplative moments.' },
        { name: 'Soft Gold', hex: '#E6C966', description: 'Best Used for: Subtle highlights, gentle accents, story borders, and warm details. Provides golden warmth without overwhelming brightness. Great for decorative elements and gentle emphasis.' },
        { name: 'Cherry Red', hex: '#DC2626', description: 'Best Used for: Important alerts, special announcements, love themes, and emergency buttons. Use sparingly to maintain impact. Perfect for "important messages from Grandpa" and safety notifications.' },
        { name: 'Peach', hex: '#FFCBA4', description: 'Best Used for: Gentle backgrounds, soft character elements, caring themes, and nurturing content. Creates warmth and comfort. Ideal for family stories and tender moments between characters.' }
      ]
    },
    {
      title: "Other Colors - Use Sparingly",
      colors: [
        { name: 'Deep Green', hex: '#15803d', description: 'Best Used for: Dark forest scenes, serious story moments, deep wisdom themes, and grounding elements. Use for dramatic contrast and depth. Perfect for mysterious or profound story sections.' },
        { name: 'Rich Brown', hex: '#814d2e', description: 'Best Used for: Rustic elements, wooden textures, earth themes, and stable foundations. Represents reliability and natural comfort. Great for cabin settings and traditional story elements.' },
        { name: 'Caramel', hex: '#a15c2a', description: 'Best Used for: Sweet story themes, autumn scenes, cozy details, and warm accents. Evokes comfort food and homey feelings. Perfect for kitchen scenes and nurturing story moments.' },
        { name: 'Rust Orange', hex: '#9c441a', description: 'Best Used for: Autumn adventures, warm earth elements, vintage details, and traditional themes. Creates nostalgic warmth. Ideal for harvest stories and seasonal tale backgrounds.' },
        { name: 'Soft Gray', hex: '#D3D3D3', description: 'Best Used for: Neutral borders, subtle dividers, quiet backgrounds, and calm elements. Provides gentle separation without distraction. Perfect for organizing content peacefully.' },
        { name: 'Ivory', hex: '#FFFFF0', description: 'Best Used for: Clean text areas, pure backgrounds, fresh starts in stories, and peaceful moments. Offers the cleanest reading experience. Ideal for important text content and clarity.' }
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
                        className="border border-gray-300 p-3 align-top w-1/3 max-w-0"
                      >
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-center gap-2 w-full">
                            <div 
                              className="w-8 h-8 rounded-lg border border-gray-400 shadow-sm flex-shrink-0"
                              style={{ backgroundColor: color.hex }}
                              title={`${color.name} - ${color.hex}`}
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="text-xs font-bold text-gray-800 leading-tight">
                                {color.name}
                              </div>
                              <div className="text-xs text-gray-600 font-mono">
                                {color.hex}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-700 leading-relaxed text-left break-words">
                            {color.description}
                          </div>
                        </div>
                      </TableCell>
                    ))}
                    {/* Fill empty cells if needed */}
                    {row.colors.length < 3 && Array.from({ length: 3 - row.colors.length }).map((_, emptyIndex) => (
                      <TableCell 
                        key={`empty-${emptyIndex}`}
                        className="border border-gray-300 w-1/3 max-w-0"
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