import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";

const HelpGpa = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Content will be added later */}
      </main>

      <CookieFreeFooter />
      <ScrollToTop />
    </div>
  );
};

export default HelpGpa;