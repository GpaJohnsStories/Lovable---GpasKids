
import WelcomeHeader from "@/components/WelcomeHeader";
import { WebTextBox } from "@/components/WebTextBox";
import StorySection from "@/components/StorySection";
import GpaJohnComments from "@/components/GpaJohnComments";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { StandardAudioPanel } from '@/components/StandardAudioPanel';
import { AudioButton } from '@/components/AudioButton';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Index = () => {
  const [isAudioPanelOpen, setIsAudioPanelOpen] = useState(false);
  
  console.log('Index component loading with WebTextBox');
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 pt-0">
        {/* Peppermint Audio Button - Top of page */}
        <div className="flex justify-center mb-8 pt-4">
          <AudioButton onClick={() => setIsAudioPanelOpen(true)} />
        </div>
        
        <WebTextBox 
          webtextCode="SYS-WEL"
          borderColor="border-yellow-400"
          backgroundColor="#ADD8E6"
          title=""
        />
        
        {/* GpaJohn's Recent Comments - Now positioned above stories */}
        <GpaJohnComments />
        
        <StorySection />
        
        {/* Test Button for Standard Audio Panel */}
        <div className="text-center my-8">
          <Button 
            onClick={() => setIsAudioPanelOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-3 rounded-lg shadow-lg"
          >
            🎵 Test Standard Audio Panel
          </Button>
        </div>
      </main>
      
      <StandardAudioPanel
        isOpen={isAudioPanelOpen}
        onClose={() => setIsAudioPanelOpen(false)}
        title="Grandpa's Story Time"
        author="Grandpa John"
        narrator="Grandpa John"
        audioUrl="/lovable-uploads/sample-audio.mp3"
      />
      
      <CookieFreeFooter />
      <ScrollToTop />
    </div>
  );
};

export default Index;
