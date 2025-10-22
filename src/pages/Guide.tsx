import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

import { WebTextBox } from "@/components/WebTextBox";
import BaseWebTextBox from "@/components/templates/BaseWebTextBox";
import { supabase } from "@/integrations/supabase/client";
const Guide = () => {
  const location = useLocation();
  
  const webtextBoxes = [{
    webtextCode: "SYS-WE2",
    title: "Getting Started"
  }, {
    webtextCode: "SYS-G2A",
    title: "Home Page"
  }, {
    webtextCode: "SYS-G3A",
    title: "Story Library"
  }, {
    webtextCode: "SYS-G3B",
    title: "Read A Story"
  }, {
    webtextCode: "SYS-G6A",
    title: "About Us"
  }, {
    webtextCode: "SYS-G7A",
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
          <div className="flex items-center justify-center gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-800">
              Buddy's Guide to Gpa's Website
            </h1>
          </div>

          {/* Navigation Menu */}
          <div id="guide-navigation" className="bg-gray-100 rounded-lg p-3 mb-6 shadow-sm">
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => document.getElementById('SYS-WE2')?.scrollIntoView({
              behavior: 'smooth'
            })} className="h-12 px-6 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:from-green-700 active:to-green-800 text-white border-2 rounded-full font-bold transition-all duration-200 flex items-center justify-center text-center leading-tight whitespace-nowrap shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#16a34a",
              fontSize: '21px'
            }}>
                <span className="text-orange-800">Start Here</span>
              </button>
              <button onClick={() => document.getElementById('SYS-G2A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="h-12 px-6 bg-gradient-to-b from-red-200 to-red-300 hover:from-red-300 hover:to-red-400 active:from-red-400 active:to-red-500 text-white border-2 border-red-600 rounded-full font-bold transition-all duration-200 flex items-center justify-center text-center leading-tight whitespace-nowrap shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#dc2626",
              fontSize: '21px'
            }}>
                <span className="text-orange-800">Home Page</span>
              </button>
              <button onClick={() => document.getElementById('SYS-G3A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="h-12 px-6 bg-gradient-to-b from-orange-200 to-orange-300 hover:from-orange-300 hover:to-orange-400 active:from-orange-400 active:to-orange-500 text-white border-2 border-orange-600 rounded-full font-bold transition-all duration-200 flex items-center justify-center text-center leading-tight whitespace-nowrap shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#F97316",
              fontSize: '21px'
            }}>
                <span className="text-orange-800">Story Library</span>
              </button>
              <button onClick={() => document.getElementById('SYS-G3B')?.scrollIntoView({
              behavior: 'smooth'
            })} className="h-12 px-6 bg-gradient-to-b from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 active:from-blue-400 active:to-blue-500 text-white border-2 border-blue-600 rounded-full font-bold transition-all duration-200 flex items-center justify-center text-center leading-tight whitespace-nowrap shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#3b82f6",
              fontSize: '21px'
            }}>
                <span className="text-orange-800">Enjoy a Story</span>
              </button>
              {/* Commented out SYS-G5A button
              <button onClick={() => document.getElementById('SYS-G5A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="h-16 px-6 py-1 bg-gradient-to-b from-orange-200 to-orange-300 hover:from-orange-300 hover:to-orange-400 active:from-orange-400 active:to-orange-500 text-white border-2 border-orange-600 rounded-full font-bold transition-all duration-200 flex items-center justify-center text-center leading-tight whitespace-nowrap shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#F97316",
              fontSize: '21px'
            }}>
                <span className="text-orange-800">How to Write a Story</span>
              </button>
              */}
              <button onClick={() => document.getElementById('SYS-G6A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="h-12 px-6 bg-gradient-to-b from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 active:from-blue-300 active:to-blue-400 text-white border-2 border-blue-400 rounded-full font-bold transition-all duration-200 flex items-center justify-center text-center leading-tight whitespace-nowrap shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#60a5fa",
              fontSize: '21px'
            }}>
                <span className="text-orange-800">All About Us</span>
              </button>
              <button onClick={() => document.getElementById('SYS-G7A')?.scrollIntoView({
              behavior: 'smooth'
            })} className="h-12 px-6 bg-gradient-to-b from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 active:from-emerald-300 active:to-emerald-400 text-white border-2 rounded-full font-bold transition-all duration-200 flex items-center justify-center text-center leading-tight whitespace-nowrap shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{
              borderColor: "#4A7C59",
              fontSize: '21px'
            }}>
                <span className="text-orange-800">Your Safety Here</span>
              </button>
            </div>
          </div>
          
          {/* Stack of WebText Boxes */}
          <div className="space-y-2 mb-1">
            {webtextBoxes.map((box, index) => {
              // Direct test: Use BaseWebTextBox for SYS-G2A with color preset 6 (black font on red)
              if (box.webtextCode === "SYS-G2A") {
                return (
                  <BaseWebTextBox
                    key={index}
                    code="SYS-G2A"
                    title={box.title}
                    id={box.webtextCode}
                    theme={{
                      primaryColor: "#333333",
                      borderColor: "#dc2626",
                      backgroundColor: "rgba(220, 38, 38, 0.2)",
                      photoMatColor: "#ffffff",
                      photoBorderColor: "#dc2626"
                    }}
                    cssClassPrefix="sysg2a"
                  />
                );
              }
              
              // All others continue using the router
              return (
                <WebTextBox 
                  key={index} 
                  code={box.webtextCode} 
                  title={box.title} 
                  id={box.webtextCode}
                />
              );
            })}
          </div>
        </div>
      </main>

      <CookieFreeFooter />
    </div>;
};
export default Guide;