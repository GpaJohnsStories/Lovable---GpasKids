
import { renderCategoryBadge } from "@/utils/categoryUtils";
import { Headphones, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { calculateReadingTime } from "@/utils/readingTimeUtils";

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

  const handleReadStory = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Stop any currently playing audio
      if (isPlaying) {
        console.log('🛑 Stopping audio playback');
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        if (audioCleanup) {
          audioCleanup();
        }
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentAudio(null);
        setAudioCleanup(null);
        toast({
          title: "Reading stopped",
          description: "Audio playback has been stopped",
        });
        return;
      }

      setIsPlaying(true);
      setIsLoading(true);
      
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

      // Convert dashes to natural pauses for better speech flow
      // M-dash (—) becomes multiple periods for longer pause, n-dash (–) becomes ellipsis for shorter pause
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

      const audioUrls: string[] = [];
      
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
          audioUrls.forEach(url => URL.revokeObjectURL(url));
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
          audioUrls.forEach(url => URL.revokeObjectURL(url));
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
        audioUrls.push(audioUrl);
      }

      console.log(`✅ Generated ${audioUrls.length} audio segments`);
      setIsLoading(false);

      let currentSegment = 0;
      let currentPlayingAudio: HTMLAudioElement | null = null;
      let shouldStop = false;
      
      // Create cleanup function
      const cleanup = () => {
        console.log('🧹 Cleaning up audio resources');
        shouldStop = true;
        if (currentPlayingAudio) {
          currentPlayingAudio.pause();
          currentPlayingAudio.currentTime = 0;
        }
        audioUrls.forEach(url => URL.revokeObjectURL(url));
      };
      
      setAudioCleanup(() => cleanup);
      
      const playNextSegment = async () => {
        if (shouldStop || currentSegment >= audioUrls.length) {
          if (!shouldStop) {
            console.log('🎵 All audio segments completed');
          }
          setIsPlaying(false);
          setCurrentAudio(null);
          setAudioCleanup(null);
          cleanup();
          return;
        }

        console.log(`🎵 Starting segment ${currentSegment + 1}/${audioUrls.length}`);
        
        const audio = new Audio(audioUrls[currentSegment]);
        currentPlayingAudio = audio;
        setCurrentAudio(audio);
        
        // Create a promise that resolves when audio ends or errors
        const playPromise = new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            console.log(`🎵 Segment ${currentSegment + 1} completed`);
            resolve();
          };
          
          audio.onerror = (e) => {
            console.error('❌ Audio playback error:', e);
            reject(e);
          };
        });

        try {
          if (shouldStop) return;
          
          await audio.play();
          await playPromise; // Wait for audio to finish
          
          // Only proceed to next segment if we should continue
          if (!shouldStop && currentPlayingAudio === audio) {
            currentSegment++;
            await playNextSegment(); // Wait for next segment to complete
          }
        } catch (error) {
          if (!shouldStop) {
            console.error('❌ Audio play error:', error);
            setIsPlaying(false);
            setCurrentAudio(null);
            setAudioCleanup(null);
            cleanup();
            toast({
              title: "Audio playback error",
              description: "Failed to play the generated audio",
              variant: "destructive",
            });
          }
        }
      };

      // Start playing the first segment
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
                ? "Click to stop reading" 
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
              ? "Stop Reading" 
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
            <span className="text-amber-600 font-medium">{calculateReadingTime(content || description || '')}</span>
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
