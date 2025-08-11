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
    // Typography
    {
      name: "text-xs",
      description: "Extra small text (12px)",
      usage: "Captions, small labels",
      previewContent: "Extra Small Text",
      category: "Typography",
      status: "active",
      notes: ""
    },
    {
      name: "text-sm",
      description: "Small text (14px)",
      usage: "Body text, form labels",
      previewContent: "Small Text",
      category: "Typography",
      status: "active",
      notes: ""
    },
    {
      name: "text-base",
      description: "Base text size (16px)",
      usage: "Standard body text",
      previewContent: "Base Text",
      category: "Typography",
      status: "active",
      notes: ""
    },
    {
      name: "text-lg",
      description: "Large text (18px)",
      usage: "Subheadings",
      previewContent: "Large Text",
      category: "Typography",
      status: "consolidate",
      notes: "Consider consolidating with text-xl for fewer size variations"
    },
    {
      name: "text-xl",
      description: "Extra large text (20px)",
      usage: "Section headers",
      previewContent: "Extra Large Text",
      category: "Typography",
      status: "active",
      notes: ""
    },
    {
      name: "text-2xl",
      description: "2x large text (24px)",
      usage: "Page titles",
      previewContent: "2XL Text",
      category: "Typography",
      status: "active",
      notes: ""
    },
    {
      name: "text-3xl",
      description: "3x large text (30px)",
      usage: "Main headings",
      previewContent: "3XL Text",
      category: "Typography",
      status: "active",
      notes: ""
    },
    {
      name: "font-bold",
      description: "Bold font weight",
      usage: "Headings, emphasis",
      previewContent: "Bold Text",
      category: "Typography",
      status: "active",
      notes: ""
    },
    {
      name: "font-semibold",
      description: "Semi-bold font weight",
      usage: "Sub-headings, labels",
      previewContent: "Semi-Bold Text",
      category: "Typography",
      status: "consolidate",
      notes: "Review usage overlap with font-medium - may be redundant"
    },
    {
      name: "font-medium",
      description: "Medium font weight",
      usage: "Table headers, buttons",
      previewContent: "Medium Text",
      category: "Typography",
      status: "active",
      notes: ""
    },
    {
      name: "font-fun",
      description: "Custom fun font family",
      usage: "Story titles, playful text",
      previewContent: "Fun Font",
      category: "Typography",
      status: "active",
      notes: ""
    },
    {
      name: "font-handwritten",
      description: "Custom handwritten font family",
      usage: "Personal notes, signatures",
      previewContent: "Handwritten Font",
      category: "Typography",
      status: "review",
      notes: "Verify if this font is actually being used in production"
    },

    // Semantic Colors
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
    {
      name: "bg-destructive",
      description: "Error/danger background",
      usage: "Error states, alerts",
      previewContent: "Error BG",
      category: "Semantic Colors",
      status: "active",
      notes: ""
    },

    // Brand Colors
    {
      name: "text-orange-800",
      description: "Dark orange text for brand elements",
      usage: "Headers, important text",
      previewContent: "Orange Text",
      category: "Brand Colors",
      status: "deprecated",
      notes: "Should use semantic text-primary instead for consistency"
    },
    {
      name: "text-amber-600",
      description: "Amber text for warm accents",
      usage: "Links, highlights",
      previewContent: "Amber Text",
      category: "Brand Colors",
      status: "active",
      notes: ""
    },
    {
      name: "text-blue-800",
      description: "Dark blue for admin/system text",
      usage: "Admin sections, system info",
      previewContent: "Blue Text",
      category: "Brand Colors",
      status: "active",
      notes: ""
    },
    {
      name: "bg-orange-50",
      description: "Very light orange background",
      usage: "Subtle section backgrounds",
      previewContent: "Light Orange BG",
      category: "Brand Colors",
      status: "consolidate",
      notes: "Consider consolidating light background colors with bg-muted"
    },
    {
      name: "bg-amber-50",
      description: "Very light amber background",
      usage: "Warm section backgrounds",
      previewContent: "Light Amber BG",
      category: "Brand Colors",
      status: "consolidate",
      notes: "Consider consolidating light background colors with bg-muted"
    },
    {
      name: "bg-blue-50",
      description: "Very light blue background",
      usage: "Info sections, calm areas",
      previewContent: "Light Blue BG",
      category: "Brand Colors",
      status: "active",
      notes: ""
    },

    // Brand Gradients
    {
      name: "bg-gradient-to-r from-amber-600 to-orange-600",
      description: "Main brand gradient (amber to orange)",
      usage: "Headers, primary banners",
      previewContent: "Brand Gradient",
      category: "Brand Gradients",
      status: "active",
      notes: ""
    },
    {
      name: "bg-gradient-to-b from-orange-400 to-orange-600",
      description: "Orange vertical gradient",
      usage: "Buttons, cards",
      previewContent: "Orange Gradient",
      category: "Brand Gradients",
      status: "active",
      notes: ""
    },
    {
      name: "bg-gradient-to-b from-blue-500 to-blue-700",
      description: "Blue vertical gradient",
      usage: "Admin sections, info blocks",
      previewContent: "Blue Gradient",
      category: "Brand Gradients",
      status: "active",
      notes: ""
    },
    {
      name: "bg-gradient-to-b from-green-400 to-green-600",
      description: "Green vertical gradient",
      usage: "Success states, donation buttons",
      previewContent: "Green Gradient",
      category: "Brand Gradients",
      status: "active",
      notes: ""
    },
    {
      name: "bg-gradient-to-b from-purple-400 to-purple-600",
      description: "Purple vertical gradient",
      usage: "Special features, activity trackers",
      previewContent: "Purple Gradient",
      category: "Brand Gradients",
      status: "review",
      notes: "Verify if purple gradients are still being used"
    },
    {
      name: "bg-gradient-to-b from-amber-50 to-orange-50",
      description: "Subtle warm gradient background",
      usage: "Help sections, modal backgrounds",
      previewContent: "Warm BG Gradient",
      category: "Brand Gradients",
      status: "active",
      notes: ""
    },

    // Layout & Spacing
    {
      name: "p-4",
      description: "Padding all sides (16px)",
      usage: "Card content, sections",
      previewContent: "Padding 4",
      category: "Layout & Spacing",
      status: "active",
      notes: ""
    },
    {
      name: "p-6",
      description: "Padding all sides (24px)",
      usage: "Larger card content",
      previewContent: "Padding 6",
      category: "Layout & Spacing",
      status: "redundant",
      notes: "Too many padding variations - consider standardizing to p-4 and p-8 only"
    },
    {
      name: "p-8",
      description: "Padding all sides (32px)",
      usage: "Page sections, large containers",
      previewContent: "Padding 8",
      category: "Layout & Spacing",
      status: "active",
      notes: ""
    },
    {
      name: "m-4",
      description: "Margin all sides (16px)",
      usage: "Component spacing",
      previewContent: "Margin 4",
      category: "Layout & Spacing",
      status: "active",
      notes: ""
    },
    {
      name: "gap-4",
      description: "Flexbox/Grid gap (16px)",
      usage: "Flex layouts, form fields",
      previewContent: "Gap 4",
      category: "Layout & Spacing",
      status: "active",
      notes: ""
    },
    {
      name: "space-y-4",
      description: "Vertical spacing between children",
      usage: "Stacked elements",
      previewContent: "Space Y 4",
      category: "Layout & Spacing",
      status: "active",
      notes: ""
    },

    // Borders & Shadows
    {
      name: "border-2 border-amber-300",
      description: "Thick amber border",
      usage: "Tables, important containers",
      previewContent: "Amber Border",
      category: "Borders & Shadows",
      status: "active",
      notes: ""
    },
    {
      name: "border-2 border-orange-200",
      description: "Thick light orange border",
      usage: "Cards, sections",
      previewContent: "Orange Border",
      category: "Borders & Shadows",
      status: "active",
      notes: ""
    },
    {
      name: "shadow-lg",
      description: "Large shadow for elevation",
      usage: "Cards, modals",
      previewContent: "Large Shadow",
      category: "Borders & Shadows",
      status: "active",
      notes: ""
    },
    {
      name: "shadow-xl",
      description: "Extra large shadow",
      usage: "Major UI elements",
      previewContent: "XL Shadow",
      category: "Borders & Shadows",
      status: "active",
      notes: ""
    },
    {
      name: "rounded-lg",
      description: "Large border radius",
      usage: "Cards, buttons",
      previewContent: "Rounded Large",
      category: "Borders & Shadows",
      status: "active",
      notes: ""
    },
    {
      name: "rounded-xl",
      description: "Extra large border radius",
      usage: "Major containers",
      previewContent: "Rounded XL",
      category: "Borders & Shadows",
      status: "active",
      notes: ""
    },

    // Complex 3D Effects
    {
      name: "shadow-[0_6px_12px_rgba(22,101,52,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)]",
      description: "Complex 3D green button shadow",
      usage: "Donation buttons, success CTAs",
      previewContent: "3D Green Button",
      category: "Complex 3D Effects",
      status: "active",
      notes: ""
    },
    {
      name: "shadow-[0_6px_12px_rgba(37,99,235,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)]",
      description: "Complex 3D blue button shadow",
      usage: "Primary action buttons",
      previewContent: "3D Blue Button",
      category: "Complex 3D Effects",
      status: "active",
      notes: ""
    },
    {
      name: "hover:shadow-[0_8px_16px_rgba(22,101,52,0.4),0_4px_8px_rgba(0,0,0,0.15)]",
      description: "Enhanced 3D hover effect",
      usage: "Interactive buttons on hover",
      previewContent: "3D Hover Effect",
      category: "Complex 3D Effects",
      status: "active",
      notes: ""
    },
    {
      name: "hover:scale-105",
      description: "Slight scale increase on hover",
      usage: "Interactive elements",
      previewContent: "Hover Scale",
      category: "Complex 3D Effects",
      status: "active",
      notes: ""
    },
    {
      name: "transition-all duration-200",
      description: "Smooth transition for all properties",
      usage: "Interactive elements",
      previewContent: "Smooth Transition",
      category: "Complex 3D Effects",
      status: "active",
      notes: ""
    },

    // Custom CSS Classes
    {
      name: ".trust-badge",
      description: "Rounded badge with blue background",
      usage: "Footer, About page",
      previewContent: "Trust Badge",
      category: "Custom CSS",
      status: "active",
      notes: ""
    },
    {
      name: ".nav-bubble",
      description: "Navigation tooltip with pointer arrow",
      usage: "Navigation menus",
      previewContent: "Tooltip",
      category: "Custom CSS",
      status: "active",
      notes: ""
    },
    {
      name: ".help-scroll-area",
      description: "Enhanced scrollbar styling",
      usage: "Help sections",
      previewContent: "Scroll Area",
      category: "Custom CSS",
      status: "active",
      notes: ""
    }
  ];

  // Extract unique categories and statuses
  const categories = Array.from(new Set(cssClasses.map(cls => cls.category))).sort();
  const statuses = Array.from(new Set(cssClasses.map(cls => cls.status))).sort();
  
  // Apply all filters: search, category, and status
  const filteredCssClasses = useMemo(() => {
    let filtered = cssClasses;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(cls => 
        cls.name.toLowerCase().includes(searchLower) ||
        cls.description.toLowerCase().includes(searchLower) ||
        cls.usage.toLowerCase().includes(searchLower) ||
        cls.category.toLowerCase().includes(searchLower) ||
        cls.status.toLowerCase().includes(searchLower) ||
        (cls.notes && cls.notes.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(cls => cls.category === selectedCategory);
    }
    
    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(cls => cls.status === selectedStatus);
    }
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      const compare = a.name.localeCompare(b.name);
      return sortDirection === 'asc' ? compare : -compare;
    });
  }, [cssClasses, searchTerm, selectedCategory, selectedStatus, sortDirection]);

  // Clear search function
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
      case "active": return "success";
      case "review": return "warning";
      case "consolidate": return "info";
      case "deprecated": return "destructive";
      case "redundant": return "destructive";
      default: return "default";
    }
  };

  const updateClassStatus = (index: number, newStatus: string, newNotes: string) => {
    // This would update the cssClasses array - in a real app, this would be saved to backend
    console.log(`Updating class ${cssClasses[index].name} to status: ${newStatus}, notes: ${newNotes}`);
    // For now, just close the dialog
    setEditingClass(null);
    setEditNotes("");
  };

  const openEditDialog = (cssClass: any) => {
    setEditingClass(cssClass);
    setEditNotes(cssClass.notes || "");
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
                <span>Found {filteredCssClasses.length} classes matching "{searchTerm}"</span>
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
                Showing {filteredCssClasses.length} of {cssClasses.length} classes
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-pointer" onClick={() => openEditDialog(cssClass)}>
                        <Badge variant={getStatusBadgeVariant(cssClass.status)} className="text-xs">
                          {cssClass.status}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        {cssClass.notes || "No notes"}
                        <br />
                        <span className="text-muted-foreground">Click to edit</span>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-amber-800 p-2 break-words whitespace-normal max-w-0">
                  {renderPreview(cssClass)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={editingClass !== null} onOpenChange={(open) => !open && setEditingClass(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit CSS Class Status</DialogTitle>
            </DialogHeader>
            {editingClass && (
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {editingClass.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {editingClass.description}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={editingClass.status} 
                    onValueChange={(value) => setEditingClass({...editingClass, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="consolidate">Consolidate</SelectItem>
                      <SelectItem value="deprecated">Deprecated</SelectItem>
                      <SelectItem value="redundant">Redundant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes about consolidation, deprecation, or removal..."
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingClass(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => updateClassStatus(
                    cssClasses.findIndex(c => c.name === editingClass.name),
                    editingClass.status,
                    editNotes
                  )}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* CSS Exceptions Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-orange-800">CSS Exceptions</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Inline styles and CSS exceptions found throughout the codebase that should be reviewed for migration to the CSS library.
          </p>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5">Description</TableHead>
                <TableHead className="w-1/3">Code Example</TableHead>
                <TableHead className="w-1/6">Location</TableHead>
                <TableHead className="w-1/8">Type</TableHead>
                <TableHead className="w-1/8">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Font family override in Input component</TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{fontFamily: 'Arial, sans-serif', fontStyle: 'normal', color: 'black'}}"}
                </TableCell>
                <TableCell>src/components/ui/input.tsx:15</TableCell>
                <TableCell>
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Critical
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Needs Migration</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Inline style objects in components</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">438 occurrences</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{backgroundColor: '#f3f4f6', padding: '16px'}}"}
                </TableCell>
                <TableCell>Multiple components</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Performance
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Needs Migration</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Color specifications (hardcoded)</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">395 occurrences</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{color: '#1f2937', backgroundColor: '#f59e0b'}}"}
                </TableCell>
                <TableCell>Text and background styling</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Maintainability
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Needs Migration</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Font family overrides in components</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">234 occurrences</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{fontFamily: 'monospace', fontSize: '12px'}}"}
                </TableCell>
                <TableCell>Code display components</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Maintainability
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Review Required</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Background color specifications</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">94 occurrences</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{backgroundColor: '#fbbf24', color: '#000'}}"}
                </TableCell>
                <TableCell>Button and banner components</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Maintainability
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Needs Migration</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Custom spacing (padding/margin)</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">50+ occurrences</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{padding: '12px 16px', margin: '8px 0'}}"}
                </TableCell>
                <TableCell>Layout and container components</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Maintainability
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Needs Migration</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Border styling customizations</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">24 occurrences</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{borderColor: '#d97706', borderWidth: '2px'}}"}
                </TableCell>
                <TableCell>Form and input components</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Maintainability
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Needs Migration</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Absolute positioning layouts</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">21 occurrences</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{position: 'absolute', top: '10px', right: '10px'}}"}
                </TableCell>
                <TableCell>Overlay and tooltip components</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Maintainability
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Review Required</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Direct dangerouslySetInnerHTML usage</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Badge variant="destructive" className="text-xs">20 occurrences</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {"dangerouslySetInnerHTML={{__html: content}}"}
                </TableCell>
                <TableCell>Story content rendering</TableCell>
                <TableCell>
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Critical
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive" className="text-xs">Security Review</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Transform and transition effects</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">12 occurrences</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{transform: 'rotate(45deg)', transition: 'all 0.3s'}}"}
                </TableCell>
                <TableCell>Animation components</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Performance
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Review Required</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Z-index layering controls</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">4 occurrences</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{zIndex: 9999, position: 'fixed'}}"}
                </TableCell>
                <TableCell>Modal and overlay components</TableCell>
                <TableCell>
                  <Badge variant="default" className="text-xs">
                    <Settings className="w-3 h-3 mr-1" />
                    Intentional
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="text-xs">Approved Exception</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>Background color overrides</TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{backgroundColor: '#f59e0b'}}"}
                </TableCell>
                <TableCell>Story components</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Maintainability
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Needs Migration</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>Fixed positioning for modals</TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{position: 'fixed', zIndex: 9999}}"}
                </TableCell>
                <TableCell>Modal components</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Performance
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="text-xs">Approved Exception</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>DangerouslySetInnerHTML usage</TableCell>
                <TableCell className="font-mono text-xs">
                  {"dangerouslySetInnerHTML={{__html: content}}"}
                </TableCell>
                <TableCell>Story content renderers</TableCell>
                <TableCell>
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Critical
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive" className="text-xs">Security Review</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>Custom border styles</TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{border: '2px solid #f59e0b', borderRadius: '8px'}}"}
                </TableCell>
                <TableCell>Card components</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Maintainability
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Needs Migration</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>Transform and transition effects</TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{transform: 'scale(1.05)', transition: 'all 0.2s'}}"}
                </TableCell>
                <TableCell>Interactive elements</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Performance
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Review Required</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>Width and height constraints</TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{width: '100%', maxWidth: '800px', height: 'auto'}}"}
                </TableCell>
                <TableCell>Layout components</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Maintainability
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Needs Migration</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>Text color and font overrides</TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{color: '#1f2937', fontSize: '14px', fontWeight: 'bold'}}"}
                </TableCell>
                <TableCell>Text components</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Maintainability
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Needs Migration</Badge>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>Box shadow customizations</TableCell>
                <TableCell className="font-mono text-xs">
                  {"style={{boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}"}
                </TableCell>
                <TableCell>Card and button components</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Performance
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" className="text-xs">Review Required</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Exception Types:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• <strong>Critical:</strong> Security risks or functionality breaking changes</li>
              <li>• <strong>Performance:</strong> Inline styles affecting render performance</li>
              <li>• <strong>Maintainability:</strong> Hardcoded values that should use design system</li>
              <li>• <strong>Legacy:</strong> Old patterns pending migration</li>
            </ul>
            
            <p className="mt-4 mb-2">
              <strong>Status Classifications:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• <strong>Needs Migration:</strong> Should be converted to CSS classes</li>
              <li>• <strong>Review Required:</strong> Needs evaluation for best approach</li>
              <li>• <strong>Approved Exception:</strong> Justified for technical reasons</li>
              <li>• <strong>Security Review:</strong> Requires immediate security assessment</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};

export default CssLibrarySection;