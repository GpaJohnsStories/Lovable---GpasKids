import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, X, ChevronDown, ChevronUp, AlertTriangle, Code, FileText, Settings } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const CssLibrarySection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingClass, setEditingClass] = useState<any>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localSearchTerm]);

  const cssClasses = [
    // Typography - Font Family Utilities
    {
      name: "font-system",
      description: "System font family for UI elements",
      usage: "System UI, clean interfaces",
      previewContent: "System Font",
      category: "Typography",
      status: "active",
      notes: "New utility class replacing inline font-family styles"
    },
    {
      name: "font-georgia",
      description: "Georgia serif font for content",
      usage: "Story content, formal text",
      previewContent: "Georgia Font",
      category: "Typography",
      status: "active",
      notes: "New utility class for content readability"
    },
    {
      name: "font-kalam",
      description: "Kalam cursive font for friendly content",
      usage: "Fun text, child-friendly elements",
      previewContent: "Kalam Font",
      category: "Typography",
      status: "active",
      notes: "New utility class for playful typography"
    },
    {
      name: "font-georgia-base",
      description: "Georgia font with standard 18px size",
      usage: "Standard content text",
      previewContent: "Georgia 18px",
      category: "Typography",
      status: "active",
      notes: "Combined font family and size utility"
    },
    {
      name: "font-georgia-bold",
      description: "Georgia font bold variant",
      usage: "Emphasized content text",
      previewContent: "Georgia Bold",
      category: "Typography",
      status: "active",
      notes: "Bold Georgia text utility"
    },
    {
      name: "font-georgia-italic",
      description: "Georgia font italic variant",
      usage: "Emphasized or quoted content",
      previewContent: "Georgia Italic",
      category: "Typography",
      status: "active",
      notes: "Italic Georgia text utility"
    },
    {
      name: "font-georgia-center",
      description: "Georgia font with center alignment",
      usage: "Centered content text",
      previewContent: "Centered Georgia",
      category: "Typography",
      status: "active",
      notes: "Combined font and alignment utility"
    },
    {
      name: "text-18-system",
      description: "18px system font with italic styling",
      usage: "Descriptive text, captions",
      previewContent: "18px System Italic",
      category: "Typography",
      status: "active",
      notes: "Combined size, font, and style utility"
    },
    {
      name: "text-center-18-system",
      description: "Centered 18px system font italic",
      usage: "Centered descriptive text",
      previewContent: "Centered 18px System",
      category: "Typography",
      status: "active",
      notes: "Combines multiple text properties"
    },

    // Semantic Colors - Brand Color Tokens
    {
      name: "text-orange-accent",
      description: "Orange accent text using semantic token",
      usage: "Brand highlights, CTAs",
      previewContent: "Orange Accent",
      category: "Semantic Colors",
      status: "active",
      notes: "Uses --orange-accent token (#F97316)"
    },
    {
      name: "border-orange-accent",
      description: "Orange accent border using semantic token",
      usage: "Form borders, highlights",
      previewContent: "Orange Border",
      category: "Semantic Colors",
      status: "active",
      notes: "Semantic border color for consistency"
    },
    {
      name: "border-amber-border",
      description: "Amber border using semantic token",
      usage: "Form fields, containers",
      previewContent: "Amber Border",
      category: "Semantic Colors",
      status: "active",
      notes: "Uses --amber-border token (#9c441a)"
    },
    {
      name: "bg-warm-orange",
      description: "Warm orange background from design tokens",
      usage: "Brand sections, highlights",
      previewContent: "Warm Orange BG",
      category: "Semantic Colors",
      status: "active",
      notes: "Brand color from design system"
    },
    {
      name: "bg-light-blue-bg",
      description: "Light blue background semantic token",
      usage: "Calm sections, info areas",
      previewContent: "Light Blue BG",
      category: "Semantic Colors",
      status: "active",
      notes: "Uses --light-blue-bg token"
    },
    {
      name: "bg-crimson-red",
      description: "Crimson red for critical actions",
      usage: "Delete buttons, warnings",
      previewContent: "Crimson Red",
      category: "Semantic Colors",
      status: "active",
      notes: "Semantic token for critical states"
    },
    {
      name: "text-bright-yellow",
      description: "Bright yellow text for high contrast",
      usage: "Text on dark backgrounds",
      previewContent: "Bright Yellow",
      category: "Semantic Colors",
      status: "active",
      notes: "High contrast text color"
    },

    // Standard Tailwind Colors (Maintained)
    {
      name: "text-primary",
      description: "Primary brand text color",
      usage: "Brand elements, CTAs",
      previewContent: "Primary Text",
      category: "Semantic Colors",
      status: "active",
      notes: ""
    },
    {
      name: "text-secondary",
      description: "Secondary text color",
      usage: "Secondary content",
      previewContent: "Secondary Text",
      category: "Semantic Colors",
      status: "active",
      notes: ""
    },
    {
      name: "text-muted-foreground",
      description: "Muted text for secondary content",
      usage: "Descriptions, placeholders",
      previewContent: "Muted Text",
      category: "Semantic Colors",
      status: "active",
      notes: ""
    },
    {
      name: "text-destructive",
      description: "Error/danger text color",
      usage: "Error messages, warnings",
      previewContent: "Error Text",
      category: "Semantic Colors",
      status: "active",
      notes: ""
    },
    {
      name: "bg-primary",
      description: "Primary background color",
      usage: "Buttons, brand sections",
      previewContent: "Primary BG",
      category: "Semantic Colors",
      status: "active",
      notes: ""
    },
    {
      name: "bg-secondary",
      description: "Secondary background color",
      usage: "Alternative sections",
      previewContent: "Secondary BG",
      category: "Semantic Colors",
      status: "active",
      notes: ""
    },
    {
      name: "bg-muted",
      description: "Muted background for subtle sections",
      usage: "Cards, subtle backgrounds",
      previewContent: "Muted BG",
      category: "Semantic Colors",
      status: "active",
      notes: ""
    },

    // Layout & Spacing Utilities
    {
      name: "min-h-content",
      description: "Minimum height for content areas",
      usage: "Page containers",
      previewContent: "Min Height Content",
      category: "Layout & Spacing",
      status: "active",
      notes: "Custom utility for consistent page heights"
    },
    {
      name: "h-27-5",
      description: "Fixed height of 27.5px",
      usage: "Specific component sizing",
      previewContent: "Height 27.5px",
      category: "Layout & Spacing",
      status: "active",
      notes: "Custom height utility"
    },
    {
      name: "h-55",
      description: "Fixed height of 55px",
      usage: "Button sizing, icons",
      previewContent: "Height 55px",
      category: "Layout & Spacing",
      status: "active",
      notes: "Standard button height"
    },
    {
      name: "min-w-120",
      description: "Minimum width of 120px",
      usage: "Button minimum sizes",
      previewContent: "Min Width 120",
      category: "Layout & Spacing",
      status: "active",
      notes: "Button sizing utility"
    },
    {
      name: "absolute-center",
      description: "Absolute positioning with center transform",
      usage: "Overlay elements, modals",
      previewContent: "Absolute Center",
      category: "Layout & Spacing",
      status: "active",
      notes: "Common centering pattern"
    },

    // 3D Button System
    {
      name: "button-3d-base",
      description: "Base 3D button styling with shadows",
      usage: "Interactive buttons",
      previewContent: "3D Button Base",
      category: "3D Button System",
      status: "active",
      notes: "Foundation for all 3D buttons"
    },
    {
      name: "button-3d-green",
      description: "Green gradient 3D button",
      usage: "Success actions, positive CTAs",
      previewContent: "3D Green Button",
      category: "3D Button System",
      status: "active",
      notes: "Success state button styling"
    },
    {
      name: "button-3d-orange",
      description: "Orange gradient 3D button",
      usage: "Primary actions, brand CTAs",
      previewContent: "3D Orange Button",
      category: "3D Button System",
      status: "active",
      notes: "Primary brand button styling"
    },
    {
      name: "button-3d-red",
      description: "Red gradient 3D button",
      usage: "Destructive actions, warnings",
      previewContent: "3D Red Button",
      category: "3D Button System",
      status: "active",
      notes: "Destructive action styling"
    },
    {
      name: "button-3d-text-white",
      description: "White text for 3D buttons",
      usage: "High contrast button text",
      previewContent: "White Button Text",
      category: "3D Button System",
      status: "active",
      notes: "Standard button text color"
    },

    // Component-Specific Utilities
    {
      name: "search-input-amber",
      description: "Amber-styled search input",
      usage: "Search components",
      previewContent: "Search Input",
      category: "Component Utilities",
      status: "active",
      notes: "Search-specific styling"
    },
    {
      name: "code-indicator",
      description: "Code indicator positioning and styling",
      usage: "Code examples, technical content",
      previewContent: "Code Indicator",
      category: "Component Utilities",
      status: "active",
      notes: "Absolute positioned code labels"
    },
    {
      name: "bg-transparent-none",
      description: "Transparent background with no border",
      usage: "Reset buttons, clean elements",
      previewContent: "Transparent Reset",
      category: "Component Utilities",
      status: "active",
      notes: "Common reset pattern"
    },

    // Legacy Classes (Deprecated/Review)
    {
      name: "text-orange-800",
      description: "Dark orange text for brand elements",
      usage: "Headers, important text",
      previewContent: "Orange Text",
      category: "Legacy Colors",
      status: "deprecated",
      notes: "Should use semantic text-orange-accent instead"
    },
    {
      name: "text-amber-600",
      description: "Amber text for warm accents",
      usage: "Links, highlights",
      previewContent: "Amber Text",
      category: "Legacy Colors",
      status: "review",
      notes: "Consider migrating to semantic tokens"
    },
    {
      name: "bg-orange-50",
      description: "Very light orange background",
      usage: "Subtle section backgrounds",
      previewContent: "Light Orange BG",
      category: "Legacy Colors",
      status: "consolidate",
      notes: "Consider consolidating with semantic bg-muted"
    },
    {
      name: "font-fun",
      description: "Custom fun font family",
      usage: "Story titles, playful text",
      previewContent: "Fun Font",
      category: "Legacy Typography",
      status: "review",
      notes: "Should migrate to font-kalam for consistency"
    },

    // Complex Shadow Effects (Maintained)
    {
      name: "shadow-[0_6px_12px_rgba(22,101,52,0.3)]",
      description: "Complex 3D green shadow effect",
      usage: "Success buttons, donation CTAs",
      previewContent: "3D Green Shadow",
      category: "Complex Effects",
      status: "active",
      notes: "Performance optimized shadow"
    },
    {
      name: "shadow-[0_6px_12px_rgba(37,99,235,0.3)]",
      description: "Complex 3D blue shadow effect",
      usage: "Primary action buttons",
      previewContent: "3D Blue Shadow",
      category: "Complex Effects",
      status: "active",
      notes: "Primary button shadow"
    },
    {
      name: "hover:scale-105",
      description: "Subtle hover scale effect",
      usage: "Interactive elements",
      previewContent: "Hover Scale",
      category: "Complex Effects",
      status: "active",
      notes: "Standard interaction feedback"
    },
    {
      name: "transition-all duration-200",
      description: "Smooth transition for interactions",
      usage: "Interactive elements",
      previewContent: "Smooth Transition",
      category: "Complex Effects",
      status: "active",
      notes: "Standard transition timing"
    }
  ];

  // Categories for filtering
  const categories = [
    "all", "Typography", "Semantic Colors", "Layout & Spacing", 
    "3D Button System", "Component Utilities", "Complex Effects", 
    "Legacy Colors", "Legacy Typography"
  ];

  const statuses = ["all", "active", "deprecated", "review", "consolidate"];

  // Filter and sort classes
  const filteredClasses = useMemo(() => {
    return cssClasses.filter(cssClass => {
      const matchesSearch = 
        cssClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cssClass.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cssClass.usage.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || cssClass.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || cssClass.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [searchTerm, selectedCategory, selectedStatus, sortDirection]);

  // Helper functions
  const clearSearch = () => {
    setLocalSearchTerm("");
    setSearchTerm("");
  };

  const handleSort = () => {
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "review": return "secondary";
      case "consolidate": return "outline";
      case "deprecated": return "destructive";
      case "redundant": return "destructive";
      default: return "outline";
    }
  };

  const renderPreview = (cssClass: any) => {
    // Typography classes
    if (cssClass.name.startsWith("font-")) {
      return <div className={`${cssClass.name} text-center text-base`}>{cssClass.previewContent}</div>;
    }

    // Semantic color classes
    if (cssClass.name.includes("text-orange-accent") || cssClass.name.includes("text-bright-yellow")) {
      return <div className={`${cssClass.name} text-center text-base font-semibold`}>{cssClass.previewContent}</div>;
    }
    if (cssClass.name.includes("bg-") && !cssClass.name.includes("hover")) {
      return <div className={`${cssClass.name} text-white p-2 rounded text-center text-sm`}>{cssClass.previewContent}</div>;
    }

    // Default fallback
    return <div className="text-sm text-center p-1 bg-gray-50 rounded">{cssClass.previewContent}</div>;
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>CSS Library</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search classes by name, description, usage, category, or notes..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-10 pr-10 border-2 border-orange-200 focus:border-orange-400 text-black font-sans"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results Counter */}
          <div className="mb-2 text-sm text-muted-foreground">
            {searchTerm ? (
              <div className="flex items-center gap-2">
                <span>Found {filteredClasses.length} classes matching "{searchTerm}"</span>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearSearch}
                    className="h-6 px-2 text-xs"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <span>
                Showing {filteredClasses.length} of {cssClasses.length} classes
                {selectedStatus !== "all" && ` (${selectedStatus} status)`}
                {selectedCategory !== "all" && ` (${selectedCategory} category)`}
              </span>
            )}
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
              <th className="w-32 border border-amber-800 p-1 text-left break-words whitespace-normal max-w-0">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full border-amber-300 text-xs h-8">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </th>
              <th className="w-48 border border-amber-800 p-2 text-left break-words whitespace-normal max-w-0">Preview</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((cssClass, index) => (
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
                  <Badge variant={getStatusBadgeVariant(cssClass.status)} className="text-xs">
                    {cssClass.status}
                  </Badge>
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
    </TooltipProvider>
  );
};

export default CssLibrarySection;