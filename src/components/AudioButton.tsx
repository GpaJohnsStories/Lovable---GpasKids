import React, { useState } from 'react';

interface AudioButtonProps {
  code: string; // storyCode or webtextCode
  onClick: () => void;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ code, onClick, className = "" }) => {
  // Use the actual peppermint candy image you uploaded
  const [imageError, setImageError] = useState(false);
  const candyIconUrl = "/lovable-uploads/4f9b0ab3-9e17-4dab-91d9-a8fd5c350585.png";

  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={onClick}
        className="relative w-20 h-20 rounded-full overflow-hidden transform transition-all duration-1000 ease-out hover:scale-110 hover:rotate-[360deg] active:scale-90 active:rotate-12 focus:outline-none focus:ring-4 focus:ring-primary/20 hover:shadow-2xl bg-transparent"
      >
        {/* Candy image */}
        {!imageError && (
          <img
            src={candyIconUrl}
            alt="Click if you prefer to listen."
            className="w-full h-full object-cover rounded-full transition-transform duration-1000"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        )}
        
        {/* CSS Peppermint Candy Fallback - only if image fails */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-400 via-pink-400 to-red-500 rounded-full">
            <div className="w-full h-full rounded-full relative overflow-hidden bg-gradient-to-br from-red-500 to-white"
                 style={{
                   background: `conic-gradient(
                     from 0deg,
                     #dc2626 0deg 30deg,
                     white 30deg 60deg,
                     #dc2626 60deg 90deg,
                     white 90deg 120deg,
                     #dc2626 120deg 150deg,
                     white 150deg 180deg,
                     #dc2626 180deg 210deg,
                     white 210deg 240deg,
                     #dc2626 240deg 270deg,
                     white 270deg 300deg,
                     #dc2626 300deg 330deg,
                     white 330deg 360deg
                   )`
                 }}>
              {/* Center hole */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-red-500"></div>
            </div>
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