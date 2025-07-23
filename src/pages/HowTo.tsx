import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";

const HowTo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-800 mb-8">
            How-to
          </h1>
          
          {/* Content will be added here */}
        </div>
      </main>

      <CookieFreeFooter />
      <ScrollToTop />
    </div>
  );
};

export default HowTo;