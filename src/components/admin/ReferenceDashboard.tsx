import IconLibraryDisplay from "./IconLibraryDisplay";
import ColorReferenceTable from "./reference/ColorReferenceTable";
import IconUploadSection from "./reference/IconUploadSection";
import CssLibrarySection from "./reference/CssLibrarySection";
import CssExceptionsSection from "./reference/CssExceptionsSection";
import { Button } from "@/components/ui/button";

type SectionType = "colors" | "upload" | "icons" | "css" | "cssxx" | "top";

const ReferenceDashboard = () => {
  const sections = [
    { id: "colors" as const, label: "Color Library", component: <ColorReferenceTable /> },
    { id: "upload" as const, label: "Upload Icon", component: <IconUploadSection /> },
    { id: "icons" as const, label: "Icon Library", component: <IconLibraryDisplay /> },
    { id: "css" as const, label: "CSS Library", component: <CssLibrarySection /> },
    { id: "cssxx" as const, label: "CSS XX", component: <CssExceptionsSection /> },
  ];

  const handleSectionScroll = (sectionId: SectionType) => {
    if (sectionId === "top") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-black mb-2 font-system">
          Admin Reference
        </h2>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg border">
        <Button
          variant="outline"
          onClick={() => handleSectionScroll("top")}
          className="min-w-[120px]"
        >
          Scroll to Top
        </Button>
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="outline"
            onClick={() => handleSectionScroll(section.id)}
            className="min-w-[120px]"
          >
            {section.label}
          </Button>
        ))}
      </div>

      {/* Section Content - Always show all sections */}
      <div className="space-y-12">
        {sections.map((section) => (
          <div key={section.id} id={`section-${section.id}`} className="scroll-mt-24">
            {section.component}
          </div>
        ))}
      </div>

      {/* Floating Top Button */}
      <Button
        onClick={handleScrollToTop}
        className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 shadow-lg hover-scale"
        size="icon"
        title="Scroll to top"
      >
        Top
      </Button>
    </div>
  );
};

export default ReferenceDashboard;