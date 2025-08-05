import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StandardAudioPanelProps {
  isOpen: boolean;
  onClose: () => void;
  audioUrl?: string;
  title?: string;
  author?: string;
  content?: string;
  allowTextToSpeech?: boolean;
}

export const StandardAudioPanel: React.FC<StandardAudioPanelProps> = ({
  isOpen,
  onClose,
  audioUrl,
  title = "Audio Player",
  author,
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

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
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
      <DialogContent className="max-w-2xl p-8">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-2xl font-bold text-primary">
            {title}
          </DialogTitle>
          {author && (
            <p className="text-lg text-muted-foreground mt-2">by {author}</p>
          )}
        </DialogHeader>

        {hasAudio ? (
          <div className="space-y-8">
            {/* Audio Element */}
            {audioUrl && (
              <audio ref={audioRef} src={audioUrl} preload="metadata" />
            )}

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleSkipBack}
                      className="h-14 w-14 rounded-full"
                      disabled={!audioUrl}
                    >
                      <SkipBack className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Skip back 10 seconds</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      onClick={handlePlayPause}
                      disabled={isLoading || !audioUrl}
                      className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                      ) : isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white ml-1" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPlaying ? 'Pause' : 'Play'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleSkipForward}
                      className="h-14 w-14 rounded-full"
                      disabled={!audioUrl}
                    >
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Skip forward 10 seconds</TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume and Speed Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Volume Control */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <span className="text-sm font-medium">Volume</span>
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
              <div className="space-y-3">
                <span className="text-sm font-medium">Speed: {playbackRate}x</span>
                <div className="grid grid-cols-4 gap-2">
                  {[0.75, 1, 1.25, 1.5].map((speed) => (
                    <Button
                      key={speed}
                      variant={playbackRate === speed ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPlaybackRate(speed)}
                      className="text-xs"
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Text-to-Speech Option */}
            {allowTextToSpeech && !audioUrl && (
              <div className="text-center p-6 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground mb-4">
                  No audio available. Text-to-speech can be generated for this content.
                </p>
                <Button variant="outline" disabled>
                  Generate Audio (Coming Soon)
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground text-lg">
              No audio content available
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};