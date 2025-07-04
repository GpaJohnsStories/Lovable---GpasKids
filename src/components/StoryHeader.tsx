
import { renderCategoryBadge } from "@/utils/categoryUtils";
import { Play, Pause, Square, Loader } from "lucide-react";
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
  audioUrl?: string;
  audioSegments?: number;
  audioDuration?: number;
  aiVoiceName?: string;
  aiVoiceModel?: string;
}

const StoryHeader = ({ title, category, author, createdAt, tagline, storyCode, showStoryCode = false, content, description, audioUrl, audioSegments, audioDuration, aiVoiceName, aiVoiceModel }: StoryHeaderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioCleanup, setAudioCleanup] = useState<(() => void) | null>(null);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedPosition, setPausedPosition] = useState(0);

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

  // Generate and play audio
  const handlePlay = async () => {
    try {
      // If audio already generated and paused, resume from current position
      if (audioGenerated && audioUrls.length > 0 && isPaused && currentAudio) {
        console.log('▶️ Resuming audio playback');
        setIsPlaying(true);
        setIsPaused(false);
        currentAudio.currentTime = pausedPosition;
        await currentAudio.play();
        return;
      }

      // If audio already generated and not playing, start from beginning
      if (audioGenerated && audioUrls.length > 0) {
        console.log('🔄 Starting audio playback from beginning');
        setCurrentSegment(0);
        setIsPlaying(true);
        setIsPaused(false);
        setPausedPosition(0);
        await playNextSegment(0);
        return;
      }

      // First priority: Use pre-generated audio from database if available
      if (audioUrl && !audioGenerated) {
        console.log('🎵 Using pre-generated audio:', audioUrl);
        setIsLoading(true);
        
        try {
          const audio = new Audio(audioUrl);
          audio.volume = 1.0;
          setCurrentAudio(audio);
          setAudioUrls([audioUrl]);
          setAudioGenerated(true);
          setCurrentSegment(0);
          setIsLoading(false);
          setIsPlaying(true);
          setIsPaused(false);
          setPausedPosition(0);

          // Handle audio events
          audio.onended = () => {
            console.log('🎵 Pre-generated audio completed');
            setIsPlaying(false);
            setCurrentAudio(null);
            setCurrentSegment(0);
          };

          audio.onerror = (e) => {
            console.error('❌ Pre-generated audio playback error:', e);
            setIsPlaying(false);
            setCurrentAudio(null);
            setAudioGenerated(false);
            setAudioUrls([]);
            toast({
              title: "Audio playback error",
              description: "Failed to play pre-generated audio",
              variant: "destructive",
            });
          };

          await audio.play();
          
          const segmentText = audioSegments ? ` (${audioSegments} segments)` : '';
          toast({
            title: "Now reading story!",
            description: `Playing pre-generated audio for "${title}"${segmentText}`,
          });
          
          return;
        } catch (error) {
          console.error('❌ Error playing pre-generated audio:', error);
          setIsLoading(false);
          setIsPlaying(false);
          setCurrentAudio(null);
          // Fall through to on-demand generation
        }
      }

      // Fallback: Generate audio on-demand (existing logic)
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

      console.log('🎵 Starting on-demand voice generation for story:', title);

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
      setIsPlaying(true);
      setIsPaused(false);
      setPausedPosition(0);

      // Create cleanup function that only runs on component unmount or page leave
      const cleanup = () => {
        console.log('🧹 Cleaning up audio resources');
        newAudioUrls.forEach(url => URL.revokeObjectURL(url));
        setAudioUrls([]);
        setAudioGenerated(false);
        setCurrentSegment(0);
      };
      
      setAudioCleanup(() => cleanup);

      // Start playing from the first segment
      await playNextSegment(0);
      
      toast({
        title: "Now reading story!",
        description: textChunks.length > 1 
          ? `Playing "${title}" in ${textChunks.length} segments with Nova voice`
          : `Playing "${title}" with Nova voice`,
      });
      
    } catch (error) {
      console.error('❌ Error in handlePlay:', error);
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

  // Pause audio playback
  const handlePause = () => {
    if (currentAudio && isPlaying) {
      console.log('⏸️ Pausing audio playback');
      setPausedPosition(currentAudio.currentTime);
      setIsPaused(true);
      currentAudio.pause();
      setIsPlaying(false);
      toast({
        title: "Reading paused",
        description: "Audio playback has been paused",
      });
    }
  };

  // Stop and reset audio
  const handleStop = () => {
    if (currentAudio) {
      console.log('⏹️ Stopping audio playback');
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
    setIsPaused(false);
    setPausedPosition(0);
    setCurrentSegment(0);
    toast({
      title: "Reading stopped",
      description: "Audio playback has been stopped and reset",
    });
  };

  return (
    <>
      <div className="text-center mb-6">
        {renderCategoryBadge(category)}
      </div>

      <div className="flex items-center justify-center mb-4 relative">
        {/* Three separate audio control buttons */}
        <div className="flex items-center gap-3 mr-4">
          {/* Play Button */}
          <button
            onClick={handlePlay}
            disabled={isLoading || isPlaying}
            className={`text-white text-sm px-3 py-2 rounded-lg font-bold shadow-[0_4px_0_#22c55e,0_6px_12px_rgba(0,0,0,0.3)] border border-green-700 transition-all duration-200 flex items-center gap-2 ${
              isLoading || isPlaying
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-b from-green-400 via-green-500 to-green-600 hover:shadow-[0_3px_0_#22c55e,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#22c55e,0_2px_4px_rgba(0,0,0,0.3)] hover:from-green-500 hover:via-green-600 hover:to-green-700'
            }`}
            title={isLoading ? "Generating audio..." : isPlaying ? "Currently playing" : "Start playing the story"}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isLoading ? "Loading..." : "Play"}
          </button>

          {/* Pause Button */}
          <button
            onClick={handlePause}
            disabled={!isPlaying}
            className={`text-white text-sm px-3 py-2 rounded-lg font-bold shadow-[0_4px_0_#f59e0b,0_6px_12px_rgba(0,0,0,0.3)] border border-amber-700 transition-all duration-200 flex items-center gap-2 ${
              !isPlaying
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:shadow-[0_3px_0_#f59e0b,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#f59e0b,0_2px_4px_rgba(0,0,0,0.3)] hover:from-amber-500 hover:via-amber-600 hover:to-amber-700'
            }`}
            title={isPlaying ? "Pause audio playback" : "No audio playing"}
          >
            <Pause className="h-4 w-4" />
            Pause
          </button>

          {/* Stop Button */}
          <button
            onClick={handleStop}
            disabled={!audioGenerated}
            className={`text-white text-sm px-3 py-2 rounded-lg font-bold shadow-[0_4px_0_#ef4444,0_6px_12px_rgba(0,0,0,0.3)] border border-red-700 transition-all duration-200 flex items-center gap-2 ${
              !audioGenerated
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-b from-red-400 via-red-500 to-red-600 hover:shadow-[0_3px_0_#ef4444,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#ef4444,0_2px_4px_rgba(0,0,0,0.3)] hover:from-red-500 hover:via-red-600 hover:to-red-700'
            }`}
            title={audioGenerated ? "Stop and reset audio" : "No audio to stop"}
          >
            <Square className="h-4 w-4" />
            Stop
          </button>
        </div>

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

      {aiVoiceName && audioUrl && (
        <div className="text-center mb-4">
          <p className="text-sm text-orange-600 italic" style={{ fontFamily: 'Georgia, serif' }}>
            Story is read by {aiVoiceName} AI voice from OpenAI
          </p>
        </div>
      )}
    </>
  );
};

export default StoryHeader;
