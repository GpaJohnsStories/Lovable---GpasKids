
import { renderCategoryBadge } from "@/utils/categoryUtils";
import { Headphones, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioCleanup, setAudioCleanup] = useState<(() => void) | null>(null);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [audioGenerated, setAudioGenerated] = useState(false);

  // Cleanup audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (audioCleanup) {
        audioCleanup();
      }
    };
  }, [audioCleanup]);

  const playNextSegment = async (segmentIndex?: number) => {
    const segment = segmentIndex !== undefined ? segmentIndex : currentSegment;
    
    if (segment >= audioUrls.length) {
      console.log('🎵 All audio segments completed');
      setIsPlaying(false);
      setCurrentAudio(null);
      setCurrentSegment(0);
      return;
    }

    console.log(`🎵 Starting segment ${segment + 1}/${audioUrls.length}`);
    
    const audio = new Audio(audioUrls[segment]);
    audio.volume = 1.0;
    setCurrentAudio(audio);
    
    // Handle audio end - move to next segment
    audio.onended = () => {
      console.log(`🎵 Segment ${segment + 1} completed`);
      const nextSegment = segment + 1;
      setCurrentSegment(nextSegment);
      
      // Small delay before next segment to ensure state updates
      setTimeout(() => {
        if (nextSegment < audioUrls.length) {
          playNextSegment(nextSegment);
        } else {
          setIsPlaying(false);
          setCurrentAudio(null);
          setCurrentSegment(0);
        }
      }, 100);
    };
    
    audio.onerror = (e) => {
      console.error('❌ Audio playback error:', e);
      setIsPlaying(false);
      setCurrentAudio(null);
      toast({
        title: "Audio playback error",
        description: "Failed to play the generated audio",
        variant: "destructive",
      });
    };

    try {
      await audio.play();
    } catch (error) {
      console.error('❌ Audio play error:', error);
      setIsPlaying(false);
      setCurrentAudio(null);
      toast({
        title: "Audio playback error",
        description: "Failed to play the generated audio",
        variant: "destructive",
      });
    }
  };

  const handleReadStory = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // If currently playing, pause it
      if (isPlaying && currentAudio) {
        console.log('⏸️ Pausing audio playback');
        currentAudio.pause();
        setIsPlaying(false);
        setIsPaused(true);
        toast({
          title: "Reading paused",
          description: "Audio playback has been paused. Click again to resume.",
        });
        return;
      }

      // If paused and audio exists, resume playback
      if (isPaused && currentAudio && audioGenerated) {
        console.log('▶️ Resuming audio playback');
        setIsPlaying(true);
        setIsPaused(false);
        await currentAudio.play();
        toast({
          title: "Reading resumed",
          description: "Audio playback has been resumed",
        });
        return;
      }

      // If audio already generated and not playing, start from beginning
      if (audioGenerated && audioUrls.length > 0) {
        console.log('🔄 Restarting audio from beginning');
        setCurrentSegment(0);
        setIsPlaying(true);
        setIsPaused(false);
        playNextSegment();
        return;
      }

      // Generate new audio if not already generated
      setIsPlaying(true);
      setIsLoading(true);
      
      // Prepare text for reading - combine title, subtitle, author, description, and content
      let textToRead = `${title}`;
      
      // Add tagline/subtitle if available
      if (tagline) {
        textToRead += `. ${tagline}`;
      }
      
      // Add author information
      textToRead += `. By ${author}`;
      
      // Add description/excerpt if available
      if (description) {
        textToRead += `. ${description}`;
      }
      
      // Add main content
      if (content) {
        // Strip HTML tags from content for better speech
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const cleanContent = tempDiv.textContent || tempDiv.innerText || '';
        textToRead += ` ${cleanContent}`;
      }

      // Convert dashes to natural pauses for better speech flow
      const processTextForSpeech = (text: string) => {
        return text
          .replace(/—/g, '... ... ...')  // M-dash: longer pause with multiple periods
          .replace(/–/g, '...');         // N-dash: shorter pause with ellipsis
      };
      
      textToRead = processTextForSpeech(textToRead);

      console.log('🎵 Starting voice generation for story:', title);

      // Split text into chunks of ~4000 characters (leaving buffer for API limit)
      const chunkSize = 4000;
      const textChunks: string[] = [];
      
      if (textToRead.length <= chunkSize) {
        textChunks.push(textToRead);
      } else {
        let currentPos = 0;
        while (currentPos < textToRead.length) {
          let chunkEnd = currentPos + chunkSize;
          
          // Try to break at sentence boundaries to avoid cutting words
          if (chunkEnd < textToRead.length) {
            const nearbyPeriod = textToRead.lastIndexOf('.', chunkEnd);
            const nearbyExclamation = textToRead.lastIndexOf('!', chunkEnd);
            const nearbyQuestion = textToRead.lastIndexOf('?', chunkEnd);
            const bestBreak = Math.max(nearbyPeriod, nearbyExclamation, nearbyQuestion);
            
            if (bestBreak > currentPos + chunkSize * 0.7) {
              chunkEnd = bestBreak + 1;
            }
          }
          
          textChunks.push(textToRead.slice(currentPos, chunkEnd));
          currentPos = chunkEnd;
        }
      }

      const newAudioUrls: string[] = [];
      
      toast({
        title: "Preparing your story...",
        description: textChunks.length > 1 
          ? `Generating ${textChunks.length} audio segments for "${title}"`
          : `Generating audio for "${title}"`,
      });
      
      // Generate audio for each chunk
      for (let i = 0; i < textChunks.length; i++) {
        const chunk = textChunks[i];
        console.log(`🎵 Generating audio for segment ${i + 1}/${textChunks.length}`);
        
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: {
            text: chunk,
            voice: 'nova',
            speed: 0.85
          }
        });

        if (error) {
          console.error('❌ Text-to-speech error:', error);
          // Clean up any audio URLs we've created so far
          newAudioUrls.forEach(url => URL.revokeObjectURL(url));
          setIsPlaying(false);
          setIsLoading(false);
          setCurrentAudio(null);
          toast({
            title: "Error reading story",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (!data || !data.audioContent) {
          console.error('❌ No audio content returned');
          newAudioUrls.forEach(url => URL.revokeObjectURL(url));
          setIsPlaying(false);
          setIsLoading(false);
          setCurrentAudio(null);
          toast({
            title: "Error reading story",
            description: "No audio content was generated",
            variant: "destructive",
          });
          return;
        }

        // Convert base64 to audio blob
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let j = 0; j < binaryString.length; j++) {
          bytes[j] = binaryString.charCodeAt(j);
        }
        
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        newAudioUrls.push(audioUrl);
      }

      console.log(`✅ Generated ${newAudioUrls.length} audio segments`);
      setAudioUrls(newAudioUrls);
      setAudioGenerated(true);
      setCurrentSegment(0);
      setIsLoading(false);

      // Create cleanup function that only runs on component unmount or page leave
      const cleanup = () => {
        console.log('🧹 Cleaning up audio resources');
        newAudioUrls.forEach(url => URL.revokeObjectURL(url));
        setAudioUrls([]);
        setAudioGenerated(false);
        setCurrentSegment(0);
        setIsPaused(false);
      };
      
      setAudioCleanup(() => cleanup);

      // Start playing from the first segment
      playNextSegment();
      
      toast({
        title: "Now reading story!",
        description: textChunks.length > 1 
          ? `Playing "${title}" in ${textChunks.length} segments with Nova voice`
          : `Playing "${title}" with Nova voice`,
      });
      
    } catch (error) {
      console.error('❌ Error in handleReadStory:', error);
      setIsPlaying(false);
      setIsLoading(false);
      setCurrentAudio(null);
      setAudioCleanup(null);
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
          disabled={isLoading}
          className={`mr-4 text-white text-sm px-3 py-2 rounded-lg font-bold shadow-[0_4px_0_#7c3aed,0_6px_12px_rgba(0,0,0,0.3)] border border-purple-700 transition-all duration-200 flex items-center gap-2 font-fun ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 hover:shadow-[0_3px_0_#7c3aed,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#7c3aed,0_2px_4px_rgba(0,0,0,0.3)] hover:from-purple-500 hover:via-purple-600 hover:to-purple-700'
          }`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          title={
            isLoading 
              ? "Preparing audio..." 
              : isPlaying 
                ? "Click to pause reading" 
                : isPaused
                  ? "Click to resume reading"
                  : audioGenerated
                    ? "Click to play the story again"
                    : "Click to read this story aloud"
          }
        >
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Headphones className="h-4 w-4" />
          )}
          {isLoading 
            ? "Preparing your story for audio..." 
            : isPlaying 
              ? "Pause Reading" 
              : isPaused
                ? "Resume Reading"
                : audioGenerated
                  ? "Play Again"
                  : "Please read this to me."
          }
        </button>

        <h1 className="text-3xl font-bold text-orange-800 text-center leading-tight">
          {title}
        </h1>
      </div>

      {tagline && (
        <h2 className="text-xl text-orange-700 text-center mb-4 italic font-medium" style={{ fontFamily: 'Georgia, serif' }}>
          {tagline}
        </h2>
      )}

      <div className="flex items-center justify-center space-x-6 text-sm text-orange-600 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="flex items-center">
          <span className="font-medium">by {author}</span>
        </div>
        {showStoryCode && storyCode ? (
          <div className="flex items-center space-x-4">
            <span>Story Code: {storyCode}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-lg text-orange-700 text-center mb-6 italic" style={{ fontFamily: 'Georgia, serif' }}>
          {description}
        </p>
      )}
    </>
  );
};

export default StoryHeader;
