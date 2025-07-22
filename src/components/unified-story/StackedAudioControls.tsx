
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Loader, Volume2, Gauge } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StackedAudioControlsProps {
  audioUrl?: string;
  title: string;
  content?: string;
  author?: string;
  allowTextToSpeech?: boolean;
  context?: string;
  className?: string;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  aiVoiceName?: string;
}

export const StackedAudioControls: React.FC<StackedAudioControlsProps> = ({
  audioUrl,
  title,
  content,
  author,
  allowTextToSpeech = false,
  context = 'unified-story-system',
  className = '',
  onPlayStart,
  onPlayEnd,
  aiVoiceName
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(100);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Cleanup audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      setVolume(100);
      setPlaybackRate(1.0);
    };
  }, [currentAudio]);

  // Apply volume changes to current audio
  useEffect(() => {
    if (currentAudio) {
      currentAudio.volume = volume / 100;
    }
  }, [volume, currentAudio]);

  // Apply playback rate changes to current audio
  useEffect(() => {
    if (currentAudio) {
      currentAudio.playbackRate = playbackRate;
    }
  }, [playbackRate, currentAudio]);

  // Check if we can proceed with audio playback
  const canPlayAudio = () => {
    if (audioUrl) return true;
    if (allowTextToSpeech && content) return true;
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
        audio.volume = volume / 100;
        audio.playbackRate = playbackRate;
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
      audio.volume = volume / 100;
      audio.playbackRate = playbackRate;
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

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackRate(newSpeed);
  };

  // Show disabled state if no audio is available
  if (!canPlayAudio()) {
    return (
      <div className={`flex items-center justify-center p-4 bg-gray-100 rounded-lg border border-gray-200 ${className}`}>
        <span className="text-gray-500 text-sm">No audio available</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${className}`}>
        {/* Main "Please, read it to me" Button */}
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handlePlay}
                disabled={isLoading || isPlaying}
                className={`text-white px-8 py-4 text-lg rounded-lg font-bold shadow-[0_4px_0_#22c55e,0_6px_12px_rgba(0,0,0,0.3)] border border-green-700 transition-all duration-200 flex items-center gap-3 ${
                  isLoading || isPlaying
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-b from-green-400 via-green-500 to-green-600 hover:shadow-[0_3px_0_#22c55e,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#22c55e,0_2px_4px_rgba(0,0,0,0.3)] hover:from-green-500 hover:via-green-600 hover:to-green-700'
                }`}
              >
                {isLoading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
                {isLoading ? "Loading..." : "Please, read it to me"}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLoading ? "Loading..." : isPlaying ? "Currently playing" : "Start playing"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Control Buttons Row */}
        <div className="flex items-center justify-center gap-3">
          {/* Play Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handlePlay}
                disabled={isLoading || isPlaying}
                className={`w-12 h-12 rounded-lg font-bold shadow-lg transition-all duration-200 flex items-center justify-center ${
                  isLoading || isPlaying
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-600'
                }`}
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Play</p>
            </TooltipContent>
          </Tooltip>

          {/* Pause Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handlePause}
                disabled={!isPlaying}
                className={`w-12 h-12 rounded-lg font-bold shadow-lg transition-all duration-200 flex items-center justify-center ${
                  !isPlaying
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-amber-500 hover:bg-amber-600 text-white border-2 border-amber-600'
                }`}
              >
                <Pause className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pause</p>
            </TooltipContent>
          </Tooltip>

          {/* Stop Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleStop}
                disabled={!audioGenerated}
                className={`w-12 h-12 rounded-lg font-bold shadow-lg transition-all duration-200 flex items-center justify-center ${
                  !audioGenerated
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600 text-white border-2 border-red-600'
                }`}
              >
                <Square className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Volume Controls */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-medium text-gray-700">Volume</div>
          <div className="flex gap-2">
            {[25, 50, 75, 100].map((vol, index) => (
              <Tooltip key={vol}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleVolumeChange(vol)}
                    className={`px-3 py-2 rounded font-bold border-2 transition-all duration-200 text-white ${
                      volume === vol
                        ? 'bg-green-600 border-green-700 shadow-md'
                        : `border-green-600 hover:scale-105 ${
                            index === 0 ? 'bg-green-300 hover:bg-green-400' :
                            index === 1 ? 'bg-green-400 hover:bg-green-500' :
                            index === 2 ? 'bg-green-500 hover:bg-green-600' :
                            'bg-green-600 hover:bg-green-700'
                          }`
                    }`}
                  >
                    {vol}%
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Set volume to {vol}%</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-medium text-gray-700">Speed</div>
          <div className="flex gap-2">
            {[
              { speed: 0.5, label: '0.5x' },
              { speed: 1.0, label: '1x' },
              { speed: 1.5, label: '1.5x' },
              { speed: 2.0, label: '2x' }
            ].map(({ speed, label }, index) => (
              <Tooltip key={speed}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-3 py-2 rounded font-bold border-2 transition-all duration-200 text-white ${
                      playbackRate === speed
                        ? 'bg-blue-600 border-blue-700 shadow-md'
                        : `border-blue-600 hover:scale-105 ${
                            index === 0 ? 'bg-blue-300 hover:bg-blue-400' :
                            index === 1 ? 'bg-blue-400 hover:bg-blue-500' :
                            index === 2 ? 'bg-blue-500 hover:bg-blue-600' :
                            'bg-blue-600 hover:bg-blue-700'
                          }`
                    }`}
                  >
                    {label}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Set speed to {label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Voice Information */}
        {aiVoiceName && (
          <div className="text-sm text-gray-600 text-center">
            Voice: {aiVoiceName}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
