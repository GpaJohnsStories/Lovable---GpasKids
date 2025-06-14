
import WelcomeHeader from "@/components/WelcomeHeader";
import WelcomeText from "@/components/WelcomeText";
import StorySection from "@/components/StorySection";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      {/* Under Construction Box */}
      <div className="relative -mt-8 mb-2 flex justify-center items-center z-20">
        {/* Under Construction Image */}
        <img 
          src="/lovable-uploads/3a1b5f78-6ca6-488d-90a3-369c6bc26b12.png"
          alt="Under Construction"
          className="w-40 h-40 object-contain"
        />
      </div>

      <main className="container mx-auto px-4" style={{ paddingTop: '0px' }}>
        <WelcomeText />
        <StorySection />
      </main>
      <CookieFreeFooter />
    </div>
  );
};

export default Index;
