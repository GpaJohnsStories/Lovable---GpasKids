
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Loader, Volume2, Gauge } from "lucide-react";
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
  const [volume, setVolume] = useState(100);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Cleanup audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      // Reset to defaults when component unmounts
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
      
      // Add OpenAI attribution for help content
      if (context === 'help-popup') {
        textToRead += `. Audio was read by Nova voice from OpenAI.`;
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

  // Size configurations
  const sizeConfig = {
    sm: {
      buttonSize: 'w-8 h-8',
      iconSize: 'h-3 w-3',
      fontSize: 'text-xs',
      padding: 'p-1',
      gap: 'gap-1'
    },
    md: {
      buttonSize: 'w-10 h-10',
      iconSize: 'h-4 w-4',
      fontSize: 'text-sm',
      padding: 'p-2',
      gap: 'gap-2'
    },
    lg: {
      buttonSize: 'w-12 h-12',
      iconSize: 'h-5 w-5',
      fontSize: 'text-base',
      padding: 'p-2',
      gap: 'gap-3'
    }
  };

  const config = sizeConfig[size];

  // Show disabled state if no audio is available
  if (!canPlayAudio()) {
    return (
      <div className={`flex items-center justify-center ${config.gap} ${config.padding} bg-gray-100 rounded-lg border border-gray-200 ${className}`}>
        <span className="text-gray-500 text-sm">No audio available</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`${config.padding} bg-white/80 rounded-lg border border-blue-200 ${className}`}>
        {/* Compact Table Layout - 2x3 Grid */}
        <table className="w-full border-spacing-1" style={{ borderCollapse: 'separate' }}>
          <tbody>
            {/* Row 1: Audio Controls (Play, Pause) | Volume Controls */}
            <tr>
              <td className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handlePlay}
                      disabled={isLoading || isPlaying}
                      className={`${config.buttonSize} rounded-lg font-bold shadow-[0_2px_0_#22c55e] border border-green-600 transition-all duration-200 flex items-center justify-center ${
                        isLoading || isPlaying
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-b from-green-400 to-green-600 text-white hover:translate-y-0.5 active:translate-y-1'
                      }`}
                    >
                      {isLoading ? (
                        <Loader className={`${config.iconSize} animate-spin`} />
                      ) : (
                        <Play className={`${config.iconSize} ml-0.5`} />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Play</p>
                  </TooltipContent>
                </Tooltip>
              </td>
              <td className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handlePause}
                      disabled={!isPlaying}
                      className={`${config.buttonSize} rounded-lg font-bold shadow-[0_2px_0_#f59e0b] border border-amber-600 transition-all duration-200 flex items-center justify-center ${
                        !isPlaying
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-b from-amber-400 to-amber-600 text-white hover:translate-y-0.5 active:translate-y-1'
                      }`}
                    >
                      <Pause className={config.iconSize} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pause</p>
                  </TooltipContent>
                </Tooltip>
              </td>
              <td className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${config.buttonSize} rounded-lg bg-gradient-to-b from-green-400 to-green-600 text-white flex items-center justify-center shadow-[0_2px_0_#16a34a] border border-green-600`}>
                      <Volume2 className={config.iconSize} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Volume: {volume}%</p>
                  </TooltipContent>
                </Tooltip>
              </td>
            </tr>

            {/* Row 2: More Audio Controls (Stop, Start Over) | Speed Controls */}
            <tr>
              <td className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleStop}
                      disabled={!audioGenerated}
                      className={`${config.buttonSize} rounded-lg font-bold shadow-[0_2px_0_#ef4444] border border-red-600 transition-all duration-200 flex items-center justify-center ${
                        !audioGenerated
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-b from-red-400 to-red-600 text-white hover:translate-y-0.5 active:translate-y-1'
                      }`}
                    >
                      <Square className={config.iconSize} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Stop</p>
                  </TooltipContent>
                </Tooltip>
              </td>
              <td className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleStartOver}
                      disabled={isLoading || !audioGenerated}
                      className={`${config.buttonSize} rounded-lg font-bold shadow-[0_2px_0_#7c3aed] border border-purple-600 transition-all duration-200 flex items-center justify-center ${
                        isLoading || !audioGenerated
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-b from-purple-400 to-purple-600 text-white hover:translate-y-0.5 active:translate-y-1'
                      }`}
                    >
                      <svg className={config.iconSize} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 12a9 9 0 1 1 9 9 9 9 0 0 1-9-9zm4.5-4.5v9l7-4.5-7-4.5z"/>
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start Over</p>
                  </TooltipContent>
                </Tooltip>
              </td>
              <td className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${config.buttonSize} rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-[0_2px_0_#2563eb] border border-blue-600`}>
                      <Gauge className={config.iconSize} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Speed: {playbackRate}x</p>
                  </TooltipContent>
                </Tooltip>
              </td>
            </tr>

            {/* Row 3: Volume Control Buttons */}
            <tr>
              <td className="text-center" colSpan={3}>
                <div className={`flex justify-center ${config.gap} mt-1`}>
                  {[25, 50, 75, 100].map((vol, index) => (
                    <Tooltip key={vol}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleVolumeChange(vol)}
                          className={`${config.buttonSize} rounded font-bold border transition-all duration-200 flex items-center justify-center ${config.fontSize} ${
                            volume === vol
                              ? 'bg-green-600 text-white border-green-700 shadow-md'
                              : `text-white border-green-600 hover:scale-105 ${
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
              </td>
            </tr>

            {/* Row 4: Speed Control Buttons */}
            <tr>
              <td className="text-center" colSpan={3}>
                <div className={`flex justify-center ${config.gap} mt-1`}>
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
                          className={`${config.buttonSize} rounded font-bold border transition-all duration-200 flex items-center justify-center ${config.fontSize} ${
                            playbackRate === speed
                              ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                              : `text-white border-blue-600 hover:scale-105 ${
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
};
