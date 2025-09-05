import { Helmet } from "react-helmet-async";
import IconLibraryDisplay from "./IconLibraryDisplay";
import ColorReferenceTable from "./reference/ColorReferenceTable";
import IconUploadSection from "./reference/IconUploadSection";
import FontLibrarySection from "./reference/FontLibrarySection";
import CssLibrarySection from "./reference/CssLibrarySection";
import CssExceptionsSection from "./reference/CssExceptionsSection";
import WebTextInventorySection from "./reference/WebTextInventorySection";
import { Button } from "@/components/ui/button";
import { BUILD_ID } from "@/utils/buildInfo";

type SectionType = "colors" | "upload" | "icons" | "fonts" | "css" | "cssxx" | "webtext" | "top";

const ReferenceDashboard = () => {
  const sections = [
    { id: "colors" as const, label: "Color Library", component: <ColorReferenceTable /> },
    { id: "upload" as const, label: "Upload Icon", component: <IconUploadSection /> },
    { id: "icons" as const, label: "Icon Library", component: <IconLibraryDisplay /> },
    { id: "fonts" as const, label: "Font Library", component: <FontLibrarySection /> },
    { id: "webtext" as const, label: "WebText Inventory", component: <WebTextInventorySection /> },
    { id: "css" as const, label: "CSS Library", component: <CssLibrarySection /> },
    { id: "cssxx" as const, label: "CSS XX", component: <CssExceptionsSection /> },
  ];

  // Log sections for debugging
  console.log("📚 ReferenceDashboard sections:", sections.map(s => ({ id: s.id, label: s.label })));

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
    <>
      <Helmet><title>Reference</title></Helmet>
      <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-black mb-2 font-system">
          Admin Reference
        </h2>
        <p className="text-sm text-muted-foreground">Build: {BUILD_ID}</p>
      </div>

      {/* Navigation Buttons - Sticky Menu */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border/40 py-4">
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
        className="fixed bottom-6 left-6 z-50 rounded-full w-12 h-12 shadow-lg hover-scale"
        size="icon"
        title="Scroll to top"
      >
        Top
      </Button>
      </div>
    </>
  );
};

export default ReferenceDashboard;