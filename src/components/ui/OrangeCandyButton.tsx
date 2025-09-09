import React from 'react';

interface OrangeCandyButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * 3D Orange Candy Button - Reliable pure CSS button for close actions
 * Styled to match the SuperAV candy button design but in bright orange
 */
export const OrangeCandyButton: React.FC<OrangeCandyButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-full
        relative
        font-kalam font-bold text-21px
        transition-all duration-200 ease-in-out
        transform-gpu
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
        }
        bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600
        hover:from-orange-500 hover:via-orange-600 hover:to-orange-700
        active:from-orange-600 active:via-orange-700 active:to-orange-800
        border-2 border-orange-700
        shadow-lg hover:shadow-xl
        text-white
        rounded-lg
        ${className}
      `}
      style={{
        textShadow: '2px 2px 0px #d97706, 4px 4px 0px #92400e, 6px 6px 8px rgba(0,0,0,0.4)',
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.3),
          inset 0 -2px 0 rgba(0,0,0,0.2),
          0 4px 8px rgba(0,0,0,0.3),
          0 8px 16px rgba(0,0,0,0.2)
        `
      }}
    >
      {/* 3D highlight effect */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)'
        }}
      />
      
      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {children}
      </div>
    </button>
  );
};