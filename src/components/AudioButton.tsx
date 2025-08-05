import React from 'react';

interface AudioButtonProps {
  onClick: () => void;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ onClick, className = "" }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Enhanced Peppermint Candy Button */}
      <button
        onClick={onClick}
        className="relative w-20 h-20 rounded-full overflow-hidden transform transition-all duration-500 ease-out hover:scale-115 hover:rotate-[18deg] active:scale-90 active:rotate-[9deg] focus:outline-none focus:ring-4 focus:ring-red-300/50 hover:shadow-2xl"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 25% 25%, rgba(255, 255, 255, 0.9) 0%, transparent 50%),
            radial-gradient(ellipse 40% 60% at 75% 75%, rgba(255, 255, 255, 0.7) 0%, transparent 50%),
            radial-gradient(circle at center, 
              rgba(255, 255, 255, 0.2) 0%, 
              rgba(255, 255, 255, 0.1) 30%, 
              rgba(220, 38, 38, 0.05) 35%,
              rgba(220, 38, 38, 0.15) 65%,
              rgba(220, 38, 38, 0.3) 100%
            ),
            conic-gradient(
              from 15deg,
              #dc2626 0deg,
              #f87171 10deg,
              #ffffff 22.5deg,
              #f9fafb 32.5deg,
              #dc2626 45deg,
              #f87171 55deg,
              #ffffff 67.5deg,
              #f9fafb 77.5deg,
              #dc2626 90deg,
              #f87171 100deg,
              #ffffff 112.5deg,
              #f9fafb 122.5deg,
              #dc2626 135deg,
              #f87171 145deg,
              #ffffff 157.5deg,
              #f9fafb 167.5deg,
              #dc2626 180deg,
              #f87171 190deg,
              #ffffff 202.5deg,
              #f9fafb 212.5deg,
              #dc2626 225deg,
              #f87171 235deg,
              #ffffff 247.5deg,
              #f9fafb 257.5deg,
              #dc2626 270deg,
              #f87171 280deg,
              #ffffff 292.5deg,
              #f9fafb 302.5deg,
              #dc2626 315deg,
              #f87171 325deg,
              #ffffff 337.5deg,
              #f9fafb 347.5deg,
              #dc2626 360deg
            )
          `,
          boxShadow: `
            0 8px 32px rgba(220, 38, 38, 0.35),
            0 4px 16px rgba(220, 38, 38, 0.25),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 4px 8px rgba(255, 255, 255, 0.95),
            inset 0 -4px 8px rgba(0, 0, 0, 0.1),
            inset 0 0 32px rgba(255, 255, 255, 0.4),
            inset 0 0 2px rgba(220, 38, 38, 0.3)
          `,
          border: '1px solid rgba(255, 255, 255, 0.8)',
          transform: 'perspective(200px) rotateX(5deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Primary glossy highlight */}
        <div 
          className="absolute inset-0 rounded-full opacity-60 group-hover:opacity-80 transition-all duration-500"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 30% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 30%, transparent 60%),
              radial-gradient(ellipse 40% 30% at 70% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Secondary candy shine */}
        <div 
          className="absolute inset-1 rounded-full opacity-40 group-hover:opacity-60 transition-all duration-500"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 40% 25%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 40%, transparent 70%)`
          }}
        />
        
        {/* Swirl pattern overlay */}
        <div 
          className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-30 transition-all duration-500"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(220, 38, 38, 0.3) 5deg,
              transparent 15deg,
              rgba(220, 38, 38, 0.3) 25deg,
              transparent 35deg,
              rgba(220, 38, 38, 0.3) 45deg,
              transparent 55deg,
              rgba(220, 38, 38, 0.3) 65deg,
              transparent 75deg,
              rgba(220, 38, 38, 0.3) 85deg,
              transparent 95deg,
              rgba(220, 38, 38, 0.3) 105deg,
              transparent 115deg,
              rgba(220, 38, 38, 0.3) 125deg,
              transparent 135deg,
              rgba(220, 38, 38, 0.3) 145deg,
              transparent 155deg,
              rgba(220, 38, 38, 0.3) 165deg,
              transparent 175deg,
              rgba(220, 38, 38, 0.3) 185deg,
              transparent 195deg,
              rgba(220, 38, 38, 0.3) 205deg,
              transparent 215deg,
              rgba(220, 38, 38, 0.3) 225deg,
              transparent 235deg,
              rgba(220, 38, 38, 0.3) 245deg,
              transparent 255deg,
              rgba(220, 38, 38, 0.3) 265deg,
              transparent 275deg,
              rgba(220, 38, 38, 0.3) 285deg,
              transparent 295deg,
              rgba(220, 38, 38, 0.3) 305deg,
              transparent 315deg,
              rgba(220, 38, 38, 0.3) 325deg,
              transparent 335deg,
              rgba(220, 38, 38, 0.3) 345deg,
              transparent 355deg,
              transparent 360deg
            )`,
            transform: 'rotate(45deg)'
          }}
        />
        {/* Enhanced center area for the speaker */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-105"
          style={{
            background: `
              radial-gradient(circle at center, 
                rgba(255, 255, 255, 0.98) 0%, 
                rgba(255, 255, 255, 0.95) 60%, 
                rgba(248, 250, 252, 0.9) 100%
              )
            `,
            boxShadow: `
              0 3px 12px rgba(0, 0, 0, 0.25), 
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              inset 0 -1px 3px rgba(0, 0, 0, 0.05),
              0 0 0 1px rgba(255, 255, 255, 0.8)
            `
          }}
        >
          {/* Audio icon in center */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600 group-hover:text-emerald-700 transition-all duration-500 group-hover:scale-110">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
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