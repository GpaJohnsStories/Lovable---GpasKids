
import { renderCategoryBadge } from "@/utils/categoryUtils";
import { Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface StoryHeaderProps {
  title: string;
  category: string;
  author: string;
  createdAt: string;
  tagline?: string;
  storyCode?: string;
  showStoryCode?: boolean;
  content?: string;
  description?: string;
}

const StoryHeader = ({ title, category, author, createdAt, tagline, storyCode, showStoryCode = false, content, description }: StoryHeaderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

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
      
      // Prepare text for reading - combine title, description, and content
      let textToRead = `${title}`;
      if (description) {
        textToRead += `. ${description}`;
      }
      if (content) {
        // Strip HTML tags from content for better speech
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const cleanContent = tempDiv.textContent || tempDiv.innerText || '';
        textToRead += ` ${cleanContent}`;
      }

      console.log('🎵 Starting voice generation for story:', title);

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
      console.log('🎵 Audio playbook started successfully');
      
      toast({
        title: "Now reading story!",
        description: `Playing "${title}" with Nova voice`,
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

  return (
    <>
      <div className="text-center mb-6">
        {renderCategoryBadge(category)}
      </div>

      <div className="flex items-center justify-center mb-4 relative">
        {/* Purple 3D Read Button - positioned left of title */}
        <button
          onClick={handleReadStory}
          disabled={isPlaying}
          className="mr-4 bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 text-white text-sm px-3 py-2 rounded-lg font-bold shadow-[0_4px_0_#7c3aed,0_6px_12px_rgba(0,0,0,0.3)] border border-purple-700 transition-all duration-200 hover:shadow-[0_3px_0_#7c3aed,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#7c3aed,0_2px_4px_rgba(0,0,0,0.3)] flex items-center gap-2 font-fun hover:from-purple-500 hover:via-purple-600 hover:to-purple-700"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          title={isPlaying ? "Click to stop reading" : "Click to read this story aloud"}
        >
          <Volume2 className="h-4 w-4" />
          {isPlaying ? "Stop Reading" : "Please Read This Story"}
        </button>

        <h1 className="text-3xl font-bold text-orange-800 text-center leading-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center justify-center space-x-6 text-sm text-orange-600 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="flex items-center">
          <span className="font-medium">by {author}</span>
        </div>
        {showStoryCode && storyCode ? (
          <div className="flex items-center">
            <span>Story Code: {storyCode}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {tagline && (
        <p className="text-lg text-orange-700 text-center mb-6 italic" style={{ fontFamily: 'Georgia, serif' }}>
          {tagline}
        </p>
      )}
    </>
  );
};

export default StoryHeader;
