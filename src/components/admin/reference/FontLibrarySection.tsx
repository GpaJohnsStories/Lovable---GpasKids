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
    { fontFamily: "System UI", fontName: "system-ui", style: "Regular" },
    { fontFamily: "System UI", fontName: "system-ui", style: "Bold" },
    { fontFamily: "System UI", fontName: "system-ui", style: "Italic" },
    { fontFamily: "Georgia", fontName: "Georgia", style: "Regular" },
    { fontFamily: "Georgia", fontName: "Georgia", style: "Bold" },
    { fontFamily: "Georgia", fontName: "Georgia", style: "Italic" },
    { fontFamily: "Kalam/Fun", fontName: "Kalam", style: "Regular" },
    { fontFamily: "Kalam/Fun", fontName: "Kalam", style: "Bold" },
    { fontFamily: "Kalam/Fun", fontName: "Kalam", style: "Italic" },
    { fontFamily: "Caveat", fontName: "Caveat", style: "Regular" },
    { fontFamily: "Caveat", fontName: "Caveat", style: "Bold" },
    { fontFamily: "Caveat", fontName: "Caveat", style: "Italic" },
    { fontFamily: "Monospace", fontName: "ui-monospace", style: "Regular" },
    { fontFamily: "Monospace", fontName: "ui-monospace", style: "Bold" },
    { fontFamily: "Monospace", fontName: "ui-monospace", style: "Italic" },
  ];

  const sortedFontData = [...fontData].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.fontName.localeCompare(b.fontName);
    } else {
      return b.fontName.localeCompare(a.fontName);
    }
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getFontStyle = (fontName: string, style: FontStyle): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontFamily: fontName === "system-ui" ? "system-ui, -apple-system, sans-serif" :
                  fontName === "Georgia" ? "Georgia, serif" :
                  fontName === "Kalam" ? "Kalam, cursive" :
                  fontName === "Caveat" ? "Caveat, cursive" :
                  fontName === "ui-monospace" ? "ui-monospace, monospace" : fontName,
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
      <span 
        style={{
          ...fontStyle,
          fontSize: `${pointSize}pt`,
        }}
      >
        Text
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h2 font-system text-foreground">Font Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground font-bold">Font Family</TableHead>
                <TableHead className="text-foreground font-bold">
                  <Button 
                    variant="ghost" 
                    onClick={toggleSort}
                    className="p-0 h-auto font-bold hover:bg-muted"
                  >
                    Font Name {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </TableHead>
                <TableHead className="text-foreground font-bold">Style</TableHead>
                <TableHead className="text-foreground font-bold">14 PT</TableHead>
                <TableHead className="text-foreground font-bold">16 PT</TableHead>
                <TableHead className="text-foreground font-bold">18 PT</TableHead>
                <TableHead className="text-foreground font-bold">20 PT</TableHead>
                <TableHead className="text-foreground font-bold">22 PT</TableHead>
                <TableHead className="text-foreground font-bold">24 PT</TableHead>
                <TableHead className="text-foreground font-bold">26 PT</TableHead>
                <TableHead className="text-foreground font-bold">28 PT</TableHead>
                <TableHead className="text-foreground font-bold">30 PT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFontData.map((font, index) => (
                <TableRow key={index}>
                  <TableCell className="text-foreground">{font.fontFamily}</TableCell>
                  <TableCell className="text-foreground">{font.fontName}</TableCell>
                  <TableCell className="text-foreground">{font.style}</TableCell>
                  <TableCell>{renderTextSample(font.fontName, font.style, 16)}</TableCell>
                  <TableCell className={font.style === "Regular" || font.style === "Bold" ? "bg-yellow-300" : ""}>
                    {renderTextSample(font.fontName, font.style, 16)}
                  </TableCell>
                  <TableCell className={font.style === "Italic" ? "bg-orange-200" : ""}>
                    {renderTextSample(font.fontName, font.style, 18)}
                  </TableCell>
                  <TableCell>{renderTextSample(font.fontName, font.style, 20)}</TableCell>
                  <TableCell>{renderTextSample(font.fontName, font.style, 22)}</TableCell>
                  <TableCell>{renderTextSample(font.fontName, font.style, 24)}</TableCell>
                  <TableCell>{renderTextSample(font.fontName, font.style, 26)}</TableCell>
                  <TableCell>{renderTextSample(font.fontName, font.style, 28)}</TableCell>
                  <TableCell>{renderTextSample(font.fontName, font.style, 30)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FontLibrarySection;