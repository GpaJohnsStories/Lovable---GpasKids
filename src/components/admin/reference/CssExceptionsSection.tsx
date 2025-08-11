import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, X, AlertTriangle, Code, FileText, Settings } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

// CSS Exception data with actual counts from codebase analysis
const cssExceptions = [
  {
    description: "Inline style objects in components",
    count: 438,
    codeExample: "style={{backgroundColor: '#f3f4f6', padding: '16px'}}",
    location: "Multiple components",
    type: "Performance" as const,
    status: "Needs Migration" as const,
  },
  {
    description: "Color specifications (hardcoded)",
    count: 395,
    codeExample: "style={{color: '#1f2937', backgroundColor: '#f59e0b'}}",
    location: "Text and background styling",
    type: "Maintainability" as const,
    status: "Needs Migration" as const,
  },
  {
    description: "Font family overrides in components",
    count: 234,
    codeExample: "style={{fontFamily: 'monospace', fontSize: '12px'}}",
    location: "Code display components",
    type: "Maintainability" as const,
    status: "Review Required" as const,
  },
  {
    description: "Background color specifications",
    count: 94,
    codeExample: "style={{backgroundColor: '#fbbf24', color: '#000'}}",
    location: "Button and banner components",
    type: "Maintainability" as const,
    status: "Needs Migration" as const,
  },
  {
    description: "Custom spacing (padding/margin)",
    count: 50,
    codeExample: "style={{padding: '12px 16px', margin: '8px 0'}}",
    location: "Layout and container components",
    type: "Maintainability" as const,
    status: "Needs Migration" as const,
  },
  {
    description: "Border styling customizations",
    count: 24,
    codeExample: "style={{borderColor: '#d97706', borderWidth: '2px'}}",
    location: "Form and input components",
    type: "Maintainability" as const,
    status: "Needs Migration" as const,
  },
  {
    description: "Absolute positioning layouts",
    count: 21,
    codeExample: "style={{position: 'absolute', top: '10px', right: '10px'}}",
    location: "Overlay and tooltip components",
    type: "Maintainability" as const,
    status: "Review Required" as const,
  },
  {
    description: "Direct dangerouslySetInnerHTML usage",
    count: 20,
    codeExample: "dangerouslySetInnerHTML={{__html: content}}",
    location: "Story content rendering",
    type: "Critical" as const,
    status: "Security Review" as const,
  },
  {
    description: "Transform and transition effects",
    count: 12,
    codeExample: "style={{transform: 'rotate(45deg)', transition: 'all 0.3s'}}",
    location: "Animation components",
    type: "Performance" as const,
    status: "Review Required" as const,
  },
  {
    description: "Z-index layering controls",
    count: 4,
    codeExample: "style={{zIndex: 9999, position: 'fixed'}}",
    location: "Modal and overlay components",
    type: "Intentional" as const,
    status: "Approved Exception" as const,
  },
];

type ExceptionType = "Critical" | "Performance" | "Maintainability" | "Legacy" | "Intentional";
type ExceptionStatus = "Needs Migration" | "Review Required" | "Approved Exception" | "Legacy Code" | "Security Review";

const CssExceptionsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ExceptionType | "">("");
  const [selectedStatus, setSelectedStatus] = useState<ExceptionStatus | "">("");

  // Get unique types and statuses
  const uniqueTypes = Array.from(new Set(cssExceptions.map(exception => exception.type)));
  const uniqueStatuses = Array.from(new Set(cssExceptions.map(exception => exception.status)));

  // Filter exceptions based on search term, type, and status
  const filteredExceptions = useMemo(() => {
    return cssExceptions.filter(exception => {
      const matchesSearch = 
        exception.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exception.codeExample.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exception.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !selectedType || exception.type === selectedType;
      const matchesStatus = !selectedStatus || exception.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedType, selectedStatus]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getTypeIcon = (type: ExceptionType) => {
    switch (type) {
      case "Critical":
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      case "Performance":
        return <FileText className="w-3 h-3 mr-1" />;
      case "Maintainability":
        return <Code className="w-3 h-3 mr-1" />;
      case "Intentional":
        return <Settings className="w-3 h-3 mr-1" />;
      default:
        return <Code className="w-3 h-3 mr-1" />;
    }
  };

  const getTypeBadgeVariant = (type: ExceptionType) => {
    switch (type) {
      case "Critical":
        return "destructive";
      case "Performance":
        return "outline";
      case "Maintainability":
        return "secondary";
      case "Legacy":
        return "secondary";
      case "Intentional":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: ExceptionStatus) => {
    switch (status) {
      case "Needs Migration":
        return "warning";
      case "Review Required":
        return "warning";
      case "Approved Exception":
        return "default";
      case "Security Review":
        return "destructive";
      case "Legacy Code":
        return "secondary";
      default:
        return "outline";
    }
  };

  const totalExceptions = cssExceptions.reduce((sum, exception) => sum + exception.count, 0);

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">CSS Exceptions Library</CardTitle>
              <p className="text-muted-foreground mt-1">
                Analysis of {cssExceptions.length} categories with {totalExceptions}+ total exceptions
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search exceptions by description, code, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ExceptionType | "")}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ExceptionStatus | "")}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Exception Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{cssExceptions.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{totalExceptions}+</div>
              <div className="text-sm text-muted-foreground">Total Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{cssExceptions.filter(e => e.status === "Needs Migration").length}</div>
              <div className="text-sm text-muted-foreground">Need Migration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{cssExceptions.filter(e => e.type === "Critical").length}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
          </div>

          {/* CSS Exceptions Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description & Count</TableHead>
                <TableHead>Code Example</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExceptions.map((exception, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{exception.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <Badge 
                          variant={exception.count >= 100 ? "destructive" : exception.count >= 50 ? "warning" : "outline"} 
                          className="text-xs"
                        >
                          {exception.count}{exception.count >= 50 ? "+" : ""} occurrences
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs max-w-xs">
                    <div className="truncate" title={exception.codeExample}>
                      {exception.codeExample}
                    </div>
                  </TableCell>
                  <TableCell>{exception.location}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(exception.type)} className="text-xs">
                      {getTypeIcon(exception.type)}
                      {exception.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(exception.status)} className="text-xs">
                      {exception.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
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
              <li>• <strong>Intentional:</strong> Justified exceptions for specific functionality</li>
            </ul>
            
            <p className="mt-4 mb-2">
              <strong>Status Classifications:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• <strong>Needs Migration:</strong> Should be converted to CSS classes</li>
              <li>• <strong>Review Required:</strong> Needs evaluation for best approach</li>
              <li>• <strong>Approved Exception:</strong> Justified for technical reasons</li>
              <li>• <strong>Security Review:</strong> Requires immediate security assessment</li>
              <li>• <strong>Legacy Code:</strong> Pending refactor in future updates</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default CssExceptionsSection;