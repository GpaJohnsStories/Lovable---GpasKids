
import React from 'react';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 pt-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Photo positioned at upper right */}
          <div className="float-right ml-8 mb-6 w-full max-w-sm lg:max-w-xs">
            <img 
              src="/lovable-uploads/14b5498f-ec5f-4553-aa24-94d67048ecfa.png" 
              alt="Grandpa John"
              className="w-full h-auto rounded-lg shadow-lg border-4 border-white"
            />
          </div>

          {/* Main content with text wrapping around photo */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-amber-800 mb-6" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                About Grandpa John
              </h1>
              <p className="text-lg text-black leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                With over 60 years of marriage and a lifetime of experiences, I've collected stories that I'm excited to share with children around the world. My journey has taught me valuable lessons about kindness, perseverance, and the importance of imagination.
              </p>
              <p className="text-lg text-black leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                I believe every child deserves stories that make them feel safe, valued, and inspired to dream big. That's why I created this special place just for you.
              </p>
            </div>

            <div>
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
                <li>Stories of ordinary people who changed the world</li>
                <li>Stories from my friend Nick about things he said happened at the North Pole (I am not sure if they are true or not).</li>
                <li>Fun Stuff like jokes, fun poems, rules for games, whatever I think you may enjoy</li>
                <li>Stories and things I have learned during my lifetime I think might helpful for you to know.</li>
              </ul>
            </div>

            <div 
              className="border-2 border-amber-400 rounded-xl p-8 shadow-lg relative overflow-hidden"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 0%, transparent 25%),
                  radial-gradient(circle at 80% 20%, rgba(160, 82, 45, 0.08) 0%, transparent 30%),
                  radial-gradient(circle at 40% 70%, rgba(139, 69, 19, 0.06) 0%, transparent 35%),
                  radial-gradient(circle at 90% 80%, rgba(160, 82, 45, 0.05) 0%, transparent 25%),
                  linear-gradient(135deg, #fef7cd 0%, #fde68a 20%, #fed7aa 40%, #fde68a 60%, #fef3c7 80%, #fffbeb 100%)
                `,
                boxShadow: 'inset 0 2px 4px rgba(139, 69, 19, 0.1), inset 0 -2px 4px rgba(139, 69, 19, 0.05)',
              }}
            >
              {/* Parchment texture overlay */}
              <div 
                className="absolute inset-0 rounded-xl opacity-30"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 1px,
                      rgba(139, 69, 19, 0.03) 1px,
                      rgba(139, 69, 19, 0.03) 2px
                    ),
                    repeating-linear-gradient(
                      -45deg,
                      transparent,
                      transparent 1px,
                      rgba(160, 82, 45, 0.02) 1px,
                      rgba(160, 82, 45, 0.02) 2px
                    )
                  `
                }}
              ></div>
              
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
              </div>
            </div>

            <div className="text-center pt-8">
              <p className="text-lg text-black leading-relaxed italic mb-6 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                Thank you for visiting! I hope you enjoy the stories and come back often to see what's new.
              </p>
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-block cursor-pointer font-handwritten">
                Send Me a Message
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
