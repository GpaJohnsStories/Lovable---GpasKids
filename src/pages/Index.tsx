
import WelcomeHeader from "@/components/WelcomeHeader";
import WelcomeText from "@/components/WelcomeText";
import StorySection from "@/components/StorySection";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 pt-8">
        <WelcomeText />
        
        {/* Note text below the blue box */}
        <div className="w-full py-4">
          <div className="container mx-auto px-4">
            <p className="text-center text-amber-700 italic font-handwritten text-lg">
              NOTE: For best viewing and reading, use your phone or tablet in landscape mode.
            </p>
          </div>
        </div>
        
        <StorySection />
      </main>
      <CookieFreeFooter />
    </div>
  );
};

export default Index;
