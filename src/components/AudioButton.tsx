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
        className="relative w-20 h-20 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/20 overflow-hidden"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0
        }}
      >
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
            transform: 'translateX(-100%)',
            animation: 'shimmer-sweep 2s ease-in-out infinite'
          }}
        />
        
        {/* Keyframes for shimmer animation */}
        <style>{`
          @keyframes shimmer-sweep {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
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