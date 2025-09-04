
import WelcomeHeader from "@/components/WelcomeHeader";
import { ProportionalWebTextBox } from "@/components/ProportionalWebTextBox";
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
        
        {/* GpaJohn's Banner - Keeping the wide blue button */}
        <GpaJohnComments />
        
        <StorySection />
      </main>
      
      <CookieFreeFooter />
    </div>
  );
};

export default Index;
