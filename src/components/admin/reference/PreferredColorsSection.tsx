import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PreferredColorsSection = () => {
  const colorGroups = [
    {
      title: "Primary Brand Colors",
      colors: [
        { name: "Warm Orange", hex: "#FF8C42", description: "Primary brand color for headers and buttons" },
        { name: "Deep Orange", hex: "#D2691E", description: "Darker shade for hover states" },
        { name: "Golden Yellow", hex: "#FFD700", description: "Accent color for highlights" }
      ]
    },
    {
      title: "Background Colors",
      colors: [
        { name: "Cream White", hex: "#FFF8DC", description: "Primary background, warm and comforting" },
        { name: "Light Beige", hex: "#F5F5DC", description: "Secondary background areas" },
        { name: "Soft Ivory", hex: "#FFFFF0", description: "Card backgrounds and content areas" }
      ]
    },
    {
      title: "Text Colors",
      colors: [
        { name: "Dark Brown", hex: "#654321", description: "Primary text color, easy to read" },
        { name: "Medium Brown", hex: "#8B4513", description: "Secondary text and labels" },
        { name: "Light Brown", hex: "#A0522D", description: "Muted text and descriptions" }
      ]
    },
    {
      title: "Interactive Elements",
      colors: [
        { name: "Forest Green", hex: "#228B22", description: "Success states and positive actions" },
        { name: "Sky Blue", hex: "#87CEEB", description: "Information and links" },
        { name: "Coral Red", hex: "#FF6B6B", description: "Alerts and important notices" }
      ]
    },
    {
      title: "Special Effects",
      colors: [
        { name: "Soft Shadow", hex: "#0000001A", description: "Card shadows and depth (10% opacity)" },
        { name: "Warm Glow", hex: "#FFD70080", description: "Button glow effects (50% opacity)" },
        { name: "Gentle Highlight", hex: "#FFF8DC80", description: "Hover highlights (50% opacity)" }
      ]
    }
  ];

  // Flatten all colors into rows of 3
  const allRows: Array<{ type: 'header'; title: string } | { type: 'colors'; colors: Array<{ name: string; hex: string; description: string } | null> }> = [];
  
  colorGroups.forEach(group => {
    allRows.push({ type: 'header', title: group.title });
    
    for (let i = 0; i < group.colors.length; i += 3) {
      const rowColors = group.colors.slice(i, i + 3);
      // Pad with null to ensure 3 items per row
      while (rowColors.length < 3) {
        rowColors.push(null);
      }
      allRows.push({ type: 'colors', colors: rowColors });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Preferred Colors for Children's Story Website</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Color & Name</TableHead>
              <TableHead className="w-1/3">Color & Name</TableHead>
              <TableHead className="w-1/3">Color & Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allRows.map((row, index) => (
              <TableRow key={index}>
                {row.type === 'header' ? (
                  <TableCell colSpan={3} className="font-bold text-lg py-4 bg-muted">
                    {row.title}
                  </TableCell>
                ) : (
                  row.colors.map((color, colorIndex) => (
                    <TableCell key={colorIndex} className="p-4">
                      {color ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded border border-gray-300"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div>
                              <div className="font-medium">{color.name}</div>
                              <div className="text-sm text-muted-foreground">{color.hex}</div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {color.description}
                          </div>
                        </div>
                      ) : null}
                    </TableCell>
                  ))
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PreferredColorsSection;