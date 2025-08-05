import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
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
      <DialogContent className="max-w-xs p-3 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
        {/* Compact Header - Minimal spacing */}
        <DialogHeader className="text-center pb-0">
          <DialogTitle className="text-xl font-black text-orange-900 leading-tight mb-1">
            {title}
          </DialogTitle>
          {author && (
            <p className="text-base font-bold text-orange-800 mb-1">by {author}</p>
          )}
          <p className="text-sm text-gray-700 mb-0">
            🎭 Read by {narrator}
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
                className="h-14 px-6 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-xl border-4 border-green-400 flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : isPlaying ? (
                  <>
                    <Pause className="h-5 w-5 text-white" />
                    <span className="text-sm font-black text-white">PAUSE AUDIO</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 text-white ml-0.5" />
                    <span className="text-sm font-black text-white">PLAY AUDIO</span>
                  </>
                )}
              </Button>
            </div>

            {/* Control Buttons - Half height, inline layout */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleStop}
                disabled={!audioUrl}
                style={{ 
                  backgroundColor: '#dc2626',
                  borderColor: '#991b1b',
                  color: 'white'
                }}
                className="flex items-center justify-center gap-2 h-7 border-2 shadow-md rounded hover:bg-red-700 disabled:opacity-50"
              >
                <Square className="h-3 w-3" />
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
                className="flex items-center justify-center gap-2 h-7 border-2 shadow-md rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="text-xs font-black">RESTART</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 bg-white rounded-lg p-2 border-2 border-amber-300">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
                disabled={!audioUrl}
              />
              <div className="flex justify-between text-sm font-bold text-amber-900">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="bg-white rounded-lg p-2 space-y-2 border-2 border-purple-300">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-purple-900">VOLUME</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 h-8 w-8 text-purple-800 hover:bg-purple-200 border-2 border-purple-400 bg-purple-100"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
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
                className="w-full"
              />
            </div>

            {/* Speed Control */}
            <div className="bg-white rounded-lg p-2 space-y-2 border-2 border-indigo-300">
              <span className="text-base font-black text-indigo-900">SPEED: {playbackRate}x</span>
              <div className="grid grid-cols-4 gap-1">
                {[0.75, 1, 1.25, 1.5].map((speed) => (
                  <Button
                    key={speed}
                    variant={playbackRate === speed ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlaybackRate(speed)}
                    className={`text-sm font-black py-1 h-8 border-2 ${
                      playbackRate === speed 
                        ? "bg-indigo-700 text-white border-indigo-800 shadow-lg" 
                        : "bg-indigo-100 text-indigo-900 border-indigo-400 hover:bg-indigo-200"
                    }`}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>

            {/* Text-to-Speech Option */}
            {allowTextToSpeech && !audioUrl && (
              <div className="text-center p-3 border-2 border-dashed border-amber-400 rounded-lg bg-amber-100">
                <p className="text-sm font-bold text-amber-900 mb-2">
                  No audio available. Text-to-speech can be generated.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled
                  className="bg-amber-200 border-2 border-amber-500 text-amber-900 font-bold"
                >
                  Generate Audio (Coming Soon)
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
            <p className="text-gray-800 text-lg font-bold">
              No audio content available
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};