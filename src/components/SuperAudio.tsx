import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AudioControlButtons } from './AudioControlButtons';
import { AudioSpeedControls } from './AudioSpeedControls';

// Refactored SuperAudio component

interface SuperAudioProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  author?: string;
  voiceName?: string;
  showAuthor?: boolean;
  audioUrl?: string;
  audioDuration?: number;
}

export const SuperAudio: React.FC<SuperAudioProps> = ({
  isOpen,
  onClose,
  title,
  author,
  voiceName,
  showAuthor = true,
  audioUrl,
  audioDuration
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Audio state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log('SuperAudio props:', { audioUrl, audioDuration, title });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Audio functions
  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handlePlay = useCallback(() => {
    if (!audioRef.current || !audioUrl) return;
    
    console.log('Play button clicked, audio ready state:', audioRef.current.readyState);
    setIsLoading(true);
    setError(null);
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
        console.log('Audio playing successfully');
      })
      .catch((err) => {
        console.error('Audio play failed:', err);
        setError('Failed to play audio');
        setIsPlaying(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [audioUrl]);

  const handlePause = useCallback(() => {
    if (!audioRef.current) return;
    
    console.log('Pausing audio');
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleRestart = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) {
      handlePlay();
    }
  }, [isPlaying, handlePlay]);

  const handleSpeedChange = useCallback((speed: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.playbackRate = speed;
    setPlaybackRate(speed);
  }, []);

  // Audio event handlers and initialization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    console.log('Setting up audio with URL:', audioUrl, 'prop duration:', audioDuration);

    // Reset state when audio URL changes
    setCurrentTime(0);
    setDuration(audioDuration || 0); // Initialize with prop duration if available
    setIsPlaying(false);
    setError(null);
    setIsLoading(true);

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      if (time !== undefined && !isNaN(time)) {
        setCurrentTime(time);
      }
    };

    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
        console.log('Audio duration updated:', audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
        console.log('Audio metadata loaded, duration:', audio.duration);
      }
      // Use audioDuration prop as fallback if audio duration is not available
      else if (audioDuration && audioDuration > 0) {
        setDuration(audioDuration);
        console.log('Using prop duration as fallback:', audioDuration);
      }
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      console.log('Audio loading started');
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      console.log('Audio can play');
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setError('Failed to load audio');
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      console.log('Audio is now playing');
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    // Force load metadata and check initial state
    audio.load();
    console.log('Audio element loaded, initial duration:', audio.duration, 'readyState:', audio.readyState);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, [audioUrl, audioDuration]);

  // Cleanup audio when component unmounts or modal closes
  useEffect(() => {
    if (!isOpen) {
      handleStop();
    }
  }, [isOpen, handleStop]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content 
          ref={dialogRef}
          className="fixed max-w-none max-h-none p-0 bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-orange-300 rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing z-50"
          style={{
            width: '288px',
            height: '380px',
            left: `calc(10% + ${position.x}px)`,
            top: `calc(5% + ${position.y}px)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onInteractOutside={(e) => e.preventDefault()}
        >
        {/* Hidden audio element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            crossOrigin="anonymous"
          />
        )}
        {/* Close button - Top Right Corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 z-10 px-3 py-1 hover:bg-white/30 rounded-lg transition-colors font-bold text-sm"
          style={{ backgroundColor: '#3b82f6', color: 'white' }}
        >
          Close
        </button>

        {/* Content Area - Full popup */}
        <div className="h-full p-1">
          <div className="h-[98%] w-[98%] mx-auto bg-white/50 rounded-xl p-4 backdrop-blur-sm border border-orange-200">
            {/* Title and Author at top - 40% */}
            <div className="text-center h-[40%] pt-2">
              <h3 className="text-xl font-bold font-fun" style={{ color: '#F97316' }}>{title}</h3>
              {showAuthor && author && (
                <p className="text-sm text-gray-600 mt-1">by {author}</p>
              )}
              {voiceName && (
                <p className="text-xs text-gray-500 mt-1"><br />Being read by {voiceName} from OpenAI</p>
              )}
            </div>
            
            {/* Spacer to push grid to bottom - 20% */}
            <div className="h-[20%]"></div>
            
            {/* 2x4 Button Grid - Bottom 40% */}
            <div className="h-[40%]">
              <div className="grid grid-cols-4 max-w-[220px] mx-auto h-full" style={{ gridTemplateRows: '1fr 0.67fr' }}>
                {/* Row 1: Main Audio Controls */}
                <AudioControlButtons
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onRestart={handleRestart}
                  onStop={handleStop}
                  isPlaying={isPlaying}
                  isLoading={isLoading}
                  audioUrl={audioUrl}
                />

                {/* Row 2: Speed Controls - reduced by 1/3 */}
                <AudioSpeedControls
                  playbackRate={playbackRate}
                  onSpeedChange={handleSpeedChange}
                  audioUrl={audioUrl}
                />
              </div>
            </div>
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};