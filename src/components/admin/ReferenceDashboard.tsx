import IconLibrarySection from "./reference/IconLibrarySection";
import PreferredColorsSection from "./reference/PreferredColorsSection";
import IconUploadSection from "./reference/IconUploadSection";

const ReferenceDashboard = () => {
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

      <PreferredColorsSection />
      
      <IconUploadSection />
      
      <IconLibrarySection />
    </div>
  );
};

export default ReferenceDashboard;