import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { supabase } from '@/integrations/supabase/client';

interface StandardAudioPanelProps {
  isOpen: boolean;
  onClose: () => void;
  code?: string; // storyCode or webtextCode
  audioUrl?: string;
  title?: string;
  author?: string;
  narrator?: string;
}

export const StandardAudioPanel: React.FC<StandardAudioPanelProps> = ({
  isOpen,
  onClose,
  code,
  audioUrl: providedAudioUrl,
  title: providedTitle = "Audio Player",
  author: providedAuthor,
  narrator: providedNarrator = "Grandpa John"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Data fetching states
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { lookupStoryByCode } = useStoryCodeLookup();

  // Fetch data when code changes
  useEffect(() => {
    const fetchData = async () => {
      if (!code || !isOpen) return;
      
      setDataLoading(true);
      console.log('🎵 StandardAudioPanel fetching data for code:', code);
      
      try {
        // First check if it's a story code
        const storyData = await lookupStoryByCode(code, true);
        if (storyData) {
          console.log('📖 Found story data:', storyData);
          setFetchedData({
            type: 'story',
            title: storyData.title,
            author: storyData.author,
            narrator: storyData.ai_voice_name || "Grandpa John",
            audioUrl: storyData.audio_url
          });
        } else {
          console.log('❌ No data found for code:', code);
          setFetchedData(null);
        }
      } catch (error) {
        console.error('Error fetching data for code:', code, error);
        setFetchedData(null);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [code, isOpen, lookupStoryByCode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  // Get display values (either provided props or fetched data)
  const title = providedTitle !== "Audio Player" ? providedTitle : (fetchedData?.title || providedTitle);
  const author = providedAuthor || fetchedData?.author;
  const narrator = providedNarrator !== "Grandpa John" ? providedNarrator : (fetchedData?.narrator || providedNarrator);
  const audioUrl = providedAudioUrl || fetchedData?.audioUrl;

  // Enhanced audio event listeners with proper cleanup and error handling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    // Reset states when audio source changes
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setAudioError(null);
    setIsMetadataLoaded(false);

    const handleTimeUpdate = () => {
      if (audio && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        setIsMetadataLoaded(true);
        console.log('🎵 Audio metadata loaded, duration:', audio.duration);
      } else {
        // Fallback for problematic audio files
        setDuration(0);
        setIsMetadataLoaded(false);
        console.warn('⚠️ Audio duration is invalid or zero');
      }
    };

    const handleLoadedData = () => {
      // Additional metadata loading event for better compatibility
      if (audio && !isNaN(audio.duration) && audio.duration > 0 && !isMetadataLoaded) {
        setDuration(audio.duration);
        setIsMetadataLoaded(true);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio?.duration || 0);
    };

    const handleError = (e: Event) => {
      console.error('🚨 Audio error:', e);
      setAudioError('Failed to load audio');
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setAudioError(null);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    // Add all event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    // Initial load attempt
    setIsLoading(true);
    audio.load();

    return () => {
      // Clean up all event listeners
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [audioUrl]); // Remove isMetadataLoaded from dependency array to prevent infinite loop

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = parseFloat(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value);
    setVolume(vol);
    if (vol > 0) setIsMuted(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - 320; // panel width
    const maxY = window.innerHeight - 400; // panel height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Reset position only when panel first opens
  useEffect(() => {
    if (isOpen) {
      // Only reset if this is a fresh open (not already positioned)
      setPosition(prev => prev.x === 0 && prev.y === 0 ? { x: 50, y: 50 } : prev);
    }
  }, [isOpen]);

  const hasAudio = !!audioUrl;
  const isLoadingData = dataLoading;

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: '0',
          zIndex: 40,
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: `${position.x}px`,
            top: `${position.y}px`,
            maxWidth: '20rem',
            width: '320px',
            padding: '12px',
            background: 'linear-gradient(135deg, #fefdf8, #fef3c7)',
            border: '2px solid #fed7aa',
            borderRadius: '8px',
            maxHeight: '85vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="audio-panel-title"
          aria-describedby="audio-panel-description"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              border: '2px solid #f87171',
              color: 'white',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '900',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #b91c1c, #991b1b)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Close audio panel"
          >
            CLOSE
          </button>

          {/* Header with drag indicator */}
          <div style={{ textAlign: 'center', paddingBottom: '0', position: 'relative' }}>
            {/* Drag indicator */}
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '4px',
              backgroundColor: '#d97706',
              borderRadius: '2px',
              opacity: 0.6
            }} />
            
            <h2
              id="audio-panel-title"
              style={{
                fontSize: '20px',
                fontWeight: '900',
                color: '#7c2d12',
                lineHeight: '1.2',
                marginBottom: '4px',
                margin: '0',
                marginTop: '12px'
              }}
            >
              {title}
            </h2>
            {author && (
              <p style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#9a3412', 
                marginBottom: '4px',
                margin: '0 0 4px 0'
              }}>
                by {author}
              </p>
            )}
            <p
              id="audio-panel-description"
              style={{
                fontSize: '14px',
                color: '#374151',
                marginBottom: '0',
                margin: '0'
              }}
            >
              Read by {narrator}
            </p>
          </div>

          {audioError ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '16px', 
              backgroundColor: '#fef2f2', 
              borderRadius: '8px', 
              border: '2px solid #fca5a5',
              marginTop: '8px'
            }}>
              <p style={{ 
                color: '#dc2626', 
                fontSize: '16px', 
                fontWeight: 'bold',
                margin: '0 0 8px 0'
              }}>
                Audio Error
              </p>
              <p style={{ 
                color: '#7f1d1d', 
                fontSize: '14px',
                margin: '0'
              }}>
                {audioError}
              </p>
            </div>
          ) : hasAudio ? (
            <div style={{ marginTop: '8px' }} onMouseDown={(e) => e.stopPropagation()}>
              {/* Audio Element */}
              <audio ref={audioRef} src={audioUrl} preload="metadata" />

              {/* Main Play/Pause Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <button
                  onClick={handlePlayPause}
                  disabled={isLoading || !audioUrl}
                  style={{
                    height: '56px',
                    padding: '0 24px',
                    borderRadius: '28px',
                    background: 'linear-gradient(135deg, #16a34a, #059669)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '4px solid #4ade80',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'white',
                    cursor: audioUrl && !isLoading ? 'pointer' : 'not-allowed',
                    opacity: isLoading || !audioUrl ? '0.5' : '1',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (audioUrl && !isLoading) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #15803d, #047857)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a, #059669)';
                  }}
                  aria-label={isLoading ? "Loading audio" : isPlaying ? "Pause audio playback" : "Play audio"}
                  aria-pressed={isPlaying}
                >
                  {isLoading ? (
                    <div 
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                  ) : isPlaying ? (
                    <>
                      <Pause size={20} />
                      <span style={{ fontSize: '14px', fontWeight: '900' }}>PAUSE AUDIO</span>
                    </>
                  ) : (
                    <>
                      <Play size={20} style={{ marginLeft: '2px' }} />
                      <span style={{ fontSize: '14px', fontWeight: '900' }}>PLAY AUDIO</span>
                    </>
                  )}
                </button>
              </div>

              {/* Control Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <button
                  onClick={handleStop}
                  disabled={!audioUrl}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '28px',
                    border: '2px solid #991b1b',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    cursor: audioUrl ? 'pointer' : 'not-allowed',
                    opacity: !audioUrl ? '0.5' : '1',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (audioUrl) {
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                  aria-label="Stop audio playback and reset to beginning"
                >
                  <Square size={12} />
                  <span style={{ fontSize: '12px', fontWeight: '900' }}>STOP</span>
                </button>

                <button
                  onClick={handleRestart}
                  disabled={!audioUrl}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '28px',
                    border: '2px solid #1e40af',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    cursor: audioUrl ? 'pointer' : 'not-allowed',
                    opacity: !audioUrl ? '0.5' : '1',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (audioUrl) {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  aria-label="Restart audio from the beginning"
                >
                  <RotateCcw size={12} />
                  <span style={{ fontSize: '12px', fontWeight: '900' }}>RESTART</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                padding: '6px', 
                border: '2px solid #86efac',
                marginBottom: '8px'
              }}>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={1}
                  value={currentTime}
                  onChange={handleSeek}
                  disabled={!audioUrl}
                  style={{
                    width: '100%',
                    height: '4px',
                    appearance: 'none',
                    background: '#22c55e',
                    borderRadius: '2px',
                    cursor: audioUrl ? 'pointer' : 'not-allowed'
                  }}
                  aria-label={`Audio progress: ${formatTime(currentTime)} of ${formatTime(duration)}`}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  color: '#14532d',
                  marginTop: '4px'
                }}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume and Speed Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {/* Volume Control */}
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  padding: '8px', 
                  border: '2px solid #93c5fd'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '900', color: '#1e3a8a' }}>VOLUME</label>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      style={{
                        padding: '2px',
                        height: '20px',
                        width: '20px',
                        color: '#1e40af',
                        backgroundColor: '#dbeafe',
                        border: '1px solid #60a5fa',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bfdbfe')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    >
                      {isMuted || volume === 0 ? <VolumeX size={10} /> : <Volume2 size={10} />}
                    </button>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    style={{
                      width: '100%',
                      height: '4px',
                      appearance: 'none',
                      background: '#3b82f6',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                    aria-label={`Volume: ${isMuted ? 0 : volume} percent`}
                  />
                </div>

                {/* Speed Control */}
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  padding: '8px', 
                  border: '2px solid #c7d2fe'
                }}>
                  <label style={{ fontSize: '12px', fontWeight: '900', color: '#312e81', marginBottom: '4px', display: 'block' }}>
                    Playback Speed:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                    {[
                      { speed: 0.75, label: 'Slow' },
                      { speed: 1, label: 'Normal' },
                      { speed: 1.25, label: 'Faster' },
                      { speed: 1.5, label: 'Fastest' }
                    ].map(({ speed, label }) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackRate(speed)}
                        style={{
                          fontSize: '10px',
                          fontWeight: '900',
                          padding: '2px 4px',
                          height: '20px',
                          border: '1px solid',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          backgroundColor: playbackRate === speed ? '#4338ca' : '#e0e7ff',
                          color: playbackRate === speed ? 'white' : '#312e81',
                          borderColor: playbackRate === speed ? '#3730a3' : '#a5b4fc',
                          boxShadow: playbackRate === speed ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (playbackRate !== speed) {
                            e.currentTarget.style.backgroundColor = '#c7d2fe';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (playbackRate !== speed) {
                            e.currentTarget.style.backgroundColor = '#e0e7ff';
                          }
                        }}
                        aria-label={`Set playback speed to ${label}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : isLoadingData ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '16px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '8px', 
              border: '2px solid #d1d5db',
              marginTop: '8px'
            }}>
              <p style={{ 
                color: '#1f2937', 
                fontSize: '18px', 
                fontWeight: 'bold',
                margin: '0'
              }}>
                Loading audio content...
              </p>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '16px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '8px', 
              border: '2px solid #d1d5db',
              marginTop: '8px'
            }}>
              <p style={{ 
                color: '#1f2937', 
                fontSize: '18px', 
                fontWeight: 'bold',
                margin: '0'
              }}>
                No audio content available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animation for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Custom range input styling */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f59e0b;
          border: 2px solid #f59e0b;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f59e0b;
          border: 2px solid #f59e0b;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  );
};