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
        {/* Compact Header */}
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-base font-bold text-orange-700 leading-tight">
            {title}
          </DialogTitle>
          {author && (
            <p className="text-xs text-orange-600">by {author}</p>
          )}
          <p className="text-xs text-amber-700 font-medium bg-amber-100 rounded-full px-2 py-1 inline-block">
            🎭 Read by {narrator}
          </p>
        </DialogHeader>

        {hasAudio ? (
          <div className="space-y-3">
            {/* Audio Element */}
            {audioUrl && (
              <audio ref={audioRef} src={audioUrl} preload="metadata" />
            )}

            {/* Main Play/Pause Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handlePlayPause}
                disabled={isLoading || !audioUrl}
                className="h-14 w-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg border-2 border-green-300"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white ml-0.5" />
                )}
              </Button>
            </div>

            {/* Control Buttons with Labels */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleStop}
                className="flex flex-col items-center gap-1 h-12 bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
                disabled={!audioUrl}
              >
                <Square className="h-3 w-3" />
                <span className="text-xs font-medium">Stop</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleRestart}
                className="flex flex-col items-center gap-1 h-12 bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                disabled={!audioUrl}
              >
                <RotateCcw className="h-3 w-3" />
                <span className="text-xs font-medium">Restart</span>
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 bg-white/70 rounded-lg p-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
                disabled={!audioUrl}
              />
              <div className="flex justify-between text-xs text-amber-700">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="bg-white/70 rounded-lg p-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-700">Volume</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 h-6 w-6 text-purple-600 hover:bg-purple-100"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-3 w-3" />
                  ) : (
                    <Volume2 className="h-3 w-3" />
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
            <div className="bg-white/70 rounded-lg p-2 space-y-2">
              <span className="text-xs font-medium text-indigo-700">Speed: {playbackRate}x</span>
              <div className="grid grid-cols-4 gap-1">
                {[0.75, 1, 1.25, 1.5].map((speed) => (
                  <Button
                    key={speed}
                    variant={playbackRate === speed ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlaybackRate(speed)}
                    className={`text-xs py-1 h-7 ${
                      playbackRate === speed 
                        ? "bg-indigo-600 text-white border-indigo-600" 
                        : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                    }`}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>

            {/* Text-to-Speech Option */}
            {allowTextToSpeech && !audioUrl && (
              <div className="text-center p-3 border-2 border-dashed border-amber-300 rounded-lg bg-amber-50">
                <p className="text-xs text-amber-700 mb-2">
                  No audio available. Text-to-speech can be generated.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled
                  className="bg-amber-100 border-amber-300 text-amber-700"
                >
                  Generate Audio (Coming Soon)
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              No audio content available
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};