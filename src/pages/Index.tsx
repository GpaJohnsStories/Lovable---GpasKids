
import WelcomeHeader from "@/components/WelcomeHeader";
import { ProportionalWebTextBox } from "@/components/ProportionalWebTextBox";
import WebTextBox from "@/components/WebTextBox";
import StaticWebtextBox from "@/components/StaticWebtextBox";
import StorySection from "@/components/StorySection";
import GpaJohnComments from "@/components/GpaJohnComments";
import CookieFreeFooter from "@/components/CookieFreeFooter";


const Index = () => {
  
  console.log('Index component loading with WebTextBox');
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 pt-0">
        {/* ===== BOX 1 START (Orange Announcements Box) ===== */}
        <GpaJohnComments />
        {/* ===== BOX 1 END ===== */}
        
        {/* ===== BOX 2 START (Green Buddy Box) ===== */}
        <WebTextBox 
          code="SYS-WE2"
          id="home-box-2"
        />
        {/* ===== BOX 2 END ===== */}
        
        
        <StorySection />
      </main>
      
      {/* Contact Email Section - Mobile Width */}
      <div className="container mx-auto px-4 pb-4 flex justify-center">
        <div className="max-w-sm w-full">
          <ProportionalWebTextBox 
            webtextCode="SYS-CEM"
            borderColor="#f97316"
            backgroundColor="bg-orange-50"
          />
        </div>
      </div>
      
      <CookieFreeFooter />
    </div>
  );
};

export default Index;
