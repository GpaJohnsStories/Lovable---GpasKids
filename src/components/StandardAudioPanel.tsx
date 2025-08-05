import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface StandardAudioPanelProps {
  isOpen: boolean;
  onClose: () => void;
  audioUrl?: string;
  title?: string;
  author?: string;
  narrator?: string;
  content?: string;
  allowTextToSpeech?: boolean;
}

export const StandardAudioPanel: React.FC<StandardAudioPanelProps> = ({
  isOpen,
  onClose,
  audioUrl,
  title = "Audio Player",
  author,
  narrator = "Grandpa John",
  content,
  allowTextToSpeech = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

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

  const hasAudio = audioUrl || (allowTextToSpeech && content);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: '0',
          zIndex: 50,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          style={{
            maxWidth: '20rem',
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #fefdf8, #fef3c7)',
            border: '2px solid #fed7aa',
            borderRadius: '8px',
            maxHeight: '85vh',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
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
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              borderRadius: '4px',
              opacity: 0.7,
              transition: 'opacity 0.2s',
              background: 'transparent',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
            aria-label="Close"
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>✕</span>
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', paddingBottom: '0' }}>
            <h2
              id="audio-panel-title"
              style={{
                fontSize: '20px',
                fontWeight: '900',
                color: '#7c2d12',
                lineHeight: '1.2',
                marginBottom: '4px',
                margin: '0'
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

          {hasAudio ? (
            <div style={{ marginTop: '8px' }}>
              {/* Audio Element */}
              {audioUrl && (
                <audio ref={audioRef} src={audioUrl} preload="metadata" />
              )}

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
                    background: '#dcfce7',
                    borderRadius: '2px',
                    cursor: audioUrl ? 'pointer' : 'not-allowed',
                    backgroundImage: `linear-gradient(to right, #15803d 0%, #15803d ${duration ? (currentTime / duration) * 100 : 0}%, #dcfce7 ${duration ? (currentTime / duration) * 100 : 0}%, #dcfce7 100%)`
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
                      background: '#dbeafe',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      backgroundImage: `linear-gradient(to right, #2563eb 0%, #2563eb ${isMuted ? 0 : volume}%, #dbeafe ${isMuted ? 0 : volume}%, #dbeafe 100%)`
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
                    SPEED: {playbackRate}x
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                    {[0.75, 1, 1.25, 1.5].map((speed) => (
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
                        aria-label={`Set playback speed to ${speed} times normal`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text-to-Speech Option */}
              {allowTextToSpeech && !audioUrl && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '12px', 
                  border: '2px dashed #f59e0b', 
                  borderRadius: '8px', 
                  backgroundColor: '#fef3c7',
                  marginTop: '8px'
                }}>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    color: '#92400e', 
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>
                    No audio available. Text-to-speech can be generated.
                  </p>
                  <button
                    disabled
                    style={{
                      backgroundColor: '#fde68a',
                      border: '2px solid #f59e0b',
                      color: '#92400e',
                      fontWeight: 'bold',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'not-allowed',
                      opacity: '0.6'
                    }}
                    aria-label="Text-to-speech generation feature coming soon"
                  >
                    Generate Audio (Coming Soon)
                  </button>
                </div>
              )}
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
          background: #15803d;
          border: 2px solid #15803d;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #15803d;
          border: 2px solid #15803d;
          cursor: pointer;
          border: none;
        }
        
        /* Volume slider styling */
        input[type="range"]:nth-of-type(2)::-webkit-slider-thumb {
          background: #2563eb;
          border-color: #2563eb;
        }
        
        input[type="range"]:nth-of-type(2)::-moz-range-thumb {
          background: #2563eb;
          border-color: #2563eb;
        }
      `}</style>
    </>
  );
};