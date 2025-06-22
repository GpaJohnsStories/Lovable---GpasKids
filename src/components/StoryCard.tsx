
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, User, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getCategoryButtonForStory } from "@/utils/storySectionUtils";
import { StoryData } from "@/utils/storiesData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface StoryCardProps {
  story: StoryData;
}

const StoryCard = ({ story }: StoryCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const getFirstAvailablePhoto = (): string | undefined => {
    return story.photo_link_1 || story.photo_link_2 || story.photo_link_3;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleReadStory = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setIsPlaying(false);
        setCurrentAudio(null);
        return;
      }

      setIsPlaying(true);
      
      // Prepare text for reading - combine title and description
      let textToRead = `${story.title}. ${story.description}`;

      console.log('🎵 Starting voice generation for story:', story.title);

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: textToRead,
          voice: 'nova',
          speed: 0.85 // Slightly slower reading speed
        }
      });

      if (error) {
        console.error('❌ Text-to-speech error:', error);
        toast({
          title: "Error reading story",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (!data || !data.audioContent) {
        console.error('❌ No audio content returned');
        toast({
          title: "Error reading story",
          description: "No audio content was generated",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Audio content received, creating playback...');

      // Convert base64 to audio blob
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      
      audio.onended = () => {
        console.log('🎵 Audio playback ended');
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Audio playback error",
          description: "Failed to play the generated audio",
          variant: "destructive",
        });
      };

      await audio.play();
      console.log('🎵 Audio playback started successfully');
      
      toast({
        title: "Now reading story!",
        description: `Playing "${story.title}" with Nova voice`,
      });
      
    } catch (error) {
      console.error('❌ Error in handleReadStory:', error);
      setIsPlaying(false);
      setCurrentAudio(null);
      toast({
        title: "Error reading story",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const firstPhoto = getFirstAvailablePhoto();

  return (
    <div className="w-2/5 mx-auto">
      <Link to={`/story/${story.id}`} onClick={scrollToTop}>
        <Card className="story-card group cursor-pointer hover:shadow-lg transition-shadow relative" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <CardContent className="p-3 text-center relative">
            <div className="mb-2">
              {getCategoryButtonForStory(story.category, story.id)}
            </div>
            
            <div className="flex items-center justify-center mb-2">
              {firstPhoto && (
                <div className="flex-shrink-0 mr-3">
                  <img 
                    src={firstPhoto} 
                    alt={`${story.title} thumbnail`}
                    className="w-16 h-16 object-cover rounded border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-base font-bold text-amber-800 mb-1 leading-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {story.title}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center justify-center text-sm text-amber-600 mb-2">
              <User className="h-3 w-3 mr-1" />
              <span className="font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>by {story.author}</span>
            </div>
            
            <p className="text-amber-700 mb-2 leading-relaxed text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
              {story.description}
            </p>
            
            <div className="flex items-center justify-center text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <div className="flex items-center text-amber-600 font-bold">
                <BookOpen className="h-3 w-3 mr-1" />
                {story.readTime}
              </div>
            </div>

            {/* Purple 3D Read Button - positioned in bottom left */}
            <button
              onClick={handleReadStory}
              disabled={isPlaying}
              className="absolute bottom-3 left-3 z-10 bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 text-white text-xs px-2 py-1 rounded-lg font-bold shadow-[0_4px_0_#7c3aed,0_6px_12px_rgba(0,0,0,0.3)] border border-purple-700 transition-all duration-200 hover:shadow-[0_3px_0_#7c3aed,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#7c3aed,0_2px_4px_rgba(0,0,0,0.3)] flex items-center gap-1 font-fun hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 leading-tight"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '70px' }}
              title={isPlaying ? "Click to stop reading" : "Click to read this story aloud"}
            >
              <Volume2 className="h-3 w-3 flex-shrink-0" />
              <span className="text-[10px]">
                {isPlaying ? "Stop Reading" : "Please Read This Story"}
              </span>
            </button>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default StoryCard;
