import { useState } from "react";
import IconLibrarySection from "./reference/IconLibrarySection";
import PreferredColorsSection from "./reference/PreferredColorsSection";
import IconUploadSection from "./reference/IconUploadSection";
import CssLibrarySection from "./reference/CssLibrarySection";
import { Button } from "@/components/ui/button";

type SectionType = "colors" | "upload" | "icons" | "css" | "all";

const ReferenceDashboard = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("all");

  const sections = [
    { id: "colors" as const, label: "Color Library", component: <PreferredColorsSection /> },
    { id: "upload" as const, label: "Upload Icon", component: <IconUploadSection /> },
    { id: "icons" as const, label: "Icon Library", component: <IconLibrarySection /> },
    { id: "css" as const, label: "CSS Library", component: <CssLibrarySection /> },
  ];

  const handleSectionChange = (sectionId: SectionType) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSections = () => {
    if (activeSection === "all") {
      return sections.map((section, index) => (
        <div key={section.id}>
          {section.component}
        </div>
      ));
    }
    
    const selectedSection = sections.find(s => s.id === activeSection);
    return selectedSection ? selectedSection.component : null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Admin Reference
        </h2>
        <p className="text-muted-foreground">
          Reference materials and resources for administration
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg border">
        <Button
          variant={activeSection === "all" ? "default" : "outline"}
          onClick={() => handleSectionChange("all")}
          className="min-w-[120px]"
        >
          Show All
        </Button>
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            onClick={() => handleSectionChange(section.id)}
            className="min-w-[120px]"
          >
            {section.label}
          </Button>
        ))}
      </div>

      {/* Section Content */}
      <div className="space-y-8">
        {renderSections()}
      </div>
    </div>
  );
};

export default ReferenceDashboard;