import React from 'react';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import copyrightSign from "@/assets/copyright-sign.jpg";

const Writing = () => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <main className="container mx-auto px-4 pt-8 pb-12">
          {/* Copyright Section */}
          <div id="copyright" className="max-w-6xl mx-auto border-4 border-purple-500 rounded-lg p-6 bg-purple-50">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl font-bold text-purple-800" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                Copyright and What It Means for You
              </h1>
              
              <div className="w-32 h-18 flex-shrink-0 ml-8">
                <img 
                  src={copyrightSign} 
                  alt="Red copyright symbol"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg text-purple-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                Copyright is like a special rule that protects the stories, pictures, and ideas that someone creates. When I write a story, I own the copyright to it - that means it belongs to me, just like your favorite toy belongs to you!
              </p>
              <p className="text-lg text-purple-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                All the stories on this website are protected by copyright. This means you can read them and enjoy them, but you can't copy them and pretend you wrote them. Think of it like borrowing a book from the library - you can read it, but you have to return it because it belongs to someone else.
              </p>
              <p className="text-lg text-purple-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                If you want to share one of my stories with your friends or family, that's wonderful! Just make sure to tell them that Grandpa John wrote it. It's like giving credit where credit is due - always remember to be honest about who created what.
              </p>
              <p className="text-lg text-purple-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                Remember, being creative and making your own stories is always the best adventure. I hope my stories inspire you to write your own amazing tales!
              </p>
            </div>
          </div>
        </main>
        
        <CookieFreeFooter />
      </div>
    </TooltipProvider>
  );
};

export default Writing;