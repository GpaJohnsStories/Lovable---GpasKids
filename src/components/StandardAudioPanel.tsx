import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
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

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const hasAudio = audioUrl || (allowTextToSpeech && content);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-xs p-3 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 max-h-[85vh] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audio-panel-title"
        aria-describedby="audio-panel-description"
      >
        {/* Compact Header - Minimal spacing */}
        <DialogHeader className="text-center pb-0">
          <DialogTitle 
            id="audio-panel-title"
            className="text-xl font-black text-orange-900 leading-tight mb-1 text-center"
          >
            {title}
          </DialogTitle>
          {author && (
            <p className="text-base font-bold text-orange-800 mb-1 text-center">by {author}</p>
          )}
          <p 
            id="audio-panel-description"
            className="text-sm text-gray-700 mb-0 text-center"
          >
            Read by {narrator}
          </p>
        </DialogHeader>

        {hasAudio ? (
          <div className="space-y-2 mt-0.5">
            {/* Audio Element */}
            {audioUrl && (
              <audio ref={audioRef} src={audioUrl} preload="metadata" />
            )}

            {/* Main Play/Pause Button - Pill shaped with internal label */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handlePlayPause}
                disabled={isLoading || !audioUrl}
                className="h-14 px-6 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-xl border-4 border-green-400 flex items-center gap-2 focus:ring-4 focus:ring-green-300 focus:ring-offset-2 transition-all duration-200"
                aria-label={isLoading ? "Loading audio" : isPlaying ? "Pause audio playback" : "Play audio"}
                aria-pressed={isPlaying}
                aria-describedby={isLoading ? "loading-status" : undefined}
              >
                {isLoading ? (
                  <div 
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                    aria-hidden="true"
                  />
                ) : isPlaying ? (
                  <>
                    <Pause className="h-5 w-5 text-white" aria-hidden="true" />
                    <span className="text-sm font-black text-white">PAUSE AUDIO</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 text-white ml-0.5" aria-hidden="true" />
                    <span className="text-sm font-black text-white">PLAY AUDIO</span>
                  </>
                )}
              </Button>
              {isLoading && (
                <div id="loading-status" className="sr-only">
                  Audio is loading, please wait
                </div>
              )}
            </div>

            {/* Control Buttons - Half height, inline layout */}
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Audio playback controls">
              <button
                onClick={handleStop}
                disabled={!audioUrl}
                style={{ 
                  backgroundColor: '#dc2626',
                  borderColor: '#991b1b',
                  color: 'white'
                }}
                className="flex items-center justify-center gap-2 h-7 border-2 shadow-md rounded hover:bg-red-700 disabled:opacity-50 focus:ring-2 focus:ring-red-300 focus:ring-offset-1 transition-all duration-150"
                aria-label="Stop audio playback and reset to beginning"
              >
                <Square className="h-3 w-3" aria-hidden="true" />
                <span className="text-xs font-black">STOP</span>
              </button>

              <button
                onClick={handleRestart}
                disabled={!audioUrl}
                style={{ 
                  backgroundColor: '#2563eb',
                  borderColor: '#1e40af',
                  color: 'white'
                }}
                className="flex items-center justify-center gap-2 h-7 border-2 shadow-md rounded hover:bg-blue-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 transition-all duration-150"
                aria-label="Restart audio from the beginning"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                <span className="text-xs font-black">RESTART</span>
              </button>
            </div>

            {/* Progress Bar - Reduced height */}
            <div className="space-y-1 bg-white rounded-lg p-1.5 border-2 border-green-300">
              <Label htmlFor="audio-progress" className="sr-only">
                Audio progress: {formatTime(currentTime)} of {formatTime(duration)}
              </Label>
              <Slider
                id="audio-progress"
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                style={{
                  "--slider-track": "#dcfce7",
                  "--slider-range": "#16a34a", 
                  "--slider-thumb": "#16a34a"
                } as React.CSSProperties}
                className="w-full h-1 [&_[data-radix-slider-track]]:bg-green-200 [&_[data-radix-slider-range]]:bg-green-600 [&_[data-radix-slider-thumb]]:bg-green-600 [&_[data-radix-slider-thumb]]:border-green-600"
                disabled={!audioUrl}
                aria-label={`Audio progress: ${formatTime(currentTime)} of ${formatTime(duration)}`}
                aria-valuemin={0}
                aria-valuemax={duration || 100}
                aria-valuenow={currentTime}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              />
              <div className="flex justify-between text-xs font-bold text-green-900" aria-live="polite">
                <span aria-label="Current time">{formatTime(currentTime)}</span>
                <span aria-label="Total duration">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume and Speed Controls - 50/50 split */}
            <div className="grid grid-cols-2 gap-2">
              {/* Volume Control - 50% width */}
              <div className="bg-white rounded-lg p-2 space-y-1 border-2 border-blue-300" role="group" aria-labelledby="volume-label">
                <div className="flex items-center justify-between">
                  <Label id="volume-label" className="text-xs font-black text-blue-900">VOLUME</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-0.5 h-5 w-5 text-blue-800 hover:bg-blue-200 border border-blue-400 bg-blue-100 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    aria-pressed={isMuted}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-2.5 w-2.5" aria-hidden="true" />
                    ) : (
                      <Volume2 className="h-2.5 w-2.5" aria-hidden="true" />
                    )}
                  </Button>
                </div>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={5}
                  onValueChange={(value) => {
                    setVolume(value[0]);
                    if (value[0] > 0) setIsMuted(false);
                  }}
                  style={{
                    "--slider-track": "#dbeafe",
                    "--slider-range": "#2563eb", 
                    "--slider-thumb": "#2563eb"
                  } as React.CSSProperties}
                  className="w-full [&_[data-radix-slider-track]]:bg-blue-200 [&_[data-radix-slider-range]]:bg-blue-600 [&_[data-radix-slider-thumb]]:bg-blue-600 [&_[data-radix-slider-thumb]]:border-blue-600"
                  aria-label={`Volume: ${isMuted ? 0 : volume} percent`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={isMuted ? 0 : volume}
                  aria-valuetext={`${isMuted ? 0 : volume} percent volume`}
                />
              </div>

              {/* Speed Control - 50% width */}
              <div className="bg-white rounded-lg p-2 space-y-1 border-2 border-indigo-300" role="group" aria-labelledby="speed-label">
                <Label id="speed-label" className="text-xs font-black text-indigo-900">SPEED: {playbackRate}x</Label>
                <div className="grid grid-cols-2 gap-0.5" role="radiogroup" aria-labelledby="speed-label">
                  {[0.75, 1, 1.25, 1.5].map((speed) => (
                    <Button
                      key={speed}
                      variant={playbackRate === speed ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPlaybackRate(speed)}
                      className={`text-[10px] font-black py-0.5 h-5 px-1 border focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1 transition-all duration-150 ${
                        playbackRate === speed 
                          ? "bg-indigo-700 text-white border-indigo-800 shadow-lg" 
                          : "bg-indigo-100 text-indigo-900 border-indigo-400 hover:bg-indigo-200"
                      }`}
                      role="radio"
                      aria-checked={playbackRate === speed}
                      aria-label={`Set playback speed to ${speed} times normal`}
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Text-to-Speech Option */}
            {allowTextToSpeech && !audioUrl && (
              <div className="text-center p-3 border-2 border-dashed border-amber-400 rounded-lg bg-amber-100" role="status" aria-live="polite">
                <p className="text-sm font-bold text-amber-900 mb-2">
                  No audio available. Text-to-speech can be generated.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled
                  className="bg-amber-200 border-2 border-amber-500 text-amber-900 font-bold focus:ring-2 focus:ring-amber-300 focus:ring-offset-1"
                  aria-label="Text-to-speech generation feature coming soon"
                >
                  Generate Audio (Coming Soon)
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300" role="status" aria-live="polite">
            <p className="text-gray-800 text-lg font-bold">
              No audio content available
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};