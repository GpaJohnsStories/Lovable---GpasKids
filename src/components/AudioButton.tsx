import React, { useState } from 'react';

interface AudioButtonProps {
  code: string; // storyCode or webtextCode
  onClick: () => void;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ code, onClick, className = "" }) => {
  // Use the actual peppermint candy image you uploaded
  const [imageError, setImageError] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const candyIconUrl = "/lovable-uploads/4f9b0ab3-9e17-4dab-91d9-a8fd5c350585.png";

  return (
    <div className={`relative ${className}`} style={{ zIndex: 5 }}>
      <button
        onClick={onClick}
        className="relative rounded-full focus:outline-none group"
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0
        }}
      >
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
        
        {/* Visible tooltip for user to see what the button does */}
        <div className="absolute top-full right-0 mt-3 px-4 py-2 bg-red-600 text-white text-base font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 shadow-lg border border-red-700">
          Click if you prefer to listen.
        </div>
      </button>
      
    </div>
  );
};