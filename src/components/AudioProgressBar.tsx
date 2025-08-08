import React from 'react';

interface AudioProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (time: number) => string;
  error: string | null;
  isLoading: boolean;
}

export const AudioProgressBar: React.FC<AudioProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  formatTime,
  error,
  isLoading
}) => {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Debug logging
  console.log('AudioProgressBar render:', { currentTime, duration, progressPercentage });

  return (
    <div className="col-span-4 border-2 border-white/40 rounded-lg shadow-lg flex items-center justify-center p-1" style={{ backgroundColor: '#3b82f6' }}>
      <div className="w-full max-w-[180px] relative">
        {/* Progress track */}
        <div 
          className="w-full h-2 bg-gray-300/50 rounded-full relative overflow-hidden cursor-pointer"
          onClick={onSeek}
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
  );
};