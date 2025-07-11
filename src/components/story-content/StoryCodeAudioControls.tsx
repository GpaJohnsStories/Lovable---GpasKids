import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface StoryCodeAudioControlsProps {
  audioUrl?: string;
  title: string;
  content?: string;
  author: string;
  description?: string;
  aiVoiceName?: string;
}

export const StoryCodeAudioControls: React.FC<StoryCodeAudioControlsProps> = ({
  audioUrl,
  title,
  content,
  author,
  description,
  aiVoiceName
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

  const handlePlay = async () => {
    try {
      // If we have a paused audio, resume it
      if (currentAudio && isPaused) {
        setIsPlaying(true);
        setIsPaused(false);
        await currentAudio.play();
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

        toast({
          title: "Please Read It To Me",
          description: `Now playing "${title}"`,
        });
        return;
      }

      // Generate audio on-demand if no pre-generated audio
      setIsLoading(true);
      
      let textToRead = `${title}`;
      if (description) {
        textToRead += `. ${description}`;
      }
      textToRead += `. By ${author}`;
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

      toast({
        title: "Please Read It To Me",
        description: `Now playing "${title}" with Nova voice`,
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
        title: "Reading paused",
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
      title: "Reading stopped",
      description: "Audio playback has been stopped",
    });
  };

  return (
    <div className="flex items-center justify-center gap-3 my-4 p-3 bg-white/80 rounded-lg border border-blue-200">
      {/* Play Button */}
      <button
        onClick={handlePlay}
        disabled={isLoading || isPlaying}
        className={`text-white text-sm px-4 py-2 rounded-lg font-bold shadow-[0_4px_0_#22c55e,0_6px_12px_rgba(0,0,0,0.3)] border border-green-700 transition-all duration-200 flex items-center gap-2 ${
          isLoading || isPlaying
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-b from-green-400 via-green-500 to-green-600 hover:shadow-[0_3px_0_#22c55e,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#22c55e,0_2px_4px_rgba(0,0,0,0.3)] hover:from-green-500 hover:via-green-600 hover:to-green-700'
        }`}
        title={isLoading ? "Generating audio..." : isPlaying ? "Currently playing" : "Start reading the story"}
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        {isLoading ? "Loading..." : "Please Read It To Me"}
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
  );
};