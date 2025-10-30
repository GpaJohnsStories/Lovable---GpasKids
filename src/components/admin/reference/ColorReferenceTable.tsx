import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ColorData {
  name: string;
  hex: string;
  grouping: 'Primary' | 'Secondary' | 'Other';
  howUsed: string[];
  whereUsed: string[];
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
      howUsed: ["Page headers", "Button components"],
      whereUsed: ["Index page", "Library page"],
      notes: "Primary brand color for headers and buttons. Creates warm, welcoming feeling for children."
    },
    {
      name: "Orange - Deep",
      hex: "#D2691E",
      grouping: "Primary",
      howUsed: ["Button hover states", "Navigation elements"],
      whereUsed: ["All pages", "Menu components"],
      notes: "Darker shade for hover states and interactive elements. Provides good contrast."
    },
    {
      name: "Orange - Rust",
      hex: "#F97316",
      grouping: "Primary",
      howUsed: ["Active buttons", "Current page indicators", "Border"],
      whereUsed: ["Admin Dashboard", "Navigation menu", "Guide Page, Story Library - Border", "Guide Page, Writing - Border"],
      notes: "Rust orange for active states and current selections. Strong visual emphasis."
    },
    {
      name: "Yellow - Golden",
      hex: "#FFD700",
      grouping: "Primary",
      howUsed: ["Accent highlights", "Special buttons"],
      whereUsed: ["Story pages", "Admin Dashboard"],
      notes: "Accent color for highlights and special emphasis. Catches children's attention."
    },
    {
      name: "Yellow - Bright",
      hex: "#FFFF00",
      grouping: "Other",
      howUsed: ["Warning highlights", "Attention grabbers"],
      whereUsed: ["Validation messages", "Important notices"],
      notes: "Pure yellow for strong warnings and alerts. High visibility color."
    },

    // Background Colors
    {
      name: "White - Cream",
      hex: "#FFF8DC",
      grouping: "Secondary",
      howUsed: ["Page backgrounds", "Main content areas"],
      whereUsed: ["Index page", "Library page", "Story pages"],
      notes: "Primary background, warm and comforting. Easy on eyes for extended reading."
    },
    {
      name: "Beige - Light",
      hex: "#F5F5DC",
      grouping: "Secondary",
      howUsed: ["Card backgrounds", "Secondary content areas"],
      whereUsed: ["Comment pages", "About page"],
      notes: "Secondary background areas. Provides subtle contrast without being harsh."
    },
    {
      name: "Ivory - Soft",
      hex: "#FFFFF0",
      grouping: "Secondary",
      howUsed: ["Story content areas", "Comment sections"],
      whereUsed: ["Story detail page", "Comment detail page"],
      notes: "Card backgrounds and content areas. Very gentle and readable."
    },

    // Text Colors
    {
      name: "Brown - Dark",
      hex: "#654321",
      grouping: "Primary",
      howUsed: ["Main text content", "Story titles"],
      whereUsed: ["All pages", "Story content"],
      notes: "Primary text color, easy to read. Good contrast with cream backgrounds."
    },
    {
      name: "Brown - Medium",
      hex: "#8B4513",
      grouping: "Secondary",
      howUsed: ["Secondary text", "Form labels"],
      whereUsed: ["Forms", "Admin pages"],
      notes: "Secondary text and labels. Softer than dark brown but still readable."
    },
    {
      name: "Brown - Light",
      hex: "#A0522D",
      grouping: "Secondary",
      howUsed: ["Muted text", "Descriptions"],
      whereUsed: ["Story metadata", "Comment timestamps"],
      notes: "Muted text and descriptions. Used for less important information."
    },
    {
      name: "Brown - Earth",
      hex: "#9c441a",
      grouping: "Secondary",
      howUsed: ["Section headers", "Category labels"],
      whereUsed: ["Admin sections", "Category displays"],
      notes: "Earth brown for section organization and categorization."
    },
    {
      name: "Brown - Wood",
      hex: "#814d2e",
      grouping: "Secondary",
      howUsed: ["Border colors", "Divider lines"],
      whereUsed: ["Card borders", "Section dividers"],
      notes: "Woody brown for subtle borders and visual separation."
    },

    // Interactive Elements
    {
      name: "Green - Primary",
      hex: "#16a34a",
      grouping: "Primary",
      howUsed: ["Success states", "Positive actions", "Nature themes", "Border"],
      whereUsed: ["Success buttons", "Confirmation messages", "Growth indicators", "Guide Page, Getting Started - Border"],
      notes: "Primary green for success and positive states. Strong, confident color."
    },
    {
      name: "Green - Bright",
      hex: "#22c55e",
      grouping: "Primary",
      howUsed: ["Bright success states", "Active elements", "Highlight text"],
      whereUsed: ["Active buttons", "Success notifications", "Positive feedback"],
      notes: "Brighter variant of green for more vibrant success states."
    },
    {
      name: "Green - Emerald",
      hex: "#10b981",
      grouping: "Primary",
      howUsed: ["Emerald accents", "Secondary success", "Nature elements"],
      whereUsed: ["Secondary buttons", "Badge colors", "Icon highlights"],
      notes: "Emerald green for sophisticated success states and nature themes."
    },
    {
      name: "Green - Dark",
      hex: "#059669",
      grouping: "Primary",
      howUsed: ["Dark success states", "Text on light backgrounds", "Deep accents"],
      whereUsed: ["Text colors", "Dark mode elements", "Strong emphasis"],
      notes: "Darker green for text and strong emphasis in success contexts."
    },
    {
      name: "Green - Forest",
      hex: "#228B22",
      grouping: "Other",
      howUsed: ["Success messages", "Positive actions", "Border", "Safety themes"],
      whereUsed: ["Form submissions", "Success pages", "Guide Page, We Are Safe! - Border"],
      notes: "Success states and positive actions. Forest green for safety and security themes."
    },
    {
      name: "Blue - Sky",
      hex: "#87CEEB",
      grouping: "Other",
      howUsed: ["Information messages", "Links"],
      whereUsed: ["Help pages", "Navigation links"],
      notes: "Information and links. Calm and trustworthy feeling."
    },
    {
      name: "Blue - Light",
      hex: "#ADD8E6", 
      grouping: "Other",
      howUsed: ["Secondary links", "Subtle highlights", "Border", "Information elements", "Background"],
      whereUsed: ["Secondary navigation", "Metadata links", "Guide Page, About Us - Border", "Home Page, SYS-WEL - Background"],
      notes: "Light blue for secondary interactive elements and subtle emphasis. Also used as welcoming background."
    },
    {
      name: "Blue - Admin/Deep",
      hex: "#2563eb",
      grouping: "Primary",
      howUsed: ["Admin interface", "Primary admin buttons", "Gradient backgrounds", "Accent elements"],
      whereUsed: ["Admin Dashboard", "Admin forms", "Home Page, Latest Announcements Banner - Gradient"],
      notes: "Primary admin interface color. Also used for deep blue gradient backgrounds and strong accents."
    },
    {
      name: "Red - Coral",
      hex: "#FF6B6B",
      grouping: "Other",
      howUsed: ["Error messages", "Important notices"],
      whereUsed: ["Error pages", "Validation messages"],
      notes: "Alerts and important notices. Attention-grabbing but not alarming."
    },
    {
      name: "Red - Crimson",
      hex: "#DC143C",
      grouping: "Other",
      howUsed: ["Critical errors", "Danger states"],
      whereUsed: ["Delete confirmations", "Critical warnings"],
      notes: "Deep red for critical actions and serious warnings. Strong attention signal."
    },

    // Special Effects
    {
      name: "Black - Shadow - Soft",
      hex: "#0000001A",
      grouping: "Other",
      howUsed: ["Card shadows", "Depth effects"],
      whereUsed: ["Story cards", "Comment cards"],
      notes: "Card shadows and depth (10% opacity). Creates subtle elevation."
    },
    {
      name: "Yellow - Glow - Warm",
      hex: "#FFD70080",
      grouping: "Other",
      howUsed: ["Button glow effects", "Hover highlights"],
      whereUsed: ["Interactive buttons", "Menu items"],
      notes: "Button glow effects (50% opacity). Adds magical feeling to interactions."
    },
    {
      name: "Cream - Highlight - Gentle",
      hex: "#FFF8DC80",
      grouping: "Other",
      howUsed: ["Hover states", "Selection highlights"],
      whereUsed: ["Table rows", "Interactive elements"],
      notes: "Hover highlights (50% opacity). Subtle feedback for user interactions."
    },
    
    // Guide Page Colors
    {
      name: "Red - Primary",
      hex: "#dc2626",
      grouping: "Primary",
      howUsed: ["Border", "Attention elements"],
      whereUsed: ["Guide Page, Home Page - Border"],
      notes: "Red to match buddy's home roof. Strong attention-grabbing color."
    },
    {
      name: "Blue - Primary",
      hex: "#3b82f6",
      grouping: "Primary",
      howUsed: ["Border", "Admin elements", "Gradient backgrounds", "Primary elements"],
      whereUsed: ["Guide Page, Read A Story - Border", "Home Page, Latest Announcements Banner - Gradient", "About Page, About Grandpa John - Border"],
      notes: "Blue same as admin top banner. Professional and trustworthy. Also used for announcement banners and About page borders."
    },
    {
      name: "Peach - Light",
      hex: "#FFCBA4",
      grouping: "Secondary",
      howUsed: ["Border", "Warm accents"],
      whereUsed: ["Guide Page, Comments List Page - Border"],
      notes: "Light peach for gentle, warm borders. Child-friendly color."
    },
    {
      name: "Peach - Darker",
      hex: "#E6A875",
      grouping: "Secondary",
      howUsed: ["Border", "Warm accents"],
      whereUsed: ["Guide Page, Write a Comment Page - Border"],
      notes: "Darker peach for slightly more emphasis while staying warm."
    },
    {
      name: "Blue - Light Guide",
      hex: "#60a5fa",
      grouping: "Secondary",
      howUsed: ["Border", "Information elements"],
      whereUsed: ["Guide Page, About Us - Border"],
      notes: "Light blue for informational sections. Calm and approachable."
    },
    {
      name: "Green - Forest Dark",
      hex: "#4A7C59",
      grouping: "Primary",
      howUsed: ["Border", "Safety themes"],
      whereUsed: ["Guide Page, We Are Safe! - Border"],
      notes: "Forest green for safety and security themes. Natural, protective feeling."
    },
    {
      name: "Green - Background Light",
      hex: "#16a34a33",
      grouping: "Other",
      howUsed: ["Background", "Subtle highlights"],
      whereUsed: ["Guide Page, Getting Started - Background"],
      notes: "Light green background (20% opacity). Gentle, success-oriented background."
    },
    {
      name: "Red - Background Light",
      hex: "#dc262633",
      grouping: "Other",
      howUsed: ["Background", "Subtle highlights"],
      whereUsed: ["Guide Page, Home Page - Background"],
      notes: "Light red background (20% opacity). Subtle warm background accent."
    },
    {
      name: "Orange - Background Light",
      hex: "#F9731633",
      grouping: "Other",
      howUsed: ["Background", "Subtle highlights"],
      whereUsed: ["Guide Page, Story Library - Background", "Guide Page, Writing - Background"],
      notes: "Light orange background (20% opacity). Warm, energetic background tone."
    },
    {
      name: "Blue - Background Light",
      hex: "#3b82f633",
      grouping: "Other",
      howUsed: ["Background", "Subtle highlights"],
      whereUsed: ["Guide Page, Read A Story - Background"],
      notes: "Light blue background (20% opacity). Calm, professional background."
    },
    {
      name: "Peach - Background Light",
      hex: "#FFCBA433",
      grouping: "Other",
      howUsed: ["Background", "Subtle highlights"],
      whereUsed: ["Guide Page, Comments List Page - Background"],
      notes: "Light peach background (20% opacity). Gentle, warm background tone."
    },
    {
      name: "Peach - Background Medium",
      hex: "#E6A87533",
      grouping: "Other",
      howUsed: ["Background", "Subtle highlights"],
      whereUsed: ["Guide Page, Write a Comment Page - Background"],
      notes: "Medium peach background (20% opacity). Slightly stronger warm background."
    },
    {
      name: "Blue - Background Soft",
      hex: "#60a5fa33",
      grouping: "Other",
      howUsed: ["Background", "Subtle highlights"],
      whereUsed: ["Guide Page, About Us - Background"],
      notes: "Soft blue background (20% opacity). Gentle informational background."
    },
    {
      name: "Emerald - Background Light",
      hex: "#047857",
      grouping: "Other",
      howUsed: ["Background", "Subtle highlights"],
      whereUsed: ["Guide Page, We Are Safe! - Background"],
      notes: "Light emerald background (20% opacity). Natural, safe feeling background."
    },
    
    // About Page Colors  
    {
      name: "Yellow - Medium Border",
      hex: "#facc15",
      grouping: "Primary",
      howUsed: ["Border", "Attention highlights"],
      whereUsed: ["About Page, About Buddy - Border", "Home Page, SYS-WEL - Border"],
      notes: "Medium yellow border for About Buddy section and welcome area. Warm, friendly, and cheerful."
    },
    {
      name: "Yellow - Gold Border",
      hex: "#eab308",
      grouping: "Primary",
      howUsed: ["Border", "Gold accents"],
      whereUsed: ["About Page, A Special Thank You - Border"],
      notes: "Gold yellow border for special sections. Premium, thankful feeling."
    },
    {
      name: "Purple - Light Background",
      hex: "#e9d5ff",
      grouping: "Secondary",
      howUsed: ["Background", "Special sections"],
      whereUsed: ["About Page, A Special Thank You - Background"],
      notes: "Light purple background for special thank you section. Gentle, appreciative tone."
    },
    // Home Page Colors
    {
      name: "Blue - Dark",
      hex: "#1d4ed8",
      grouping: "Primary",
      howUsed: ["Gradient backgrounds", "Deep accents"],
      whereUsed: ["Home Page, Latest Announcements Banner - Gradient"],
      notes: "Dark blue for gradient depth and strong visual impact."
    },
    {
      name: "Blue - Border Dark",
      hex: "#1e40af",
      grouping: "Primary",
      howUsed: ["Borders", "Shadow effects"],
      whereUsed: ["Home Page, Latest Announcements Banner - Border", "Home Page, Latest Announcements Banner - Shadow"],
      notes: "Dark blue for borders and shadow effects on announcement elements."
    },
    {
      name: "Blue - Light Background",
      hex: "#eff6ff",
      grouping: "Secondary",
      howUsed: ["Background", "Content areas"],
      whereUsed: ["Home Page, Announcement Box - Background"],
      notes: "Very light blue background (blue-50 with opacity). Gentle, readable background."
    },
    {
      name: "Blue - Light Border",
      hex: "#bfdbfe",
      grouping: "Secondary",
      howUsed: ["Border", "Subtle dividers"],
      whereUsed: ["Home Page, Announcement Box - Border"],
      notes: "Light blue borders for announcement boxes. Subtle but clear definition."
    },
    
    // SuperText Page Colors
    {
      name: "Purple - Video",
      hex: "#8b5cf6",
      grouping: "Primary",
      howUsed: ["Video buttons", "Media upload elements"],
      whereUsed: ["SuperText Page, Add Video File Button"],
      notes: "Purple color for video-related buttons and media upload elements. Strong, creative color for multimedia content."
    },
    
    // Color Preset Colors
    {
      name: "Beige - Tan",
      hex: "#e8d3c0",
      grouping: "Secondary",
      howUsed: ["Background", "Content areas"],
      whereUsed: ["Color Preset 1 - Story Text & Brown on Brown - Background"],
      notes: "Warm beige/tan background color. Comfortable reading background with brown text."
    },
    {
      name: "Black - Text",
      hex: "#333333",
      grouping: "Primary",
      howUsed: ["Text content", "High contrast text"],
      whereUsed: ["Color Presets 4, 5, 6, 7 - Font"],
      notes: "Dark gray (almost black) for high contrast text. Used in multiple color presets for readability."
    },
    {
      name: "Purple - Indigo",
      hex: "#6366f1",
      grouping: "Primary",
      howUsed: ["Border", "Accent elements"],
      whereUsed: ["Color Preset 5 - Black on Purple - Border"],
      notes: "Indigo purple for borders and accents. Modern, creative color for special sections."
    },
    {
      name: "Gray - Medium",
      hex: "#9ca3af",
      grouping: "Secondary",
      howUsed: ["Border", "Placeholder elements"],
      whereUsed: ["Color Preset 7 - To be set - Border"],
      notes: "Medium gray for borders and placeholder elements. Neutral color for unassigned presets."
    },
    {
      name: "Red - Dark Maroon",
      hex: "#8b0000",
      grouping: "Primary",
      howUsed: ["Background", "Strong emphasis"],
      whereUsed: ["Color Preset 8 - Yellow on Red - Background"],
      notes: "Dark maroon red background. Strong, dramatic color for high-contrast yellow text."
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
        <Table style={{ backgroundColor: '#FFF8DC' }}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Color Swatch</TableHead>
              <SortableHeader column="name">Color Name</SortableHeader>
              <SortableHeader column="hex">Hex Code</SortableHeader>
              <SortableHeader column="grouping">Grouping</SortableHeader>
              <TableHead className="w-48">How Used</TableHead>
              <TableHead className="w-48">Where Used</TableHead>
              <TableHead className="w-80">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((color, index) => (
              <TableRow key={index} className="h-16">
                <TableCell className="p-2">
                  <div 
                    className="w-14 h-14 rounded border-2 border-muted-foreground/20 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} - ${color.hex}`}
                  />
                </TableCell>
                <TableCell className="font-bold">
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
                    {color.howUsed.map((use, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        • {use}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="text-sm">
                  <ul className="space-y-1">
                    {color.whereUsed.map((where, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        • {where}
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