import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const CssLibrarySection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const cssClasses = [
    // Typography
    {
      name: "text-xs",
      description: "Extra small text (12px)",
      usage: "Captions, small labels",
      previewContent: "Extra Small Text",
      category: "Typography"
    },
    {
      name: "text-sm",
      description: "Small text (14px)",
      usage: "Body text, form labels",
      previewContent: "Small Text",
      category: "Typography"
    },
    {
      name: "text-base",
      description: "Base text size (16px)",
      usage: "Standard body text",
      previewContent: "Base Text",
      category: "Typography"
    },
    {
      name: "text-lg",
      description: "Large text (18px)",
      usage: "Subheadings",
      previewContent: "Large Text",
      category: "Typography"
    },
    {
      name: "text-xl",
      description: "Extra large text (20px)",
      usage: "Section headers",
      previewContent: "Extra Large Text",
      category: "Typography"
    },
    {
      name: "text-2xl",
      description: "2x large text (24px)",
      usage: "Page titles",
      previewContent: "2XL Text",
      category: "Typography"
    },
    {
      name: "text-3xl",
      description: "3x large text (30px)",
      usage: "Main headings",
      previewContent: "3XL Text",
      category: "Typography"
    },
    {
      name: "font-bold",
      description: "Bold font weight",
      usage: "Headings, emphasis",
      previewContent: "Bold Text",
      category: "Typography"
    },
    {
      name: "font-semibold",
      description: "Semi-bold font weight",
      usage: "Sub-headings, labels",
      previewContent: "Semi-Bold Text",
      category: "Typography"
    },
    {
      name: "font-medium",
      description: "Medium font weight",
      usage: "Table headers, buttons",
      previewContent: "Medium Text",
      category: "Typography"
    },
    {
      name: "font-fun",
      description: "Custom fun font family",
      usage: "Story titles, playful text",
      previewContent: "Fun Font",
      category: "Typography"
    },
    {
      name: "font-handwritten",
      description: "Custom handwritten font family",
      usage: "Personal notes, signatures",
      previewContent: "Handwritten Font",
      category: "Typography"
    },

    // Semantic Colors
    {
      name: "text-primary",
      description: "Primary brand text color",
      usage: "Brand elements, CTAs",
      previewContent: "Primary Text",
      category: "Semantic Colors"
    },
    {
      name: "text-secondary",
      description: "Secondary text color",
      usage: "Secondary content",
      previewContent: "Secondary Text",
      category: "Semantic Colors"
    },
    {
      name: "text-muted-foreground",
      description: "Muted text for secondary content",
      usage: "Descriptions, placeholders",
      previewContent: "Muted Text",
      category: "Semantic Colors"
    },
    {
      name: "text-destructive",
      description: "Error/danger text color",
      usage: "Error messages, warnings",
      previewContent: "Error Text",
      category: "Semantic Colors"
    },
    {
      name: "bg-primary",
      description: "Primary background color",
      usage: "Buttons, brand sections",
      previewContent: "Primary BG",
      category: "Semantic Colors"
    },
    {
      name: "bg-secondary",
      description: "Secondary background color",
      usage: "Alternative sections",
      previewContent: "Secondary BG",
      category: "Semantic Colors"
    },
    {
      name: "bg-muted",
      description: "Muted background for subtle sections",
      usage: "Cards, subtle backgrounds",
      previewContent: "Muted BG",
      category: "Semantic Colors"
    },
    {
      name: "bg-destructive",
      description: "Error/danger background",
      usage: "Error states, alerts",
      previewContent: "Error BG",
      category: "Semantic Colors"
    },

    // Brand Colors
    {
      name: "text-orange-800",
      description: "Dark orange text for brand elements",
      usage: "Headers, important text",
      previewContent: "Orange Text",
      category: "Brand Colors"
    },
    {
      name: "text-amber-600",
      description: "Amber text for warm accents",
      usage: "Links, highlights",
      previewContent: "Amber Text",
      category: "Brand Colors"
    },
    {
      name: "text-blue-800",
      description: "Dark blue for admin/system text",
      usage: "Admin sections, system info",
      previewContent: "Blue Text",
      category: "Brand Colors"
    },
    {
      name: "bg-orange-50",
      description: "Very light orange background",
      usage: "Subtle section backgrounds",
      previewContent: "Light Orange BG",
      category: "Brand Colors"
    },
    {
      name: "bg-amber-50",
      description: "Very light amber background",
      usage: "Warm section backgrounds",
      previewContent: "Light Amber BG",
      category: "Brand Colors"
    },
    {
      name: "bg-blue-50",
      description: "Very light blue background",
      usage: "Info sections, calm areas",
      previewContent: "Light Blue BG",
      category: "Brand Colors"
    },

    // Brand Gradients
    {
      name: "bg-gradient-to-r from-amber-600 to-orange-600",
      description: "Main brand gradient (amber to orange)",
      usage: "Headers, primary banners",
      previewContent: "Brand Gradient",
      category: "Brand Gradients"
    },
    {
      name: "bg-gradient-to-b from-orange-400 to-orange-600",
      description: "Orange vertical gradient",
      usage: "Buttons, cards",
      previewContent: "Orange Gradient",
      category: "Brand Gradients"
    },
    {
      name: "bg-gradient-to-b from-blue-500 to-blue-700",
      description: "Blue vertical gradient",
      usage: "Admin sections, info blocks",
      previewContent: "Blue Gradient",
      category: "Brand Gradients"
    },
    {
      name: "bg-gradient-to-b from-green-400 to-green-600",
      description: "Green vertical gradient",
      usage: "Success states, donation buttons",
      previewContent: "Green Gradient",
      category: "Brand Gradients"
    },
    {
      name: "bg-gradient-to-b from-purple-400 to-purple-600",
      description: "Purple vertical gradient",
      usage: "Special features, activity trackers",
      previewContent: "Purple Gradient",
      category: "Brand Gradients"
    },
    {
      name: "bg-gradient-to-b from-amber-50 to-orange-50",
      description: "Subtle warm gradient background",
      usage: "Help sections, modal backgrounds",
      previewContent: "Warm BG Gradient",
      category: "Brand Gradients"
    },

    // Layout & Spacing
    {
      name: "p-4",
      description: "Padding all sides (16px)",
      usage: "Card content, sections",
      previewContent: "Padding 4",
      category: "Layout & Spacing"
    },
    {
      name: "p-6",
      description: "Padding all sides (24px)",
      usage: "Larger card content",
      previewContent: "Padding 6",
      category: "Layout & Spacing"
    },
    {
      name: "p-8",
      description: "Padding all sides (32px)",
      usage: "Page sections, large containers",
      previewContent: "Padding 8",
      category: "Layout & Spacing"
    },
    {
      name: "m-4",
      description: "Margin all sides (16px)",
      usage: "Component spacing",
      previewContent: "Margin 4",
      category: "Layout & Spacing"
    },
    {
      name: "gap-4",
      description: "Flexbox/Grid gap (16px)",
      usage: "Flex layouts, form fields",
      previewContent: "Gap 4",
      category: "Layout & Spacing"
    },
    {
      name: "space-y-4",
      description: "Vertical spacing between children",
      usage: "Stacked elements",
      previewContent: "Space Y 4",
      category: "Layout & Spacing"
    },

    // Borders & Shadows
    {
      name: "border-2 border-amber-300",
      description: "Thick amber border",
      usage: "Tables, important containers",
      previewContent: "Amber Border",
      category: "Borders & Shadows"
    },
    {
      name: "border-2 border-orange-200",
      description: "Thick light orange border",
      usage: "Cards, sections",
      previewContent: "Orange Border",
      category: "Borders & Shadows"
    },
    {
      name: "shadow-lg",
      description: "Large shadow for elevation",
      usage: "Cards, modals",
      previewContent: "Large Shadow",
      category: "Borders & Shadows"
    },
    {
      name: "shadow-xl",
      description: "Extra large shadow",
      usage: "Major UI elements",
      previewContent: "XL Shadow",
      category: "Borders & Shadows"
    },
    {
      name: "rounded-lg",
      description: "Large border radius",
      usage: "Cards, buttons",
      previewContent: "Rounded Large",
      category: "Borders & Shadows"
    },
    {
      name: "rounded-xl",
      description: "Extra large border radius",
      usage: "Major containers",
      previewContent: "Rounded XL",
      category: "Borders & Shadows"
    },

    // Complex 3D Effects
    {
      name: "shadow-[0_6px_12px_rgba(22,101,52,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)]",
      description: "Complex 3D green button shadow",
      usage: "Donation buttons, success CTAs",
      previewContent: "3D Green Button",
      category: "Complex 3D Effects"
    },
    {
      name: "shadow-[0_6px_12px_rgba(37,99,235,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)]",
      description: "Complex 3D blue button shadow",
      usage: "Primary action buttons",
      previewContent: "3D Blue Button",
      category: "Complex 3D Effects"
    },
    {
      name: "hover:shadow-[0_8px_16px_rgba(22,101,52,0.4),0_4px_8px_rgba(0,0,0,0.15)]",
      description: "Enhanced 3D hover effect",
      usage: "Interactive buttons on hover",
      previewContent: "3D Hover Effect",
      category: "Complex 3D Effects"
    },
    {
      name: "hover:scale-105",
      description: "Slight scale increase on hover",
      usage: "Interactive elements",
      previewContent: "Hover Scale",
      category: "Complex 3D Effects"
    },
    {
      name: "transition-all duration-200",
      description: "Smooth transition for all properties",
      usage: "Interactive elements",
      previewContent: "Smooth Transition",
      category: "Complex 3D Effects"
    },

    // Custom CSS Classes
    {
      name: ".trust-badge",
      description: "Rounded badge with blue background",
      usage: "Footer, About page",
      previewContent: "Trust Badge",
      category: "Custom CSS"
    },
    {
      name: ".nav-bubble",
      description: "Navigation tooltip with pointer arrow",
      usage: "Navigation menus",
      previewContent: "Tooltip",
      category: "Custom CSS"
    },
    {
      name: ".help-scroll-area",
      description: "Enhanced scrollbar styling",
      usage: "Help sections",
      previewContent: "Scroll Area",
      category: "Custom CSS"
    }
  ];

  // Extract unique categories and create filtered data
  const categories = Array.from(new Set(cssClasses.map(cls => cls.category))).sort();
  
  // Filter by category first
  const categoryFilteredClasses = selectedCategory === "all" 
    ? cssClasses 
    : cssClasses.filter(cls => cls.category === selectedCategory);
    
  // Then apply sorting
  const filteredCssClasses = [...categoryFilteredClasses].sort((a, b) => {
    const compare = a.name.localeCompare(b.name);
    return sortDirection === 'asc' ? compare : -compare;
  });

  const handleSort = () => {
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const renderPreview = (cssClass: any) => {
    // Custom CSS classes
    if (cssClass.name === ".trust-badge") {
      return <div className="trust-badge">{cssClass.previewContent}</div>;
    }
    if (cssClass.name === ".nav-bubble") {
      return <div className="nav-bubble opacity-100 position-relative">{cssClass.previewContent}</div>;
    }
    if (cssClass.name === ".help-scroll-area") {
      return <div className="help-scroll-area h-8 overflow-y-auto border rounded p-1 text-xs">{cssClass.previewContent}</div>;
    }

    // Typography classes
    if (cssClass.name.startsWith("text-") && (cssClass.name.includes("xs") || cssClass.name.includes("sm") || cssClass.name.includes("base") || cssClass.name.includes("lg") || cssClass.name.includes("xl"))) {
      return <div className={`${cssClass.name} text-center`}>{cssClass.previewContent}</div>;
    }
    if (cssClass.name.startsWith("font-")) {
      return <div className={`${cssClass.name} text-center text-base`}>{cssClass.previewContent}</div>;
    }

    // Semantic color classes
    if (cssClass.name.includes("text-primary") || cssClass.name.includes("text-secondary") || cssClass.name.includes("text-muted") || cssClass.name.includes("text-destructive")) {
      return <div className={`${cssClass.name} text-center text-base`}>{cssClass.previewContent}</div>;
    }
    if (cssClass.name.includes("bg-primary") || cssClass.name.includes("bg-secondary") || cssClass.name.includes("bg-muted") || cssClass.name.includes("bg-destructive")) {
      return <div className={`${cssClass.name} text-white p-2 rounded text-center text-sm`}>{cssClass.previewContent}</div>;
    }

    // Brand color classes
    if (cssClass.name.includes("text-orange") || cssClass.name.includes("text-amber") || cssClass.name.includes("text-blue")) {
      return <div className={`${cssClass.name} text-center text-base font-semibold`}>{cssClass.previewContent}</div>;
    }
    if (cssClass.name.includes("bg-orange-50") || cssClass.name.includes("bg-amber-50") || cssClass.name.includes("bg-blue-50")) {
      return <div className={`${cssClass.name} p-2 rounded text-center text-sm text-gray-800 border`}>{cssClass.previewContent}</div>;
    }

    // Gradient classes
    if (cssClass.name.includes("bg-gradient")) {
      return <div className={`${cssClass.name} p-2 rounded text-white text-center text-sm font-semibold`}>{cssClass.previewContent}</div>;
    }

    // Layout & spacing classes
    if (cssClass.name.startsWith("p-") || cssClass.name.startsWith("m-") || cssClass.name.includes("gap-") || cssClass.name.includes("space-")) {
      return <div className={`bg-blue-100 border border-blue-300 rounded text-center text-xs ${cssClass.name}`}>{cssClass.previewContent}</div>;
    }

    // Border & shadow classes
    if (cssClass.name.includes("border-") && !cssClass.name.includes("hover")) {
      return <div className={`${cssClass.name} p-2 rounded text-center text-sm bg-white`}>{cssClass.previewContent}</div>;
    }
    if (cssClass.name.includes("shadow-") && !cssClass.name.includes("hover")) {
      return <div className={`${cssClass.name} p-2 bg-white rounded text-center text-sm`}>{cssClass.previewContent}</div>;
    }
    if (cssClass.name.includes("rounded-")) {
      return <div className={`${cssClass.name} p-2 bg-blue-500 text-white text-center text-sm`}>{cssClass.previewContent}</div>;
    }

    // Complex 3D effects and hover states
    if (cssClass.name.includes("shadow-[") || cssClass.name.includes("hover:") || cssClass.name.includes("transition-")) {
      return (
        <div className="relative">
          <div className={`p-2 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded text-center text-xs font-semibold cursor-pointer ${cssClass.name.includes("hover:") ? "" : cssClass.name}`}>
            {cssClass.previewContent}
          </div>
        </div>
      );
    }

    // Default fallback
    return <div className="text-sm text-center p-1 bg-gray-50 rounded">{cssClass.previewContent}</div>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CSS Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-sm text-muted-foreground">
          Showing {filteredCssClasses.length} of {cssClasses.length} classes
        </div>

        <table className="table-fixed border-2 border-blue-500 border-collapse w-full">
          <thead>
            <tr>
              <th 
                className="w-80 border border-amber-800 p-2 text-left break-words whitespace-normal max-w-0 cursor-pointer hover:bg-amber-50 select-none"
                onClick={handleSort}
              >
                Class Name{getSortIcon()}
              </th>
              <th className="w-96 border border-amber-800 p-2 text-left break-words whitespace-normal max-w-0">Description</th>
              <th className="w-64 border border-amber-800 p-2 text-left break-words whitespace-normal max-w-0">Used On</th>
              <th className="w-32 border border-amber-800 p-1 text-left break-words whitespace-normal max-w-0">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full border-amber-300 text-xs h-8">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </th>
              <th className="w-48 border border-amber-800 p-2 text-left break-words whitespace-normal max-w-0">Preview</th>
            </tr>
          </thead>
          <tbody>
            {filteredCssClasses.map((cssClass, index) => (
              <tr key={index}>
                <td className="border border-amber-800 p-2 break-words whitespace-normal font-mono text-xs max-w-0">
                  {cssClass.name}
                </td>
                <td className="border border-amber-800 p-2 break-words whitespace-normal max-w-0">
                  {cssClass.description}
                </td>
                <td className="border border-amber-800 p-2 break-words whitespace-normal max-w-0">
                  {cssClass.usage}
                </td>
                <td className="border border-amber-800 p-2 break-words whitespace-normal max-w-0">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {cssClass.category}
                  </span>
                </td>
                <td className="border border-amber-800 p-2 break-words whitespace-normal max-w-0">
                  {renderPreview(cssClass)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default CssLibrarySection;