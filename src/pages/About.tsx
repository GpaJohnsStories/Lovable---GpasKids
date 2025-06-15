
import React from 'react';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 pt-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Main content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-amber-800 mb-6" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                About Grandpa John
              </h1>
              
              {/* Photo positioned at top right of the first section */}
              <div className="float-right ml-8 mb-6 w-full max-w-xs">
                <img 
                  src="/lovable-uploads/14b5498f-ec5f-4553-aa24-94d67048ecfa.png" 
                  alt="Grandpa John"
                  className="w-full h-auto rounded-lg shadow-lg border-4 border-white"
                />
              </div>
              
              <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                With over 60 years of marriage and a lifetime of experiences, I've collected stories that I'm excited to share with children around the world. My journey has taught me valuable lessons about kindness, perseverance, and the importance of imagination.
              </p>
              <p className="text-lg text-black leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                I believe every child deserves stories that make them feel safe, valued, and inspired to dream big. That's why I created this special place just for you.
              </p>
            </div>

            <div className="clear-right">
              <h2 className="text-3xl font-bold text-amber-800 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                My Story
              </h2>
              <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                I've been blessed with a long life filled with adventures, challenges, and beautiful moments. Over my 80+ years, I've traveled to many places, met fascinating people, and learned valuable lessons that I'm eager to share with young minds like yours.
              </p>
              <p className="text-lg text-black leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                Being married for over 60 wonderful years has taught me about love, patience, and the importance of kindness. My 10 grandchildren have filled my heart with joy and inspired many of the stories you'll find here.
              </p>
            </div>

            <div>
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
                <li>Stories of ordinary people who changed the world</li>
                <li>Stories from my friend Nick about things he said happened at the North Pole (I am not sure if they are true or not).</li>
                <li>Fun Stuff like jokes, fun poems, rules for games, whatever I think you may enjoy</li>
                <li>Stories and things I have learned during my lifetime I think might helpful for you to know.</li>
              </ul>
            </div>

            <div 
              className="border-2 border-amber-600 rounded-xl px-16 py-8 shadow-xl relative overflow-hidden"
              style={{
                backgroundImage: `url('/lovable-uploads/2a50a95f-ad31-4394-b52c-f65e3bc6f5b3.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-amber-900 mb-6" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  My PROMISE to YOU!
                </h2>
                <div className="space-y-4">
                  <p className="text-lg text-amber-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                    <span className="font-bold">Safety First</span>: This website is designed with children's safety in mind. There are no advertisements, no personal data collection, and strict security measures.
                  </p>
                  <p className="text-lg text-amber-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                    <span className="font-bold">Quality Content</span>: All stories are written by me or by my friends and then edited by me. They are carefully crafted to be engaging, age-appropriate for grade school students, encouraging, and meaningful.
                  </p>
                  <p className="text-lg text-amber-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                    <span className="font-bold">A Comfortable Space</span>: I want you to feel at home here – like you're sitting in a cozy chair listening to your own grandparent tell you a story.
                  </p>
                </div>
                
                {/* Thank you message */}
                <div className="mt-8 text-center clear-right">
                  <p className="text-lg text-blue-800 font-bold leading-relaxed italic mb-6" style={{ fontFamily: 'Segoe Print, cursive, sans-serif' }}>
                    Thank you for visiting! I hope you enjoy the stories and<br />come back often to see what's new.
                  </p>
                  
                  {/* Signature with paw print */}
                  <div className="flex justify-center items-center">
                    <div className="text-center ml-8">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="text-4xl text-blue-800 font-bold" style={{ fontFamily: 'Brush Script MT, cursive, sans-serif' }}>
                          Grandpa John
                        </div>
                        {/* Buddy's paw print using uploaded image */}
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Paw-print.svg/256px-Paw-print.svg.png?20110605041351" 
                          alt="Buddy's paw print"
                          className="w-8 h-8 ml-2"
                          style={{ transform: 'rotate(-15deg)' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <CookieFreeFooter />
    </div>
  );
};

export default About;
