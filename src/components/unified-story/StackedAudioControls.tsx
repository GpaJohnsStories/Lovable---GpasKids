
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
      <div className={`space-y-3 ${className}`}>
        {/* Control Buttons Row */}
        <div className="flex items-center justify-center gap-3">
          {/* Play Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handlePlay}
                disabled={isLoading || isPlaying}
                className={`w-14 h-14 rounded-xl font-bold shadow-[0_4px_0_#16a34a,0_6px_12px_rgba(0,0,0,0.3)] border-2 border-green-600 transition-all duration-200 flex items-center justify-center ${
                  isLoading || isPlaying
                    ? 'bg-gray-400 shadow-[0_2px_0_#6b7280,0_3px_6px_rgba(0,0,0,0.2)] cursor-not-allowed' 
                    : 'bg-gradient-to-b from-green-400 via-green-500 to-green-600 text-white hover:shadow-[0_3px_0_#16a34a,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#16a34a,0_2px_4px_rgba(0,0,0,0.3)]'
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
                className={`w-14 h-14 rounded-xl font-bold shadow-[0_4px_0_#d97706,0_6px_12px_rgba(0,0,0,0.3)] border-2 border-amber-600 transition-all duration-200 flex items-center justify-center ${
                  !isPlaying
                    ? 'bg-gray-400 shadow-[0_2px_0_#6b7280,0_3px_6px_rgba(0,0,0,0.2)] cursor-not-allowed' 
                    : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-white hover:shadow-[0_3px_0_#d97706,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#d97706,0_2px_4px_rgba(0,0,0,0.3)]'
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
                className={`w-14 h-14 rounded-xl font-bold shadow-[0_4px_0_#dc2626,0_6px_12px_rgba(0,0,0,0.3)] border-2 border-red-600 transition-all duration-200 flex items-center justify-center ${
                  !audioGenerated
                    ? 'bg-gray-400 shadow-[0_2px_0_#6b7280,0_3px_6px_rgba(0,0,0,0.2)] cursor-not-allowed' 
                    : 'bg-gradient-to-b from-red-400 via-red-500 to-red-600 text-white hover:shadow-[0_3px_0_#dc2626,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#dc2626,0_2px_4px_rgba(0,0,0,0.3)]'
                }`}
              >
                <Square className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop</p>
            </TooltipContent>
          </Tooltip>

          {/* Start Over Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleStartOver}
                disabled={isLoading || !audioGenerated}
                className={`w-14 h-14 rounded-xl font-bold shadow-[0_4px_0_#7c3aed,0_6px_12px_rgba(0,0,0,0.3)] border-2 border-purple-600 transition-all duration-200 flex items-center justify-center ${
                  isLoading || !audioGenerated
                    ? 'bg-gray-400 shadow-[0_2px_0_#6b7280,0_3px_6px_rgba(0,0,0,0.2)] cursor-not-allowed' 
                    : 'bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 text-white hover:shadow-[0_3px_0_#7c3aed,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#7c3aed,0_2px_4px_rgba(0,0,0,0.3)]'
                }`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 12a9 9 0 1 1 9 9 9 9 0 0 1-9-9zm4.5-4.5v9l7-4.5-7-4.5z"/>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start Over</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center">
                <Volume2 className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Volume: {volume}%</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex gap-2">
            {[25, 50, 75, 100].map((vol, index) => (
              <Tooltip key={vol}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleVolumeChange(vol)}
                    className={`px-3 py-2 rounded-lg font-bold border-2 transition-all duration-200 text-white h-10 min-w-[50px] flex items-center justify-center ${
                      volume === vol
                        ? 'bg-green-600 border-green-700 shadow-[0_3px_0_#16a34a,0_4px_8px_rgba(0,0,0,0.3)] translate-y-1'
                        : `border-green-600 hover:translate-y-0.5 shadow-[0_3px_0_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.3)] ${
                            index === 0 ? 'bg-gradient-to-b from-green-300 to-green-400' :
                            index === 1 ? 'bg-gradient-to-b from-green-400 to-green-500' :
                            index === 2 ? 'bg-gradient-to-b from-green-500 to-green-600' :
                            'bg-gradient-to-b from-green-600 to-green-700'
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
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                <Gauge className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Speed: {playbackRate}x</p>
            </TooltipContent>
          </Tooltip>
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
                    className={`px-3 py-2 rounded-lg font-bold border-2 transition-all duration-200 text-white h-10 min-w-[50px] flex items-center justify-center ${
                      playbackRate === speed
                        ? 'bg-blue-600 border-blue-700 shadow-[0_3px_0_#2563eb,0_4px_8px_rgba(0,0,0,0.3)] translate-y-1'
                        : `border-blue-600 hover:translate-y-0.5 shadow-[0_3px_0_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.3)] ${
                            index === 0 ? 'bg-gradient-to-b from-blue-300 to-blue-400' :
                            index === 1 ? 'bg-gradient-to-b from-blue-400 to-blue-500' :
                            index === 2 ? 'bg-gradient-to-b from-blue-500 to-blue-600' :
                            'bg-gradient-to-b from-blue-600 to-blue-700'
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
