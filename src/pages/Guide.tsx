import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { WebTextBox } from "@/components/WebTextBox";
import { supabase } from "@/integrations/supabase/client";
const Guide = () => {
  const location = useLocation();
  
  const webtextBoxes = [{
    webtextCode: "SYS-G1A",
    borderColor: "#16a34a",
    // Fresh Green
    backgroundColor: "bg-green-600/20",
    title: "Getting Started"
  }, {
    webtextCode: "SYS-G2A",
    borderColor: "#dc2626",
    // Red to match buddy's home roof
    backgroundColor: "bg-red-600/20",
    title: "Home Page"
  }, {
    webtextCode: "SYS-G3A",
    borderColor: "#F97316",
    // Orange to match menu icons
    backgroundColor: "bg-orange-600/20",
    title: "Story Library"
  }, {
    webtextCode: "SYS-G3B",
    borderColor: "#3b82f6",
    // Blue same as admin top banner
    backgroundColor: "bg-blue-600/20",
    title: "Read A Story"
  // }, {
    // webtextCode: "SYS-G5A",
    // borderColor: "#F97316",
    // // Orange to match menu icons
    // backgroundColor: "bg-orange-600/20",
    // title: "Writing"
  }, {
    webtextCode: "SYS-G6A",
    borderColor: "#60a5fa",
    // Light blue
    backgroundColor: "bg-blue-400/20",
    title: "About Us"
  }, {
    webtextCode: "SYS-G7A",
    borderColor: "#4A7C59",
    // Forest Green - leave color alone
    backgroundColor: "bg-emerald-700/20",
    title: "We Are Safe!"
  }];

  // Auto-scroll to hash anchor when page loads or hash changes
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1); // Remove the # from hash
      console.log('📍 Attempting to scroll to element:', elementId);
      
      const scrollToElement = () => {
        const element = document.getElementById(elementId);
        if (element) {
          console.log('✅ Found element, scrolling:', elementId);
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };

      // Try immediately
      if (!scrollToElement()) {
        // If element not found, retry after a short delay (in case content is still loading)
        const timer = setTimeout(() => {
          if (!scrollToElement()) {
            console.log('❌ Element not found after retry:', elementId);
          }
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash]);
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-800">
              Buddy's Guide to Gpa's Website
            </h1>
          </div>

          {/* Navigation Menu */}
          <div id="guide-navigation" className="bg-gray-100 rounded-lg p-3 mb-6 shadow-sm">
            <div className="flex flex-wrap justify-center gap-1.5">
              <button onClick={() => document.getElementById('SYS-G1A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:from-green-700 active:to-green-800 text-white border-2 rounded-full text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#16a34a"
            }}>
                <span className="text-orange-800 text-base">Start</span>
                <span className="text-orange-800 text-base">Here</span>
              </button>
              <button onClick={() => document.getElementById('SYS-G2A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-red-200 to-red-300 hover:from-red-300 hover:to-red-400 active:from-red-400 active:to-red-500 text-white border-2 border-red-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#dc2626"
            }}>
                <span className="text-orange-800 text-[10px]">Home</span>
                <span className="text-orange-800 text-[10px]">Page</span>
              </button>
              <button onClick={() => document.getElementById('SYS-G3A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-orange-200 to-orange-300 hover:from-orange-300 hover:to-orange-400 active:from-orange-400 active:to-orange-500 text-white border-2 border-orange-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#F97316"
            }}>
                <span className="text-orange-800 text-[10px]">Story</span>
                <span className="text-orange-800 text-[10px]">Library</span>
              </button>
              <button onClick={() => document.getElementById('SYS-G3B')?.scrollIntoView({
              behavior: 'smooth'
            })} className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 active:from-blue-400 active:to-blue-500 text-white border-2 border-blue-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#3b82f6"
            }}>
                <span className="text-orange-800 text-[10px]">Enjoy a</span>
                <span className="text-orange-800 text-[10px]">Story</span>
              </button>
              {/* Commented out SYS-G5A button
              <button onClick={() => document.getElementById('SYS-G5A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-orange-200 to-orange-300 hover:from-orange-300 hover:to-orange-400 active:from-orange-400 active:to-orange-500 text-white border-2 border-orange-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#F97316"
            }}>
                <span className="text-orange-800 text-[10px]">How to</span>
                <span className="text-orange-800 text-[10px]">Write a Story</span>
              </button>
              */}
              <button onClick={() => document.getElementById('SYS-G6A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 active:from-blue-300 active:to-blue-400 text-white border-2 border-blue-400 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#60a5fa"
            }}>
                <span className="text-orange-800 text-[10px]">Guide To</span>
                <span className="text-orange-800 text-[10px]">All About Us</span>
              </button>
              <button onClick={() => document.getElementById('SYS-G7A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 active:from-emerald-300 active:to-emerald-400 text-white border-2 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#4A7C59"
            }}>
                <span className="text-orange-800 text-[10px]">Guide To</span>
                <span className="text-orange-800 text-[10px]">Your Safety</span>
              </button>
            </div>
          </div>
          
          {/* Stack of WebText Boxes */}
          <div className="space-y-2 mb-1">
            {webtextBoxes.map((box, index) => <WebTextBox 
              key={index} 
              webtextCode={box.webtextCode} 
              borderColor={box.borderColor} 
              backgroundColor={box.backgroundColor} 
              title={box.title} 
              id={box.webtextCode}
              showReturn={true}
              onReturnClick={() => {
                // Smart return behavior
                const handleSmartReturn = () => {
                  // First try: Close tab (works for script-opened tabs even with noopener)
                  try {
                    window.close();
                    // Brief delay to check if tab actually closed
                    setTimeout(() => {
                      // If we're still here, tab didn't close, try history
                      if (window.history.length > 1) {
                        window.history.back();
                      } else {
                        // Fallback: Scroll to navigation
                        const navElement = document.getElementById('guide-navigation');
                        if (navElement) {
                          navElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }, 100);
                  } catch (e) {
                    // If close() throws, try history or scroll
                    if (window.history.length > 1) {
                      window.history.back();
                    } else {
                      const navElement = document.getElementById('guide-navigation');
                      if (navElement) {
                        navElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  }
                };
                
                handleSmartReturn();
              }}
            />)}
          </div>
        </div>
      </main>

      <CookieFreeFooter />
      <ScrollToTop />
    </div>;
};
export default Guide;