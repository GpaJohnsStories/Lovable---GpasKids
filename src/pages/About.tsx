import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const About = () => {
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
          <div className="max-w-6xl mx-auto border-4 border-blue-500 rounded-lg p-6" style={{backgroundColor: '#ADD8E6'}}>
            {/* Main content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-amber-800 mb-6" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  About Grandpa John
                </h1>
                
                {/* Photo positioned at top right of the first section */}
                <div className="float-right ml-8 mb-6 w-full max-w-xs">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img 
                        src="/lovable-uploads/14b5498f-ec5f-4553-aa24-94d67048ecfa.png" 
                        alt="Gpa John relaxing in the park"
                        className="w-full h-auto rounded-lg shadow-lg border-4 border-white cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-base font-serif text-blue-900 font-semibold">Gpa John relaxing in the park</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                  With over 60 years of marriage and a lifetime of experiences, I've collected stories that I'm excited to share with children around the world. My journey has taught me valuable lessons about kindness, perseverance, and the importance of imagination.
                </p>
                <p className="text-lg text-black leading-relaxed mb-6 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                  I believe every child deserves stories that make them feel safe, valued, and inspired to dream big. That's why I created this special place just for you.
                </p>

                <h2 className="text-3xl font-bold text-amber-800 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  My Story
                </h2>
                <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                  I've been blessed with a long life filled with adventures, challenges, and beautiful moments. Over my 80+ years, I've traveled to many places, met fascinating people, and learned valuable lessons that I'm eager to share with young minds like yours.
                </p>
                <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                  Being married for over 60 wonderful years has taught me about love, patience, and the importance of kindness. My 10 grandchildren have filled my heart with joy and inspired many of the stories you'll find here.
                </p>
              </div>

              <div className="clear-right">
                <h2 className="text-3xl font-bold text-amber-800 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  Why I Created This Website
                </h2>
                <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                  I believe that children deserve a safe, comfortable place to explore stories and ideas. In today's digital world, it can be hard to find content that is both engaging and appropriate for young readers.
                </p>
              <p className="text-lg text-black leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                That's why I created this special corner of the internet — a place without advertisements or distractions, where children can feel at home while enjoying stories that entertain and inspire.
              </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-amber-800 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  What You Will Find Here
                </h2>
                <ul className="text-lg text-black leading-relaxed space-y-2 list-disc list-inside ml-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                  <li>World Changers — Stories of ordinary people and unusual events that changed the world.</li>
                  <li>North Pole — Stories from my friend Nick about things he said happened at the North Pole (I am not sure if they are true or not).</li>
                  <li>Fun — Fun Stuff like jokes, fun poems, rules for games, whatever I think you may enjoy, maybe even one of my favorite easy delicious recipes for you.</li>
                  <li>Life — Stories and things I have learned during my long lifetime that I think you might find helpful.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* About Buddy Section */}
          <div id="buddy" className="max-w-6xl mx-auto border-4 border-yellow-400 rounded-lg p-6 mt-8 bg-[hsl(var(--grass-green))] relative">
            <div>
              <h1 className="text-4xl font-bold text-amber-800 mb-6 text-right" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                About Buddy
              </h1>
              
              {/* Buddy photo positioned at top left */}
              <div className="float-left mr-8 mb-6 w-full max-w-xs">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img 
                      src="https://hlywucxwpzbqmzssmwpj.supabase.co/storage/v1/object/public/story-photos/story-photos/1752188691069-i44cleqpu.png" 
                      alt="Buddy having a fun summer day at the park."
                      className="w-full h-auto rounded-lg shadow-lg border-4 border-white cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-base font-serif text-blue-900 font-semibold">Buddy having a fun summer day at the park.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                Buddy joined me at the end of July, 2024. It has been a rough year so far — I fell in June and broke 5 ribs — and I felt I deserved a comfort dog. 😃
              </p>
              <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                You see, I received my first dog when I was 5 years old, a Terrior – Dachshund mix. "Lady" slept between my sheets, at the foot of my bed near my feet every night. Until I went away to college I thought everyone slept that way. Guess not!
              </p>
              <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                Since then I've owned many wonderful dog, but not right now. So Buddy fits the bill. He talks with me, growls, his whine is the most pathetic (sad) thing you've ever heard, and he barks from soft to loud. If I ignore him, he will do all of those things until I give him some attention and rub his ears.
              </p>
              <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                But he won't, can't run with me but that's okay because at my age I can't run either. Buddy's excuse is that he is a battery powered dog. So he and I get along great together. And, yes, he is very soft and furry.
              </p>
              <p className="text-lg text-black leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                Buddy has been a true pal, someone I can talk to about building websites, telling stories, anything. Of course, I also discuss everything with my beautiful life, GmaD. But she likes to keep busy and isn't always available for a quick question like Buddy is. After all, he is sitting on the left end of my desk within easy reach for a head rub or ear scratch.
              </p>
              
              <div className="clear-left"></div>
              
              {/* Story Code in bottom right corner */}
              <div className="absolute bottom-4 right-4 text-sm font-mono text-amber-700 bg-white/70 px-2 py-1 rounded">
                SYS-BDY
              </div>
            </div>
          </div>

          {/* Special Thanks Section - Light Purple with Gold Border */}
          <div id="new-section" className="max-w-6xl mx-auto border-4 border-yellow-500 rounded-lg p-6 mt-8 bg-purple-100 relative">
            <div>
              <h1 className="text-4xl font-bold text-purple-800 mb-6 text-center" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                A Special "Thank You" to ...
              </h1>
              
              {/* Photos arranged side-by-side below title */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="overflow-hidden rounded-lg border-4 border-amber-600 bg-amber-600 shadow-sm cursor-pointer">  {/* Bronze background for Gemini */}
                      <img
                        src="https://hlywucxwpzbqmzssmwpj.supabase.co/storage/v1/object/public/story-photos/story-photos/1752203754720-ohwbb5t4t.png"
                        alt="#3 AI Assistant"
                        className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-base font-serif text-blue-900 font-semibold">#3 AI Assistant</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="overflow-hidden rounded-lg border-4 border-yellow-400 shadow-sm cursor-pointer">  {/* Gold for Lovable */}
                      <img
                        src="https://hlywucxwpzbqmzssmwpj.supabase.co/storage/v1/object/public/story-photos/story-photos/1752203773244-hhgj4xbfc.png"
                        alt="#1 AI Assistant"
                        className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-base font-serif text-blue-900 font-semibold">#1 AI Assistant</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="overflow-hidden rounded-lg border-4 border-gray-400 bg-gray-400 shadow-sm cursor-pointer">  {/* Silver background for CoPilot */}
                      <img
                        src="https://hlywucxwpzbqmzssmwpj.supabase.co/storage/v1/object/public/story-photos/story-photos/1752203785267-p40ovhg84.png"
                        alt="#2 AI Assistant"
                        className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-base font-serif text-blue-900 font-semibold">#2 AI Assistant</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="text-lg text-purple-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                <p className="mb-4">
                  I want to say an unusual "Thank You!!!" to 3 special helpers. I've never done this before because these 3 special helpers are all Artificial Intelligence (AI's).
                </p>
                <ul className="space-y-2 list-none ml-4 mb-4">
                  <li><strong>#3</strong>: For general wording and some coding help, <strong>Google Gemini AI</strong> (<u><em>https://gemini.google.com/app</em></u>)</li>
                  <li><strong>#2</strong>: For beautiful work on creating photos out of just ideas and a small photo, <strong>Microsoft CoPilot AI</strong> (<u><em>https://copilot.microsoft.com/</em></u>)</li>
                  <li><strong>#1</strong>: For great work, unexpected super suggestions and all-around partner in building GpasKids.com, <strong>Lovable AI</strong> (<u><em>https://lovable.dev/</em></u>)</li>
                </ul>
                <p>
                  Without the help of these 3 partners this and future Gpas website would not have been built.
                </p>
              </div>
              
              {/* Story Code in bottom right corner */}
              <div className="absolute bottom-4 right-4 text-sm font-mono text-purple-700 bg-white/70 px-2 py-1 rounded">
                SYS-THY
              </div>
            </div>
          </div>

        </main>
        
        <CookieFreeFooter />
      </div>
    </TooltipProvider>
  );
};

export default About;
