import React from 'react';

interface AudioButtonProps {
  onClick: () => void;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ onClick, className = "" }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Peppermint Candy Button */}
      <button
        onClick={onClick}
        className="relative w-20 h-20 rounded-full overflow-hidden transform transition-all duration-300 ease-out hover:scale-110 hover:rotate-12 active:scale-95 active:rotate-6 focus:outline-none focus:ring-4 focus:ring-red-300/50"
        style={{
          background: `radial-gradient(circle at center, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(255, 255, 255, 0.9) 45%, 
            rgba(220, 38, 38, 0.1) 50%, 
            rgba(220, 38, 38, 0.9) 100%
          ), conic-gradient(
            from 0deg,
            #dc2626 0deg,
            #dc2626 22.5deg,
            #ffffff 22.5deg,
            #ffffff 45deg,
            #dc2626 45deg,
            #dc2626 67.5deg,
            #ffffff 67.5deg,
            #ffffff 90deg,
            #dc2626 90deg,
            #dc2626 112.5deg,
            #ffffff 112.5deg,
            #ffffff 135deg,
            #dc2626 135deg,
            #dc2626 157.5deg,
            #ffffff 157.5deg,
            #ffffff 180deg,
            #dc2626 180deg,
            #dc2626 202.5deg,
            #ffffff 202.5deg,
            #ffffff 225deg,
            #dc2626 225deg,
            #dc2626 247.5deg,
            #ffffff 247.5deg,
            #ffffff 270deg,
            #dc2626 270deg,
            #dc2626 292.5deg,
            #ffffff 292.5deg,
            #ffffff 315deg,
            #dc2626 315deg,
            #dc2626 337.5deg,
            #ffffff 337.5deg,
            #ffffff 360deg
          )`,
          boxShadow: `
            0 6px 20px rgba(220, 38, 38, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.3),
            inset 0 3px 6px rgba(255, 255, 255, 0.9),
            inset 0 -3px 6px rgba(0, 0, 0, 0.15),
            inset 0 0 20px rgba(255, 255, 255, 0.3)
          `,
          border: '2px solid rgba(220, 38, 38, 0.8)'
        }}
      >
        {/* Glossy overlay effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 40%, transparent 70%)`
          }}
        />
        
        {/* Large white center area for the speaker */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.8)'
          }}
        >
          {/* Audio icon in center */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-green-600 group-hover:text-green-700 transition-colors duration-300">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </div>
      </button>
      
      {/* Message tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2 bg-white border-2 border-red-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out group-hover:translate-y-1 whitespace-nowrap z-10">
        <div className="text-sm font-medium text-red-700">
          Click if you prefer to listen
        </div>
        {/* Tooltip arrow */}
        <div 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '6px solid #fecaca'
          }}
        />
      </div>
    </div>
  );
};