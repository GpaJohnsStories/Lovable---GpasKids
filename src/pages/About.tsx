
import React from 'react';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 pt-8">
        {/* Content will be added later */}
      </main>
      
      <CookieFreeFooter />
    </div>
  );
};

export default About;
