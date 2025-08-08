import { Helmet } from 'react-helmet-async';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { WebTextBox } from "@/components/WebTextBox";
import DonationForm from "@/components/DonationForm";

const Donations = () => {
  return (
    <>
      <Helmet>
        <title>Help Grandpa John - Donations | Grandpa John's Stories</title>
        <meta name="description" content="Support Grandpa John's storytelling website with a donation to help keep these wonderful stories available for children everywhere." />
        <meta name="keywords" content="donations, support, help, Grandpa John, children's stories" />
        <link rel="canonical" href="/donations" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <WelcomeHeader />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-orange-800">
              Help Grandpa John
            </h1>
            
            {/* WebTextBox for main content */}
            <WebTextBox
              webtextCode="WEB-HGJ"
              borderColor="border-blue-300"
              backgroundColor="bg-blue-50/70"
              title="Support Our Stories"
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

export default Donations;