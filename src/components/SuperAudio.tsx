import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";

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
          style={{
            // CSS Reset for complete isolation
            all: 'unset',
            boxSizing: 'border-box',
            
            // Position and size
            position: 'fixed',
            width: '288px',
            height: '380px',
            left: `calc(10% + ${position.x}px)`,
            top: `calc(5% + ${position.y}px)`,
            zIndex: 50,
            maxWidth: 'none',
            maxHeight: 'none',
            
            // Appearance
            background: 'linear-gradient(to bottom, #fffbeb, #fed7aa)',
            border: '4px solid #fdba74',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            cursor: isDragging ? 'grabbing' : 'grab',
            
            // Font reset
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#000000',
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
            style={{ display: 'none' }}
          />
        )}
        
        {/* Close button - Top Right Corner */}
        <button
          onClick={onClose}
          style={{
            all: 'unset',
            boxSizing: 'border-box',
            position: 'absolute',
            top: '8px',
            right: '16px',
            zIndex: 10,
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '4px',
            paddingBottom: '4px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            border: 'none',
            outline: 'none',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Close
        </button>

        {/* Content Area - Full popup */}
        <div style={{
          all: 'unset',
          boxSizing: 'border-box',
          display: 'block',
          height: '100%',
          padding: '4px',
        }}>
          <div style={{
            all: 'unset',
            boxSizing: 'border-box',
            display: 'block',
            height: 'calc(100% - 8px)',
            width: 'calc(100% - 8px)',
            margin: '0 auto',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            padding: '16px',
            backdropFilter: 'blur(4px)',
            border: '1px solid #fed7aa',
          }}>
            {/* Title and Author at top */}
            <div style={{
              all: 'unset',
              boxSizing: 'border-box',
              display: 'block',
              textAlign: 'center',
              height: '40%',
              paddingTop: '8px',
            }}>
              <h3 style={{
                all: 'unset',
                boxSizing: 'border-box',
                display: 'block',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#F97316',
                margin: '0',
                padding: '0',
                lineHeight: '1.2',
              }}>{title}</h3>
              {showAuthor && author && (
                <p style={{
                  all: 'unset',
                  boxSizing: 'border-box',
                  display: 'block',
                  fontSize: '14px',
                  color: '#6b7280',
                  marginTop: '4px',
                  margin: '4px 0 0 0',
                  padding: '0',
                }}>by {author}</p>
              )}
              {voiceName && (
                <p style={{
                  all: 'unset',
                  boxSizing: 'border-box',
                  display: 'block',
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginTop: '4px',
                  margin: '4px 0 0 0',
                  padding: '0',
                }}><br />Being read by {voiceName} from OpenAI</p>
              )}
            </div>
            
            {/* Audio Controls */}
            <div style={{
              all: 'unset',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {/* Play/Pause/Stop/Restart buttons */}
              <div style={{
                all: 'unset',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={handlePlay}
                  disabled={!audioUrl || isLoading}
                  style={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    backgroundColor: !audioUrl || isLoading ? '#9ca3af' : '#10b981',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: !audioUrl || isLoading ? 'not-allowed' : 'pointer',
                    border: 'none',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!(!audioUrl || isLoading)) {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!audioUrl || isLoading)) {
                      e.currentTarget.style.backgroundColor = '#10b981';
                    }
                  }}
                >
                  Play
                </button>
                
                <button
                  onClick={handlePause}
                  disabled={!audioUrl || isLoading}
                  style={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    backgroundColor: !audioUrl || isLoading ? '#9ca3af' : '#f59e0b',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: !audioUrl || isLoading ? 'not-allowed' : 'pointer',
                    border: 'none',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!(!audioUrl || isLoading)) {
                      e.currentTarget.style.backgroundColor = '#d97706';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!audioUrl || isLoading)) {
                      e.currentTarget.style.backgroundColor = '#f59e0b';
                    }
                  }}
                >
                  Pause
                </button>
                
                <button
                  onClick={handleRestart}
                  disabled={!audioUrl}
                  style={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    backgroundColor: !audioUrl ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: !audioUrl ? 'not-allowed' : 'pointer',
                    border: 'none',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!(!audioUrl)) {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!audioUrl)) {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                    }
                  }}
                >
                  Restart
                </button>
                
                <button
                  onClick={handleStop}
                  disabled={!audioUrl}
                  style={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    backgroundColor: !audioUrl ? '#9ca3af' : '#ef4444',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: !audioUrl ? 'not-allowed' : 'pointer',
                    border: 'none',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!(!audioUrl)) {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!audioUrl)) {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                    }
                  }}
                >
                  Stop
                </button>
              </div>
              
              {/* Speed Controls */}
              <div style={{
                all: 'unset',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                gap: '4px',
                flexWrap: 'wrap',
              }}>
                {[
                  { speed: 0.75, label: 'Slow' },
                  { speed: 1, label: 'Normal' },
                  { speed: 1.25, label: 'Fast' },
                  { speed: 1.5, label: 'Faster' }
                ].map(({ speed, label }) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    disabled={!audioUrl}
                    style={{
                      all: 'unset',
                      boxSizing: 'border-box',
                      padding: '4px 8px',
                      backgroundColor: !audioUrl ? '#9ca3af' : (playbackRate === speed ? '#fbbf24' : '#e5e7eb'),
                      color: !audioUrl ? 'white' : (playbackRate === speed ? 'white' : '#374151'),
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      cursor: !audioUrl ? 'not-allowed' : 'pointer',
                      border: playbackRate === speed ? '2px solid #f59e0b' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!(!audioUrl) && playbackRate !== speed) {
                        e.currentTarget.style.backgroundColor = '#d1d5db';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!(!audioUrl) && playbackRate !== speed) {
                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              {/* Time display */}
              <div style={{
                all: 'unset',
                boxSizing: 'border-box',
                display: 'block',
                textAlign: 'center',
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '4px',
              }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            {/* Table */}
            <table style={{
              all: 'unset',
              boxSizing: 'border-box',
              display: 'table',
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <tbody style={{
                all: 'unset',
                boxSizing: 'border-box',
                display: 'table-row-group',
              }}>
                <tr style={{ 
                  all: 'unset',
                  boxSizing: 'border-box',
                  display: 'table-row',
                  height: '27.5px' 
                }}>
                  <td style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: '#2563eb' 
                  }}></td>
                  <td style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: '#2563eb' 
                  }}></td>
                  <td style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: '#2563eb' 
                  }}></td>
                  <td style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: '#2563eb' 
                  }}></td>
                </tr>
                <tr style={{ 
                  all: 'unset',
                  boxSizing: 'border-box',
                  display: 'table-row',
                  height: '55px' 
                }}>
                  <td style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: '#2563eb' 
                  }}></td>
                  <td style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: '#2563eb' 
                  }}></td>
                  <td style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: '#2563eb' 
                  }}></td>
                  <td style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: '#2563eb' 
                  }}></td>
                </tr>
                <tr style={{ 
                  all: 'unset',
                  boxSizing: 'border-box',
                  display: 'table-row',
                  height: '27.5px' 
                }}>
                  <td colSpan={4} style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: 'transparent', 
                    border: 'none' 
                  }}></td>
                </tr>
                <tr style={{ 
                  all: 'unset',
                  boxSizing: 'border-box',
                  display: 'table-row',
                  height: '27.5px' 
                }}>
                  <td colSpan={4} style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: '#8B4513' 
                  }}></td>
                </tr>
                <tr style={{ 
                  all: 'unset',
                  boxSizing: 'border-box',
                  display: 'table-row',
                  height: '55px' 
                }}>
                  <td colSpan={4} style={{ 
                    all: 'unset',
                    boxSizing: 'border-box',
                    display: 'table-cell',
                    backgroundColor: '#8B4513' 
                  }}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};