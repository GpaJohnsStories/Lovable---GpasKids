import React from 'react';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

import OrangeGangGallery from "@/components/OrangeGangGallery";

const OrangeGangPhotos = () => {
  console.log('🍊 OrangeGangPhotos page rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 py-8">
        <OrangeGangGallery />
      </main>
      
      <CookieFreeFooter />
    </div>
  );
};

export default OrangeGangPhotos;