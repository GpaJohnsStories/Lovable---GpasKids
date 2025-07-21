
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UniversalAudioControlsProps {
  audioUrl?: string;
  title: string;
  content?: string;
  author?: string;
  description?: string;
  allowTextToSpeech?: boolean;
  context?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

export const UniversalAudioControls: React.FC<UniversalAudioControlsProps> = ({
  audioUrl,
  title,
  content,
  author,
  description,
  allowTextToSpeech = false,
  context = 'default',
  className = "",
  size = 'md',
  onPlayStart,
  onPlayEnd
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Cleanup audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [currentAudio]);

  // Check if we can proceed with audio playback
  const canPlayAudio = () => {
    if (audioUrl) return true;
    if (allowTextToSpeech && (content || description)) return true;
    return false;
  };

  const handlePlay = async () => {
    try {
      // If we have a paused audio, resume it
      if (currentAudio && isPaused) {
        setIsPlaying(true);
        setIsPaused(false);
        await currentAudio.play();
        onPlayStart?.();
        return;
      }

      // If we have a pre-generated audio URL, use it
      if (audioUrl) {
        setIsLoading(true);
        const audio = new Audio(audioUrl);
        audio.volume = 1.0;
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          setIsPaused(false);
          onPlayEnd?.();
        };

        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          setIsPlaying(false);
          setCurrentAudio(null);
          setIsLoading(false);
          toast({
            title: "Audio playback error",
            description: "Failed to play the audio",
            variant: "destructive",
          });
        };

        await audio.play();
        setIsLoading(false);
        setIsPlaying(true);
        setIsPaused(false);
        setAudioGenerated(true);
        onPlayStart?.();

        toast({
          title: "Now playing",
          description: `Playing "${title}"`,
        });
        return;
      }

      // If no pre-generated audio and TTS is not allowed, show error
      if (!allowTextToSpeech) {
        toast({
          title: "No audio available",
          description: "Pre-recorded audio is not available for this content",
          variant: "destructive",
        });
        return;
      }

      // Generate audio on-demand if TTS is allowed
      setIsLoading(true);
      
      let textToRead = `${title}`;
      if (description) {
        textToRead += `. ${description}`;
      }
      if (author) {
        textToRead += `. By ${author}`;
      }
      if (content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const cleanContent = tempDiv.textContent || tempDiv.innerText || '';
        textToRead += ` ${cleanContent}`;
      }

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: textToRead,
          voice: 'nova',
          speed: 0.85
        }
      });

      if (error) {
        console.error('Text-to-speech error:', error);
        setIsLoading(false);
        toast({
          title: "Error generating audio",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (!data || !data.audioContent) {
        setIsLoading(false);
        toast({
          title: "Error generating audio",
          description: "No audio content was generated",
          variant: "destructive",
        });
        return;
      }

      // Convert base64 to audio blob
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const generatedAudioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(generatedAudioUrl);
      audio.volume = 1.0;
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        setIsPaused(false);
        URL.revokeObjectURL(generatedAudioUrl);
        onPlayEnd?.();
      };

      audio.onerror = (e) => {
        console.error('Generated audio playback error:', e);
        setIsPlaying(false);
        setCurrentAudio(null);
        setIsLoading(false);
        URL.revokeObjectURL(generatedAudioUrl);
        toast({
          title: "Audio playback error",
          description: "Failed to play the generated audio",
          variant: "destructive",
        });
      };

      await audio.play();
      setIsLoading(false);
      setIsPlaying(true);
      setIsPaused(false);
      setAudioGenerated(true);
      onPlayStart?.();

      toast({
        title: "Now playing",
        description: `Playing "${title}" with Nova voice`,
      });

    } catch (error) {
      console.error('Error in handlePlay:', error);
      setIsPlaying(false);
      setIsLoading(false);
      setCurrentAudio(null);
      toast({
        title: "Error playing audio",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePause = () => {
    if (currentAudio && isPlaying) {
      currentAudio.pause();
      setIsPlaying(false);
      setIsPaused(true);
      toast({
        title: "Playback paused",
        description: "Audio playback has been paused",
      });
    }
  };

  const handleStop = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
    setIsPaused(false);
    setAudioGenerated(false);
    toast({
      title: "Playback stopped",
      description: "Audio playback has been stopped",
    });
  };

  const handleStartOver = async () => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
    setIsPaused(false);
    setAudioGenerated(false);
    
    // Wait a moment then start playing again
    setTimeout(() => {
      handlePlay();
    }, 100);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'p-2',
      button: 'text-xs px-2 py-1',
      icon: 'h-3 w-3',
      gap: 'gap-2'
    },
    md: {
      container: 'p-3',
      button: 'text-sm px-3 py-2',
      icon: 'h-4 w-4',
      gap: 'gap-3'
    },
    lg: {
      container: 'p-4',
      button: 'text-base px-4 py-3',
      icon: 'h-5 w-5',
      gap: 'gap-4'
    }
  };

  const config = sizeConfig[size];

  // Show disabled state if no audio is available
  if (!canPlayAudio()) {
    return (
      <div className={`flex items-center justify-center ${config.gap} ${config.container} bg-gray-100 rounded-lg border border-gray-200 ${className}`}>
        <span className="text-gray-500 text-sm">No audio available</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`flex items-center justify-center ${config.gap} ${config.container} bg-white/80 rounded-lg border border-blue-200 ${className}`}>
        {/* Play Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handlePlay}
              disabled={isLoading || isPlaying}
              className={`text-white ${config.button} rounded-lg font-bold shadow-[0_4px_0_#22c55e,0_6px_12px_rgba(0,0,0,0.3)] border border-green-700 transition-all duration-200 flex items-center gap-2 ${
                isLoading || isPlaying
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-b from-green-400 via-green-500 to-green-600 hover:shadow-[0_3px_0_#22c55e,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#22c55e,0_2px_4px_rgba(0,0,0,0.3)] hover:from-green-500 hover:via-green-600 hover:to-green-700'
              }`}
            >
              {isLoading ? (
                <Loader className={`${config.icon} animate-spin`} />
              ) : (
                <Play className={config.icon} />
              )}
              {size !== 'sm' && (isLoading ? "Loading..." : "Please, read it to me")}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLoading ? "Loading..." : isPlaying ? "Currently playing" : "Start playing"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Pause Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handlePause}
              disabled={!isPlaying}
              className={`text-white ${config.button} rounded-lg font-bold shadow-[0_4px_0_#f59e0b,0_6px_12px_rgba(0,0,0,0.3)] border border-amber-700 transition-all duration-200 flex items-center gap-2 ${
                !isPlaying
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:shadow-[0_3px_0_#f59e0b,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#f59e0b,0_2px_4px_rgba(0,0,0,0.3)] hover:from-amber-500 hover:via-amber-600 hover:to-amber-700'
              }`}
            >
              <Pause className={config.icon} />
              {size === 'lg' && "Pause"}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPlaying ? "Pause playback" : "No audio playing"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Stop Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleStop}
              disabled={!audioGenerated}
              className={`text-white ${config.button} rounded-lg font-bold shadow-[0_4px_0_#ef4444,0_6px_12px_rgba(0,0,0,0.3)] border border-red-700 transition-all duration-200 flex items-center gap-2 ${
                !audioGenerated
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-b from-red-400 via-red-500 to-red-600 hover:shadow-[0_3px_0_#ef4444,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#ef4444,0_2px_4px_rgba(0,0,0,0.3)] hover:from-red-500 hover:via-red-600 hover:to-red-700'
              }`}
            >
              <Square className={config.icon} />
              {size === 'lg' && "Stop"}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{audioGenerated ? "Stop and reset audio" : "No audio to stop"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Start Over Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleStartOver}
              disabled={isLoading || !audioGenerated}
              className={`text-white ${config.button} rounded-lg font-bold shadow-[0_4px_0_#7c3aed,0_6px_12px_rgba(0,0,0,0.3)] border border-purple-700 transition-all duration-200 flex items-center gap-2 ${
                isLoading || !audioGenerated
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 hover:shadow-[0_3px_0_#7c3aed,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#7c3aed,0_2px_4px_rgba(0,0,0,0.3)] hover:from-purple-500 hover:via-purple-600 hover:to-purple-700'
              }`}
            >
              <svg className={config.icon} fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 1 1 9 9 9 9 0 0 1-9-9zm4.5-4.5v9l7-4.5-7-4.5z"/>
              </svg>
              {size === 'lg' && "Start Over"}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{audioGenerated ? "Stop and start from the beginning" : "No audio to restart"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
