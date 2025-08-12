import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ColorData {
  name: string;
  hex: string;
  grouping: 'Primary' | 'Secondary' | 'Other';
  usage: string[];
  notes: string;
}

type SortColumn = 'name' | 'hex' | 'grouping';
type SortDirection = 'asc' | 'desc';

const ColorReferenceTable = () => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const colorData: ColorData[] = [
    // Primary Brand Colors
    {
      name: "Orange - Warm",
      hex: "#FF8C42",
      grouping: "Primary",
      usage: ["Index page headers", "Button components"],
      notes: "Primary brand color for headers and buttons. Creates warm, welcoming feeling for children."
    },
    {
      name: "Orange - Deep",
      hex: "#D2691E",
      grouping: "Primary",
      usage: ["Button hover states", "Navigation elements"],
      notes: "Darker shade for hover states and interactive elements. Provides good contrast."
    },
    {
      name: "Yellow - Golden",
      hex: "#FFD700",
      grouping: "Primary",
      usage: ["Accent highlights", "Special buttons"],
      notes: "Accent color for highlights and special emphasis. Catches children's attention."
    },

    // Background Colors
    {
      name: "White - Cream",
      hex: "#FFF8DC",
      grouping: "Secondary",
      usage: ["Page backgrounds", "Main content areas"],
      notes: "Primary background, warm and comforting. Easy on eyes for extended reading."
    },
    {
      name: "Beige - Light",
      hex: "#F5F5DC",
      grouping: "Secondary",
      usage: ["Card backgrounds", "Secondary content areas"],
      notes: "Secondary background areas. Provides subtle contrast without being harsh."
    },
    {
      name: "Ivory - Soft",
      hex: "#FFFFF0",
      grouping: "Secondary",
      usage: ["Story content areas", "Comment sections"],
      notes: "Card backgrounds and content areas. Very gentle and readable."
    },

    // Text Colors
    {
      name: "Brown - Dark",
      hex: "#654321",
      grouping: "Primary",
      usage: ["Main text content", "Story titles"],
      notes: "Primary text color, easy to read. Good contrast with cream backgrounds."
    },
    {
      name: "Brown - Medium",
      hex: "#8B4513",
      grouping: "Secondary",
      usage: ["Secondary text", "Form labels"],
      notes: "Secondary text and labels. Softer than dark brown but still readable."
    },
    {
      name: "Brown - Light",
      hex: "#A0522D",
      grouping: "Secondary",
      usage: ["Muted text", "Descriptions"],
      notes: "Muted text and descriptions. Used for less important information."
    },

    // Interactive Elements
    {
      name: "Green - Forest",
      hex: "#228B22",
      grouping: "Other",
      usage: ["Success messages", "Positive actions"],
      notes: "Success states and positive actions. Universally understood positive color."
    },
    {
      name: "Blue - Sky",
      hex: "#87CEEB",
      grouping: "Other",
      usage: ["Information messages", "Links"],
      notes: "Information and links. Calm and trustworthy feeling."
    },
    {
      name: "Red - Coral",
      hex: "#FF6B6B",
      grouping: "Other",
      usage: ["Error messages", "Important notices"],
      notes: "Alerts and important notices. Attention-grabbing but not alarming."
    },

    // Special Effects
    {
      name: "Shadow - Soft",
      hex: "#0000001A",
      grouping: "Other",
      usage: ["Card shadows", "Depth effects"],
      notes: "Card shadows and depth (10% opacity). Creates subtle elevation."
    },
    {
      name: "Glow - Warm",
      hex: "#FFD70080",
      grouping: "Other",
      usage: ["Button glow effects", "Hover highlights"],
      notes: "Button glow effects (50% opacity). Adds magical feeling to interactions."
    },
    {
      name: "Highlight - Gentle",
      hex: "#FFF8DC80",
      grouping: "Other",
      usage: ["Hover states", "Selection highlights"],
      notes: "Hover highlights (50% opacity). Subtle feedback for user interactions."
    }
  ];

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...colorData].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    switch (sortColumn) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'hex':
        aValue = a.hex;
        bValue = b.hex;
        break;
      case 'grouping':
        aValue = a.grouping;
        bValue = b.grouping;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const SortableHeader = ({ column, children }: { column: SortColumn; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {children}
        <div className="flex flex-col">
          <ChevronUp 
            className={`h-3 w-3 ${
              sortColumn === column && sortDirection === 'asc' 
                ? 'text-primary' 
                : 'text-muted-foreground/30'
            }`} 
          />
          <ChevronDown 
            className={`h-3 w-3 -mt-1 ${
              sortColumn === column && sortDirection === 'desc' 
                ? 'text-primary' 
                : 'text-muted-foreground/30'
            }`} 
          />
        </div>
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Color Reference Table</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click column headers to sort. Colors organized by usage and importance.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Color Swatch</TableHead>
              <SortableHeader column="name">Color Name</SortableHeader>
              <SortableHeader column="hex">Hex Code</SortableHeader>
              <SortableHeader column="grouping">Grouping</SortableHeader>
              <TableHead className="w-48">Where Used</TableHead>
              <TableHead className="w-80">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((color, index) => (
              <TableRow key={index}>
                <TableCell className="p-4">
                  <div 
                    className="w-14 h-14 rounded border-2 border-muted-foreground/20 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} - ${color.hex}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {color.name}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {color.hex}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    color.grouping === 'Primary' 
                      ? 'bg-orange-100 text-orange-800' 
                      : color.grouping === 'Secondary'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {color.grouping}
                  </span>
                </TableCell>
                <TableCell className="text-sm">
                  <ul className="space-y-1">
                    {color.usage.map((use, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        • {use}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-80">
                  <div className="whitespace-normal break-words">
                    {color.notes}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ColorReferenceTable;