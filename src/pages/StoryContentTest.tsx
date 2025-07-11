import React from 'react';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import { StoryContentRenderer } from "@/components/story-content/StoryContentRenderer";

const StoryContentTest = () => {
  const testContent = `
    <h2>Testing Story Code Integration</h2>
    
    <p>This is a test page to demonstrate how story codes work within content. Here's some regular text content before a story code.</p>
    
    <p>Now, let me show you Buddy's story by including his story code:</p>
    
    [SYS-BDY]
    
    <p>That was Buddy's complete story with audio and photos! The story code automatically displays the content, photos, and audio controls.</p>
    
    <p>This system allows us to embed rich content anywhere on the website just by referencing the story code.</p>
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 pt-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-amber-800 mb-8 text-center" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Story Content System Test
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border-4 border-blue-500">
            <StoryContentRenderer content={testContent} />
          </div>
        </div>
      </main>
      
      <CookieFreeFooter />
    </div>
  );
};

export default StoryContentTest;