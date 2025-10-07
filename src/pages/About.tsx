import React, { useState, useEffect } from 'react';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SuperAV } from "@/components/SuperAV";
import { DeployedContent } from "@/components/DeployedContent";

import { AudioButton } from "@/components/AudioButton";
import { useStoryCodeLookup } from "@/hooks/useStoryCodeLookup";
import { supabase } from '@/integrations/supabase/client';

const About = () => {
  const ab5IconUrl = '/lovable-uploads/ICZ-AB5.png';
  const { lookupStoryByCode } = useStoryCodeLookup();
  const [superAVOpen, setSuperAVOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [currentAudioData, setCurrentAudioData] = useState<{
    content: string;
    title: string;
    author: string;
    audioUrl?: string;
    ai_voice_name?: string;
    audio_duration?: number;
  } | null>(null);
  const [sectionTitles, setSectionTitles] = useState<{[key: string]: string}>({
    'SYS-AGJ': 'About Grandpa John',
    'SYS-BDY': 'About Buddy', 
    'SYS-THY': 'A Special "Thank You" to ...'
  });

  // Fetch dynamic titles from webtext data
  useEffect(() => {
    const fetchSectionTitles = async () => {
      try {
        const storyCodes = ['SYS-AGJ', 'SYS-BDY', 'SYS-THY'];
        
        for (const code of storyCodes) {
          const { data, error } = await supabase
            .from('stories')
            .select('title')
            .eq('story_code', code)
            .eq('category', 'WebText')
            .maybeSingle();

          if (!error && data?.title) {
            setSectionTitles(prev => ({
              ...prev,
              [code]: data.title
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching section titles:', err);
      }
    };

    fetchSectionTitles();
  }, []);

  const handleAudioClick = async (storyCode: string) => {
    console.log('🎵 Audio button clicked for:', storyCode);
    
    const result = await lookupStoryByCode(storyCode, true);
    if (result.found && result.story) {
      const story = result.story;
      setCurrentAudioData({
        content: story.content || `Content for ${storyCode}`,
        title: story.title || sectionTitles[storyCode] || 'Story',
        author: story.author || 'Grandpa John',
        audioUrl: story.audio_url || undefined,
        ai_voice_name: story.ai_voice_name,
        audio_duration: story.audio_duration_seconds
      });
        setSuperAVOpen(true);
    } else {
      // Fallback content for each section
      const fallbackContent: Record<string, {content: string, title: string}> = {
        'SYS-AGJ': {
          content: 'With over 60 years of marriage and a lifetime of experiences, I\'ve collected stories that I\'m excited to share with children around the world. My journey has taught me valuable lessons about kindness, perseverance, and the importance of imagination.',
          title: sectionTitles['SYS-AGJ']
        },
        'SYS-BDY': {
          content: 'Buddy joined me at the end of July, 2024. It has been a rough year so far — I fell in June and broke 5 ribs — and I felt I deserved a comfort dog. He talks with me, growls, his whine is the most pathetic thing you\'ve ever heard, and he barks from soft to loud.',
          title: sectionTitles['SYS-BDY']
        },
        'SYS-THY': {
          content: 'None of this would have been possible without the incredible assistance of three amazing AI partners who have helped bring this vision to life. Each one has contributed their unique strengths to make this website a reality.',
          title: sectionTitles['SYS-THY']
        }
      };
      
      const fallback = fallbackContent[storyCode];
      if (fallback) {
        setCurrentAudioData({
          content: fallback.content,
          title: fallback.title,
          author: 'Grandpa John',
          ai_voice_name: undefined,
          audio_duration: undefined
        });
        setSuperAVOpen(true);
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <main className="container mx-auto px-4 pt-8 pb-12">
          <div className="max-w-6xl mx-auto border-4 border-blue-500 rounded-lg p-6 relative" style={{backgroundColor: '#ADD8E6'}}>
            {/* Title on left, Audio Button on right */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-amber-800" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                {sectionTitles['SYS-AGJ']}
              </h1>
              <AudioButton 
                code="SYS-AGJ"
                onClick={() => handleAudioClick('SYS-AGJ')}
                className="flex-shrink-0"
              />
            </div>

            
            <DeployedContent 
              storyCode="SYS-AGJ"
              includeAudio={false}
              className="text-lg text-black leading-relaxed font-normal"
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              fallbackContent={
                <div>
                  {/* Fallback content if deployment hasn't happened yet */}
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
              }
            />
            
            {/* Web-text code indicator */}
            <div style={{ 
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontSize: '12px',
              color: '#666',
              fontFamily: 'monospace',
              fontWeight: 'normal',
              opacity: 0.7
            }}>
              SYS-AGJ
            </div>
          </div>

          {/* About Buddy Section */}
          <div id="buddy" className="max-w-6xl mx-auto border-4 border-yellow-400 rounded-lg p-6 mt-8 bg-[hsl(var(--grass-green))] relative">
            {/* Title on left, Audio Button on right */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-amber-800" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                {sectionTitles['SYS-BDY']}
              </h1>
              <AudioButton 
                code="SYS-BDY"
                onClick={() => handleAudioClick('SYS-BDY')}
                className="flex-shrink-0"
              />
            </div>

            
            <DeployedContent 
              storyCode="SYS-BDY"
              includeAudio={false}
              className="text-lg text-black leading-relaxed font-normal"
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              fallbackContent={
                <div>
                  {/* Fallback content if deployment hasn't happened yet */}
                  
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
                </div>
              }
            />
            
            {/* Web-text code indicator */}
            <div style={{ 
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontSize: '12px',
              color: '#666',
              fontFamily: 'monospace',
              fontWeight: 'normal',
              opacity: 0.7
            }}>
              SYS-BDY
            </div>
          </div>

          {/* Special Thanks Section - Light Purple with Gold Border */}
          <div id="special-thank-you" className="max-w-6xl mx-auto border-4 border-yellow-500 rounded-lg p-6 mt-8 bg-purple-100 relative">
            {/* Title on left, Audio Button on right */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-purple-800" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                {sectionTitles['SYS-THY']}
              </h1>
              <AudioButton 
                code="SYS-THY"
                onClick={() => handleAudioClick('SYS-THY')}
                className="flex-shrink-0"
              />
            </div>

            
            {/* Responsive layout: stacked on mobile, side-by-side on larger screens */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* ICZ-AB5 Photo - simple brown border, narrow to fit portrait aspect ratio */}
              <div className="w-full md:w-2/5 lg:w-1/3 rounded-lg overflow-hidden mx-auto md:mx-0" style={{
                border: '4px solid #9c441a'
              }}>
                <img 
                  src={ab5IconUrl} 
                  alt="3 Helpful AI's - Lovabe, Copilot, and Gemini"
                  className="w-full h-auto object-contain"
                />
              </div>
              
              {/* Right: Stacked logos - responsive sizing */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3 w-full md:w-3/5 lg:w-2/3">
                {/* Lovable (#1 AI Assistant) */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="overflow-hidden rounded-lg border-4 border-yellow-400 shadow-sm cursor-pointer h-12 md:h-16 lg:h-20">
                      <img
                        src="https://hlywucxwpzbqmzssmwpj.supabase.co/storage/v1/object/public/story-photos/story-photos/1752203773244-hhgj4xbfc.png"
                        alt="#1 AI Assistant"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onLoad={() => console.log('Photo 2 loaded successfully')}
                        onError={(e) => {
                          console.error('Photo 2 failed to load:', e.currentTarget.src);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-base font-serif text-blue-900 font-semibold">#1 AI Assistant</p>
                  </TooltipContent>
                </Tooltip>
                
                {/* CoPilot (#2 AI Assistant) */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="overflow-hidden rounded-lg border-4 bg-gray-200 shadow-sm cursor-pointer h-12 md:h-16 lg:h-20" style={{ borderColor: '#C0C0C0' }}>
                      <img
                        src="https://hlywucxwpzbqmzssmwpj.supabase.co/storage/v1/object/public/story-photos/story-photos/1752203785267-p40ovhg84.png"
                        alt="#2 AI Assistant"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onLoad={() => console.log('Photo 3 loaded successfully')}
                        onError={(e) => {
                          console.error('Photo 3 failed to load:', e.currentTarget.src);
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
            </div>
            
            <DeployedContent 
              storyCode="SYS-THY"
              includeAudio={false}
              className="text-lg text-purple-800 leading-relaxed font-normal"
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              fallbackContent={
                <div className="clear-both">
                  <p className="text-lg text-purple-800 leading-relaxed mb-6 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                    None of this would have been possible without the incredible assistance of three amazing AI partners who have helped bring this vision to life. Each one has contributed their unique strengths to make this website a reality.
                  </p>
                  
                  <h2 className="text-2xl font-bold text-purple-800 mb-3" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                    My AI Dream Team
                  </h2>
                  <p className="text-lg text-purple-800 leading-relaxed mb-4 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                    These three remarkable AI assistants have been my constant companions in creating, designing, and building this special place for children. Their patience, creativity, and technical expertise have made it possible to transform my ideas into the wonderful website you see today.
                  </p>
                  <p className="text-lg text-purple-800 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                    To my AI friends: Thank you for believing in this project and for helping an old storyteller share his love of stories with children around the world. You've made an old man's dream come true!
                  </p>
                </div>
              }
            />
            
            {/* Web-text code indicator */}
            <div style={{ 
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontSize: '12px',
              color: '#666',
              fontFamily: 'monospace',
              fontWeight: 'normal',
              opacity: 0.7
            }}>
              SYS-THY
            </div>
          </div>

        </main>
        
        <CookieFreeFooter />
        
        {/* SuperAV Modal */}
        {currentAudioData && (
          <SuperAV
            isOpen={superAVOpen}
            onClose={() => {
              setSuperAVOpen(false);
              setCurrentAudioData(null);
            }}
            title={currentAudioData.title}
            author={currentAudioData.author}
            voiceName={currentAudioData.ai_voice_name}
            showAuthor={true}
            audioUrl={currentAudioData.audioUrl}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default About;