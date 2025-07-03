import React from 'react';
import { useQuery } from '@tanstack/react-query';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";
import { supabase } from "@/integrations/supabase/client";
import copyrightSign from "@/assets/copyright-sign.jpg";

const Writing = () => {
  const { data: copyrightStory } = useQuery({
    queryKey: ['story', 'SYS-CPR'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('content')
        .eq('story_code', 'SYS-CPR')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <main className="container mx-auto px-4 pt-8 pb-12">
          {/* Copyright Section */}
          <div id="copyright" className="max-w-6xl mx-auto border-4 border-purple-500 rounded-lg p-6 bg-purple-50 relative">
            <div className="flex items-start mb-6">
              <div className="flex items-center">
                <span className="text-red-600 text-6xl font-bold mr-4">©</span>
                <span className="text-purple-800 text-4xl font-bold mr-4">—</span>
                <h1 className="text-4xl font-bold text-purple-800" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  Copyright and What It Means for You
                </h1>
              </div>
            </div>
            
            <div className="space-y-4">
              {copyrightStory?.content ? (
                <IsolatedStoryRenderer
                  content={copyrightStory.content}
                  useRichCleaning={true}
                />
              ) : (
                <p className="text-lg text-purple-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                  Loading copyright information...
                </p>
              )}
            </div>
            
            {/* Story Code Identifier */}
            <div className="absolute bottom-2 right-2">
              <span 
                className="text-black text-xs"
                style={{ fontFamily: 'Georgia, serif', fontSize: '10px' }}
              >
                SYS-CPR
              </span>
            </div>
          </div>

          {/* Write a Story Section */}
          <div className="max-w-6xl mx-auto border-4 border-orange-500 rounded-lg p-6 bg-white mt-8">
            <div className="flex items-center mb-6">
              <span className="text-6xl mr-4">⌨️</span>
              <span className="text-orange-600 text-4xl font-bold mr-4">—</span>
              <h2 className="text-4xl font-bold text-orange-600" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                Write a Story for Gpa's Kids
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                Content coming soon...
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