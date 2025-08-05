import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      <DialogContent className="max-w-sm p-6">
        {/* Header */}
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-lg font-bold text-primary leading-tight">
            {title}
          </DialogTitle>
          {author && (
            <p className="text-sm text-muted-foreground">by {author}</p>
          )}
          <p className="text-sm text-muted-foreground font-medium">
            🎭 Read by {narrator}
          </p>
        </DialogHeader>

        {hasAudio ? (
          <div className="space-y-4">
            {/* Audio Element */}
            {audioUrl && (
              <audio ref={audioRef} src={audioUrl} preload="metadata" />
            )}

            {/* Main Controls - Vertical Layout */}
            <div className="flex flex-col items-center space-y-4">
              {/* Primary Play/Pause Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      onClick={handlePlayPause}
                      disabled={isLoading || !audioUrl}
                      className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      ) : isPlaying ? (
                        <Pause className="h-6 w-6 text-white" />
                      ) : (
                        <Play className="h-6 w-6 text-white ml-0.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPlaying ? 'Pause' : 'Play'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Secondary Controls */}
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleStop}
                        className="h-10 w-10 rounded-full"
                        disabled={!audioUrl}
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Stop</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRestart}
                        className="h-10 w-10 rounded-full"
                        disabled={!audioUrl}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Restart</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
                disabled={!audioUrl}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 h-8 w-8"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <span className="text-xs font-medium">Volume</span>
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
            <div className="space-y-2">
              <span className="text-xs font-medium">Speed: {playbackRate}x</span>
              <div className="grid grid-cols-4 gap-1">
                {[0.75, 1, 1.25, 1.5].map((speed) => (
                  <Button
                    key={speed}
                    variant={playbackRate === speed ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlaybackRate(speed)}
                    className="text-xs py-1 h-8"
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>

            {/* Text-to-Speech Option */}
            {allowTextToSpeech && !audioUrl && (
              <div className="text-center p-4 border rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-2">
                  No audio available. Text-to-speech can be generated.
                </p>
                <Button variant="outline" size="sm" disabled>
                  Generate Audio (Coming Soon)
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-muted-foreground">
              No audio content available
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};