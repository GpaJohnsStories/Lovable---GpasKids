import { Helmet } from 'react-helmet-async';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { WebTextBox } from "@/components/WebTextBox";
import DonationForm from "@/components/DonationForm";

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
          <div className="max-w-4xl mx-auto space-y-8">
            {/* WebTextBox for main content */}
            <WebTextBox
              webtextCode="SYS-HGJ"
              borderColor="border-blue-300"
              backgroundColor="bg-blue-50/70"
              title="Help Grandpa John"
            />
            
            {/* Donation Form Section */}
            <DonationForm />
          </div>
        </main>

        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    </>
  );
};

export default HelpGpa;