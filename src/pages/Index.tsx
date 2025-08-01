
import WelcomeHeader from "@/components/WelcomeHeader";
import { WebTextBox } from "@/components/WebTextBox";
import StorySection from "@/components/StorySection";
import GpaJohnComments from "@/components/GpaJohnComments";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ContentProtection from "@/components/ContentProtection";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  return (
    <ContentProtection enableProtection={true}>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <main className="container mx-auto px-4 pt-0">
          <WebTextBox 
            webtextCode="SYS-WEL"
            icon="gpa-john-buddy"
            borderColor="border-yellow-400"
            backgroundColor="#ADD8E6"
            title=""
          />
          
          {/* GpaJohn's Recent Comments - Now positioned above stories */}
          <GpaJohnComments />
          
          <StorySection />
        </main>
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    </ContentProtection>
  );
};

export default Index;
