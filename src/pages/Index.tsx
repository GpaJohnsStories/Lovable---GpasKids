
import WelcomeHeader from "@/components/WelcomeHeader";
import { ProportionalWebTextBox } from "@/components/ProportionalWebTextBox";
import WebTextBox from "@/components/WebTextBox";
import StorySection from "@/components/StorySection";
import GpaJohnComments from "@/components/GpaJohnComments";
import CookieFreeFooter from "@/components/CookieFreeFooter";


const Index = () => {
  
  console.log('Index component loading with WebTextBox');
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 pt-0">
        <ProportionalWebTextBox 
          webtextCode="SYS-WEL"
          borderColor="#facc15"
          backgroundColor="bg-[#ADD8E6]"
        />
        
        <WebTextBox code="SYS-WEL" />
        
        {/* GpaJohn's Banner - Keeping the wide blue button */}
        <GpaJohnComments />
        
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
