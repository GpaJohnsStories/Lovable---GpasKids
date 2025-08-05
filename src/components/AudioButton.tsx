import React from 'react';
import { useCachedIcon } from '@/hooks/useCachedIcon';

interface AudioButtonProps {
  code: string; // storyCode or webtextCode
  onClick: () => void;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ code, onClick, className = "" }) => {
  // Temporarily use a direct path until the proper candy icon is uploaded
  const candyIconUrl = "/lovable-uploads/hi-speech-bubble-white-black-border.png";
  const { iconUrl, isLoading, error } = useCachedIcon('ICO-CDY.png');

  if (error) {
    console.error('Failed to load candy icon:', error);
  }

  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={onClick}
        className="relative w-20 h-20 rounded-full overflow-hidden transform transition-all duration-500 ease-out hover:scale-110 hover:rotate-[360deg] active:scale-90 active:rotate-12 focus:outline-none focus:ring-4 focus:ring-primary/20 hover:shadow-2xl"
      >
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-200 to-red-200 rounded-full">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Icon image */}
        {(iconUrl || candyIconUrl) && (
          <img
            src={iconUrl || candyIconUrl}
            alt="Click if you prefer to listen."
            className="w-full h-full object-cover rounded-full transition-transform duration-1000 group-hover:rotate-[720deg]"
          />
        )}
        
        {/* Fallback if no icon */}
        {!iconUrl && !candyIconUrl && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-300 to-red-400 rounded-full">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white drop-shadow-sm"
            >
              <path 
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" 
                fill="currentColor"
              />
            </svg>
          </div>
        )}
        
        {/* Glossy highlight overlay */}
        <div 
          className="absolute inset-0 rounded-full opacity-40 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 25% 25%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)
            `
          }}
        />
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  transparent 0%,
                  rgba(255, 255, 255, 0.4) 50%,
                  transparent 100%
                )
              `,
              animation: 'shimmer 2s infinite linear'
            }}
          />
        </div>
      </button>
      
      {/* Candy-themed message tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-5 py-3 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:translate-y-1 group-hover:scale-105 whitespace-nowrap z-10"
           style={{
             boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2), 0 4px 10px rgba(0, 0, 0, 0.1)'
           }}>
        <div className="text-sm font-semibold text-red-800 flex items-center gap-2">
          🍭 Sweet sounds await - click to listen!
        </div>
        {/* Enhanced tooltip arrow */}
        <div 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid #fca5a5',
            filter: 'drop-shadow(0 -2px 2px rgba(220, 38, 38, 0.1))'
          }}
        />
      </div>
    </div>
  );
};