import React from 'react';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import buddyImage from "@/assets/buddy-with-background.png";

const About = () => {
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
                  That's why I created this special corner of the internet - a place without advertisements or distractions, where children can feel at home while enjoying stories that entertain and inspire.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-amber-800 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  What You Will Find Here
                </h2>
                <ul className="text-lg text-black leading-relaxed space-y-2 list-disc list-inside ml-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                  <li>World Changers -- Stories of ordinary people and unusual events that changed the world.</li>
                  <li>North Pole -- Stories from my friend Nick about things he said happened at the North Pole (I am not sure if they are true or not).</li>
                  <li>Fun -- Fun Stuff like jokes, fun poems, rules for games, whatever I think you may enjoy, maybe even one of my favorite easy delicious recipes for you.</li>
                  <li>Life -- Stories and things I have learned during my long lifetime that I think you might find helpful.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* About Buddy Section */}
          <div className="max-w-6xl mx-auto border-4 border-yellow-400 rounded-lg p-6 mt-8" style={{backgroundColor: 'white'}}>
            <div>
              <h1 className="text-4xl font-bold text-amber-800 mb-6 text-right" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                About Buddy
              </h1>
              
              {/* Buddy photo positioned at top left */}
              <div className="float-left mr-8 mb-6 w-full max-w-xs">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img 
                      src={buddyImage} 
                      alt="Buddy listening to one of Grandpa John's new stories."
                      className="w-full h-auto rounded-lg shadow-lg border-4 border-white cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-base font-serif text-blue-900 font-semibold">Buddy listening to one of Grandpa John's new stories.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                Buddy joined me at the end of July, 2024. It has been a rough year so far -- I fell in June and broke 5 ribs -- and I felt I deserved a comfort dog. 😃
              </p>
              <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                You see, I received my first dog when I was 5 years old, a Rat Terrior - Dachshund mix. "Lady" slept between my sheets, at the foot of my bed near my feet every night. Until I went away to college I thought everyone slept that way. Guess not!
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
            </div>
          </div>
        </main>
        
        <CookieFreeFooter />
      </div>
    </TooltipProvider>
  );
};

export default About;
