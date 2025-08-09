import React from 'react';

interface FontSizeControlsProps {
  fontSize: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
}

export const FontSizeControls: React.FC<FontSizeControlsProps> = ({ 
  fontSize, 
  onIncrease, 
  onDecrease, 
  className = "" 
}) => {
  const minusPlusIconUrl = "/lovable-uploads/ICO-CCM.png";
  const plusIconUrl = "/lovable-uploads/ICO-CCP.png";
  
  const isMinSize = fontSize <= 9;
  const isMaxSize = fontSize >= 30;

  return (
    <div className={`relative flex gap-1 ${className}`} style={{ zIndex: 5 }}>
      {/* Minus Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDecrease();
        }}
        disabled={isMinSize}
        className={`relative rounded-full focus:outline-none group ${isMinSize ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0
        }}
      >
        <img
          src={minusPlusIconUrl}
          alt="Decrease font size"
          className="w-full h-full rounded-full"
          style={{ 
            backgroundColor: 'transparent',
            display: 'block',
            objectFit: 'cover'
          }}
        />
        
        {!isMinSize && (
          <div className="absolute top-full left-0 mt-3 px-4 py-2 bg-blue-600 text-white text-base font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 shadow-lg border border-blue-700">
            Make text smaller
          </div>
        )}
      </button>

      {/* Plus Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onIncrease();
        }}
        disabled={isMaxSize}
        className={`relative rounded-full focus:outline-none group ${isMaxSize ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0
        }}
      >
        <img
          src={plusIconUrl}
          alt="Increase font size"
          className="w-full h-full rounded-full"
          style={{ 
            backgroundColor: 'transparent',
            display: 'block',
            objectFit: 'cover'
          }}
        />
        
        {!isMaxSize && (
          <div className="absolute top-full right-0 mt-3 px-4 py-2 bg-green-600 text-white text-base font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 shadow-lg border border-green-700">
            Make text larger
          </div>
        )}
      </button>
    </div>
  );
};