import React from 'react';

interface FontButtonProps {
  onClick: () => void;
  className?: string;
}

export const FontButton: React.FC<FontButtonProps> = ({ onClick, className = "" }) => {
  return (
    <div className={`relative ${className}`} style={{ zIndex: 5 }}>
      <button
        onClick={(e) => {
          console.log('🎨 FontButton clicked!');
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className="relative rounded-full focus:outline-none group"
        style={{
          width: '120px',
          height: '40px',
          backgroundColor: '#814d2e',
          border: '2px solid #5d2c14',
          borderRadius: '20px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#6d3a1f';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#814d2e';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
      >
        <span 
          style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Kalam, "Comic Sans MS", Arial, sans-serif'
          }}
        >
          Font Size
        </span>
        
        {/* Visible tooltip for user to see what the button does */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2 bg-red-600 text-white text-base font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 shadow-lg border border-red-700">
          Adjust font size
        </div>
      </button>
    </div>
  );
};