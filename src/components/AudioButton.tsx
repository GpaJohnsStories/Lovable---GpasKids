import React from 'react';
import { useCachedIcon } from '@/hooks/useCachedIcon';

interface AudioButtonProps {
  code: string; // storyCode or webtextCode
  onClick: () => void;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ code, onClick, className = "" }) => {
  const { iconUrl: candyIconUrl, isLoading: candyLoading, error: candyError } = useCachedIcon('!CO-RPC');

  return (
    <div className={`relative z-5 ${className}`}>
      <button
        onClick={(e) => {
          console.log('🎵 AudioButton clicked! Code:', code);
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className="relative rounded-full focus:outline-none group"
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0
        }}
      >
        {/* Show loading spinner while icon loads */}
        {candyLoading && (
          <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Show text if no icon available, otherwise show candy image */}
        {(candyError || !candyIconUrl) && !candyLoading ? (
          <div className="w-full h-full bg-red-200 flex items-center justify-center text-red-800 text-xs font-bold rounded-full">
            !CO-RPC
          </div>
        ) : candyIconUrl && !candyLoading && !candyError ? (
          <img
            src={candyIconUrl}
            alt="Click if you prefer to listen."
            className="w-full h-full rounded-full"
            style={{ 
              backgroundColor: 'transparent',
              display: 'block',
              objectFit: 'cover'
            }}
          />
        ) : null}
        
        {/* Visible tooltip for user to see what the button does */}
        <div className="absolute top-full right-0 mt-3 px-4 py-2 bg-red-600 text-white text-base font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 shadow-lg border border-red-700">
          Click if you want to listen or change word size.
        </div>
      </button>
      
    </div>
  );
};