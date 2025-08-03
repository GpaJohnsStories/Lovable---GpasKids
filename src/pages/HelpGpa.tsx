import { Helmet } from 'react-helmet-async';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";

const HelpGpa = () => {
  return (
    <>
      <Helmet>
        <title>How to Help Gpa John</title>
        <meta name="description" content="Learn how to help Grandpa John with his storytelling website" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <WelcomeHeader />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-orange-800">
              How to Help Gpa John
            </h1>
            
            {/* Content will be added later */}
            <div className="bg-white/50 rounded-lg p-8 shadow-lg">
              <p className="text-lg text-gray-700 text-center">
                Content coming soon...
              </p>
            </div>
          </div>
        </main>

        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    </>
  );
};

export default HelpGpa;