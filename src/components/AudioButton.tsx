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
    <div className={`relative ${className}`}>
      <button
        onClick={onClick}
        className="relative w-20 h-20 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-1000 ease-out hover:shadow-2xl"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
          filter: 'drop-shadow(0 0 0 transparent)',
          transition: 'filter 1.5s ease-in-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(255, 100, 100, 0.8)) drop-shadow(0 0 40px rgba(255, 150, 150, 0.4))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'drop-shadow(0 0 0 transparent)';
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
        
      </button>
      
    </div>
  );
};