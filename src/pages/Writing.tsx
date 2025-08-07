import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WebTextBox } from "@/components/WebTextBox";
import StorySubmissionForm from "@/components/story-submission/StorySubmissionForm";
import copyrightSign from "@/assets/copyright-sign.jpg";

const Writing = () => {
  const location = useLocation();
  

  useEffect(() => {
    // Handle hash navigation when component mounts or hash changes
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        // Small delay to ensure the page is fully rendered
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            // Get the element's position and add some offset for the header
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - 100; // Add 100px offset to show title
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };

    // Run on mount and whenever the location changes (including hash)
    scrollToHash();
  }, [location]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <main className="container mx-auto px-4 pt-8 pb-12">
          {/* Copyright Section */}
          <div id="copyright" className="max-w-6xl mx-auto">
            <WebTextBox
              webtextCode="SYS-CPR"
              borderColor="border-purple-500"
              backgroundColor="bg-purple-50"
              title="Copyright and What It Means for You"
            />
          </div>

          {/* Write a Story Section */}
          <div id="write-story" className="max-w-6xl mx-auto mt-8">
            <WebTextBox
              webtextCode="SYS-WAS"
              borderColor="border-orange-500"
              backgroundColor="bg-white"
              title="Write a Story for Gpa's Kids"
            />
          </div>

          {/* Story Submission Release Form - Separate Box */}
          <div 
            className="max-w-6xl mx-auto border-4 border-red-600 rounded-lg px-16 py-8 shadow-xl relative overflow-hidden mt-8"
            style={{
              backgroundImage: `url('/lovable-uploads/2a50a95f-ad31-4394-b52c-f65e3bc6f5b3.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="relative z-10">
              <StorySubmissionForm />
            </div>
          </div>
        </main>
        
        <CookieFreeFooter />
      </div>
    </TooltipProvider>
  );
};

export default Writing;