
import WelcomeHeader from "@/components/WelcomeHeader";
import WelcomeText from "@/components/WelcomeText";
import StorySection from "@/components/StorySection";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ContentProtection from "@/components/ContentProtection";
import { Link } from "react-router-dom";

const Index = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <ContentProtection enableProtection={true}>
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
              <p className="text-center text-amber-700 italic font-handwritten text-lg mt-2">
                Please be sure to read our promise to you, click{' '}
                <Link 
                  to="/privacy" 
                  onClick={scrollToTop}
                  className="text-blue-600 hover:text-blue-800 underline font-bold"
                >
                  HERE
                </Link>
                {' '}or the Privacy button in the menu.
              </p>
            </div>
          </div>
          
          <StorySection />
        </main>
        <CookieFreeFooter />
      </div>
    </ContentProtection>
  );
};

export default Index;
