
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface StoryVideoPlayerProps {
  videoUrl: string;
  title: string;
  className?: string;
}

const StoryVideoPlayer: React.FC<StoryVideoPlayerProps> = ({ 
  videoUrl, 
  title, 
  className = "" 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  React.useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Video Title */}
      <div className="mb-4 text-center">
        <p className="text-lg text-gray-800 font-semibold">
          🎥 {title}
        </p>
      </div>

      {/* Video Container */}
      <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto object-contain"
          style={{ minHeight: '200px', maxHeight: '400px' }}
          preload="metadata"
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
        >
          Your browser does not support the video tag.
        </video>

        {/* Large Play/Pause Button - Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Button
            size="lg"
            onClick={togglePlay}
            className="pointer-events-auto bg-orange-500 hover:bg-orange-600 text-white rounded-full w-24 h-24 flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 border-4 border-white"
          >
            {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
          </Button>
        </div>
      </div>

      {/* Controls Bar - Below Video */}
      <div className="mt-4 bg-orange-100 rounded-lg p-4 border-2 border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              size="lg"
              onClick={togglePlay}
              className="cozy-button flex items-center space-x-2"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              <span className="text-base font-medium">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
            </Button>
            
            <Button
              size="lg"
              onClick={toggleMute}
              variant="outline"
              className="flex items-center space-x-2 border-2 border-orange-300 hover:bg-orange-200"
            >
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              <span className="text-base font-medium">
                {isMuted ? 'Unmute' : 'Mute'}
              </span>
            </Button>
          </div>
          
          <Button
            size="lg"
            onClick={toggleFullscreen}
            variant="outline"
            className="flex items-center space-x-2 border-2 border-orange-300 hover:bg-orange-200"
          >
            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
            <span className="text-base font-medium">
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </span>
          </Button>
        </div>
      </div>

      {/* Instructions for children */}
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-600">
          👆 Click the orange play button to start the story video!
        </p>
      </div>
    </div>
  );
};

export default StoryVideoPlayer;
