
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ContentProtection from "@/components/ContentProtection";
import ScrollToTop from "@/components/ScrollToTop";
import VoicePreview from "@/components/VoicePreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminVoicePreviewPage = () => {
  return (
    <ContentProtection enableProtection={true}>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/buddys_admin">
              <Button className="cozy-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Dashboard
              </Button>
            </Link>
            <div className="bg-red-100 border border-red-300 rounded-lg px-4 py-2">
              <span className="text-red-800 font-bold text-sm">ADMIN ONLY - Voice Testing</span>
            </div>
          </div>
          
          <VoicePreview />
        </main>
        
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    </ContentProtection>
  );
};

export default AdminVoicePreviewPage;
