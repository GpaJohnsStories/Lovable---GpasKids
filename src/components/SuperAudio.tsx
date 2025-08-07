import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Play, Pause, RotateCcw, Square } from 'lucide-react';

interface SuperAudioProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
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
  content,
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
  const [duration, setDuration] = useState(audioDuration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    
    setIsLoading(true);
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
      })
      .catch((err) => {
        console.error('Audio play failed:', err);
        setError('Failed to play audio');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [audioUrl]);

  const handlePause = useCallback(() => {
    if (!audioRef.current) return;
    
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

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  const handleSpeedChange = useCallback((speed: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.playbackRate = speed;
    setPlaybackRate(speed);
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

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

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content 
          ref={dialogRef}
          className="fixed max-w-none max-h-none p-0 bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-orange-300 rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing z-50"
          style={{
            width: '288px',
            height: '330px',
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
            
            {/* 4x4 Button Grid - Bottom 60% */}
            <div className="h-[60%]">
              <div className="grid grid-cols-4 max-w-[220px] mx-auto h-full" style={{ gridTemplateRows: '1fr 0.35fr 0.5fr 1fr' }}>
                {/* Row 1: Main Audio Controls */}
                <button 
                  className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                    transform hover:scale-105 hover:shadow-xl active:scale-95
                    transition-all duration-200 flex items-center justify-center
                    relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, #16a34a 0%, #15803d 100%)`,
                    boxShadow: `0 8px 20px rgba(22, 163, 74, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
                  }}
                  onClick={(e) => {e.stopPropagation(); handlePlay();}}
                  disabled={!audioUrl || isLoading || isPlaying}
                >
                  <Play className="w-6 h-6 text-white drop-shadow-sm" fill="white" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </button>

                <button 
                  className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                    transform hover:scale-105 hover:shadow-xl active:scale-95
                    transition-all duration-200 flex items-center justify-center
                    relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, #F2BA15 0%, #d39e00 100%)`,
                    boxShadow: `0 8px 20px rgba(242, 186, 21, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
                  }}
                  onClick={(e) => {e.stopPropagation(); handlePause();}}
                  disabled={!audioUrl || !isPlaying}
                >
                  <Pause className="w-6 h-6 text-white drop-shadow-sm" fill="white" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </button>

                <button 
                  className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                    transform hover:scale-105 hover:shadow-xl active:scale-95
                    transition-all duration-200 flex items-center justify-center
                    relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, #169CF9 0%, #0284c7 100%)`,
                    boxShadow: `0 8px 20px rgba(22, 156, 249, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
                  }}
                  onClick={(e) => {e.stopPropagation(); handleRestart();}}
                  disabled={!audioUrl}
                >
                  <RotateCcw className="w-6 h-6 text-white drop-shadow-sm" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </button>

                <button 
                  className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                    transform hover:scale-105 hover:shadow-xl active:scale-95
                    transition-all duration-200 flex items-center justify-center
                    relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, #DC2626 0%, #b91c1c 100%)`,
                    boxShadow: `0 8px 20px rgba(220, 38, 38, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
                  }}
                  onClick={(e) => {e.stopPropagation(); handleStop();}}
                  disabled={!audioUrl}
                >
                  <Square className="w-5 h-5 text-white drop-shadow-sm" fill="white" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </button>

                {/* Row 2: Progress bar spanning all 4 columns */}
                <div className="col-span-4 border-2 border-white/40 rounded-lg shadow-lg flex items-center justify-center p-1" style={{ backgroundColor: '#3b82f6' }}>
                  <div className="w-full max-w-[180px] relative">
                    {/* Progress track */}
                    <div 
                      className="w-full h-2 bg-gray-300/50 rounded-full relative overflow-hidden cursor-pointer"
                      onClick={handleSeek}
                    >
                      {/* Progress fill */}
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${progressPercentage}%`,
                          background: 'linear-gradient(to right, #4ade80, #22c55e)'
                        }}
                      ></div>
                      {/* Progress handle */}
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 border-2 border-blue-500 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
                        style={{ 
                          left: `calc(${progressPercentage}% - 8px)`,
                          background: '#F2BA15'
                        }}
                      ></div>
                    </div>
                    {/* Time labels */}
                    <div className="flex justify-between mt-1 text-xs text-white font-bold">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    {/* Error display */}
                    {error && (
                      <div className="text-red-200 text-xs text-center mt-1">
                        {error}
                      </div>
                    )}
                    {/* Loading indicator */}
                    {isLoading && (
                      <div className="text-white text-xs text-center mt-1">
                        Loading...
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3: Speed Controls Header */}
                <div 
                  className="col-span-4 border-t-2 border-l-2 border-r-2 border-white/40 shadow-lg flex items-center justify-center rounded-t-lg"
                  style={{ backgroundColor: '#814d2e' }}
                >
                  <span className="text-white text-sm font-bold font-fun">Playback Speed</span>
                </div>

                {/* Row 4: Speed Controls */}
                <div className="flex items-center justify-center rounded-bl-lg" style={{ backgroundColor: '#814d2e' }}>
                  <button 
                    className={`w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                      transform hover:scale-105 hover:shadow-xl active:scale-95
                      transition-all duration-200 flex flex-col items-center justify-center
                      relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
                      ${playbackRate === 1 ? 'ring-2 ring-yellow-400' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, hsl(120, 50%, 60%) 0%, hsl(120, 50%, 50%) 100%)`,
                      boxShadow: `0 8px 20px rgba(34, 139, 34, 0.3), inset 0 2px 4px rgba(255,255,255,0.3)`
                    }}
                    onClick={(e) => {e.stopPropagation(); handleSpeedChange(1);}}
                    disabled={!audioUrl}
                  >
                    <span className="font-bold text-xs drop-shadow-sm font-fun" style={{ color: '#814d2e' }}>Normal</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  </button>
                </div>

                <div className="flex items-center justify-center" style={{ backgroundColor: '#814d2e' }}>
                  <button 
                    className={`w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                      transform hover:scale-105 hover:shadow-xl active:scale-95
                      transition-all duration-200 flex flex-col items-center justify-center
                      relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
                      ${playbackRate === 1.25 ? 'ring-2 ring-yellow-400' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, hsl(120, 50%, 55%) 0%, hsl(120, 50%, 45%) 100%)`,
                      boxShadow: `0 8px 20px rgba(34, 139, 34, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
                    }}
                    onClick={(e) => {e.stopPropagation(); handleSpeedChange(1.25);}}
                    disabled={!audioUrl}
                  >
                    <span className="font-bold text-xs drop-shadow-sm font-fun" style={{ color: '#FFFDD0' }}>Fast</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  </button>
                </div>

                <div className="flex items-center justify-center" style={{ backgroundColor: '#814d2e' }}>
                  <button 
                    className={`w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                      transform hover:scale-105 hover:shadow-xl active:scale-95
                      transition-all duration-200 flex flex-col items-center justify-center
                      relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
                      ${playbackRate === 1.5 ? 'ring-2 ring-yellow-400' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, hsl(120, 55%, 45%) 0%, hsl(120, 55%, 35%) 100%)`,
                      boxShadow: `0 8px 20px rgba(34, 139, 34, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)`
                    }}
                    onClick={(e) => {e.stopPropagation(); handleSpeedChange(1.5);}}
                    disabled={!audioUrl}
                  >
                    <span className="font-bold text-xs drop-shadow-sm font-fun" style={{ color: '#E6C966' }}>Faster</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  </button>
                </div>

                <div className="flex items-center justify-center rounded-br-lg" style={{ backgroundColor: '#814d2e' }}>
                  <button 
                    className={`w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                      transform hover:scale-105 hover:shadow-xl active:scale-95
                      transition-all duration-200 flex flex-col items-center justify-center
                      relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
                      ${playbackRate === 2 ? 'ring-2 ring-yellow-400' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, #228B22 0%, #1e7a1e 100%)`,
                      boxShadow: `0 8px 20px rgba(34, 139, 34, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)`
                    }}
                    onClick={(e) => {e.stopPropagation(); handleSpeedChange(2);}}
                    disabled={!audioUrl}
                  >
                    <span className="font-bold text-xs drop-shadow-sm font-fun" style={{ color: '#F2BA15' }}>Fastest</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};