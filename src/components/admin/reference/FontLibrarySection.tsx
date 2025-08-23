import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type FontStyle = "Regular" | "Bold" | "Italic";
type SortOrder = "asc" | "desc";

interface FontData {
  fontFamily: string;
  fontName: string;
  style: FontStyle;
}

const FontLibrarySection = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const fontData: FontData[] = [
    { fontFamily: "Arial", fontName: "Arial", style: "Regular" },
    { fontFamily: "Arial", fontName: "Arial", style: "Bold" },
    { fontFamily: "Arial", fontName: "Arial", style: "Italic" },
    { fontFamily: "Georgia", fontName: "Georgia", style: "Regular" },
    { fontFamily: "Georgia", fontName: "Georgia", style: "Bold" },
    { fontFamily: "Georgia", fontName: "Georgia", style: "Italic" },
    { fontFamily: "Kalam/Fun", fontName: "Kalam", style: "Regular" },
    { fontFamily: "Kalam/Fun", fontName: "Kalam", style: "Bold" },
    { fontFamily: "Kalam/Fun", fontName: "Kalam", style: "Italic" },
  ];

  const sortedFontData = [...fontData].sort((a, b) => {
    const aHasAsterisk = a.fontFamily === "Arial" || a.fontFamily === "Georgia" || a.fontFamily === "Kalam/Fun";
    const bHasAsterisk = b.fontFamily === "Arial" || b.fontFamily === "Georgia" || b.fontFamily === "Kalam/Fun";
    
    // If one has asterisk and other doesn't, prioritize asterisk
    if (aHasAsterisk && !bHasAsterisk) return -1;
    if (!aHasAsterisk && bHasAsterisk) return 1;
    
    // If both have same asterisk status, sort by font name
    if (sortOrder === "asc") {
      return a.fontName.localeCompare(b.fontName);
    } else {
      return b.fontName.localeCompare(a.fontName);
    }
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getStyleAbbreviation = (style: FontStyle): string => {
    switch (style) {
      case "Regular": return "R";
      case "Bold": return "B";
      case "Italic": return "I";
      default: return style;
    }
  };

  const getFontStyle = (fontName: string, style: FontStyle): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontFamily: fontName === "Arial" ? "Arial, sans-serif" :
                  fontName === "Georgia" ? "Georgia, serif" :
                  fontName === "Kalam" ? "Kalam, cursive" : fontName,
      color: "black",
    };

    if (style === "Bold") {
      baseStyle.fontWeight = "bold";
    } else if (style === "Italic") {
      baseStyle.fontStyle = "italic";
    }

    return baseStyle;
  };

  const renderTextSample = (fontName: string, style: FontStyle, pointSize: number) => {
    const fontStyle = getFontStyle(fontName, style);
    return (
      <div className="text-center">
        <span 
          style={{
            ...fontStyle,
            fontSize: `${pointSize}pt`,
          }}
        >
          Aa
        </span>
      </div>
    );
  };

  const renderTextSamplePx = (fontName: string, style: FontStyle, pixelSize: number) => {
    const fontStyle = getFontStyle(fontName, style);
    return (
      <div className="text-center">
        <span 
          style={{
            ...fontStyle,
            fontSize: `${pixelSize}px`,
          }}
        >
          Aa
        </span>
      </div>
    );
  };

  return (
    <Card>
      <span id="fonts-anchor" className="absolute -top-24"></span>
      <CardHeader>
        <CardTitle className="text-h2 font-system text-foreground">Font Library</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground font-bold w-20 text-center">
                  <div className="whitespace-normal break-words">Font Family</div>
                </TableHead>
                <TableHead className="text-foreground font-bold w-20 text-center">
                  <Button 
                    variant="ghost" 
                    onClick={toggleSort}
                    className="p-0 h-auto font-bold hover:bg-muted w-full"
                  >
                    <div className="whitespace-normal break-words text-center">
                      Font Name {sortOrder === "asc" ? "↑" : "↓"}
                    </div>
                  </Button>
                </TableHead>
                <TableHead className="text-foreground font-bold min-w-[60px] text-center">Sty</TableHead>
                <TableHead className="text-foreground font-bold min-w-[80px] text-center" style={{backgroundColor: '#f97316', color: 'white'}}>Footer<br/>14 PT 19px</TableHead>
                <TableHead className="text-foreground font-bold min-w-[80px] text-center" style={{backgroundColor: '#60a5fa', color: 'white'}}>BODY<br/>16 PT 21px</TableHead>
                <TableHead className="text-foreground font-bold min-w-[80px] text-center" style={{backgroundColor: '#DC143C', color: 'white'}}>H3<br/>18 PT 24px</TableHead>
                <TableHead className="text-foreground font-bold min-w-[80px] text-center" style={{backgroundColor: '#DC143C', color: 'white'}}>H2<br/>23 PT 30px</TableHead>
                <TableHead className="text-foreground font-bold min-w-[80px] text-center" style={{backgroundColor: '#DC143C', color: 'white'}}>H1<br/>30 PT 40px</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFontData.map((font, index) => (
                <TableRow 
                  key={index}
                  className={font.fontFamily === "Arial" || font.fontFamily === "Georgia" || font.fontFamily === "Kalam/Fun" ? "bg-white" : ""}
                >
                  <TableCell className="text-foreground">{font.fontFamily}</TableCell>
                  <TableCell className="text-foreground">
                    {(font.fontFamily === "Arial" || font.fontFamily === "Georgia" || font.fontFamily === "Kalam/Fun") ? "*" : ""}{font.fontName}
                  </TableCell>
                  <TableCell className="text-foreground text-center">{getStyleAbbreviation(font.style)}</TableCell>
                  <TableCell>{renderTextSample(font.fontName, font.style, 14)}</TableCell>
                  <TableCell>
                    {renderTextSamplePx(font.fontName, font.style, 21)}
                  </TableCell>
                  <TableCell>
                    {renderTextSamplePx(font.fontName, font.style, 24)}
                  </TableCell>
                  <TableCell>{renderTextSamplePx(font.fontName, font.style, 30)}</TableCell>
                  <TableCell>{renderTextSamplePx(font.fontName, font.style, 40)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FontLibrarySection;