import React from 'react';

interface StaticWebtextBoxProps {
  code: string;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  children?: React.ReactNode;
}

const StaticWebtextBox: React.FC<StaticWebtextBoxProps> = ({
  code,
  borderColor,
  backgroundColor,
  textColor,
  children
}) => {
  return (
    <div className="mb-6 max-w-4xl mx-auto">
      <div 
        className="border-4 rounded-lg p-6 relative"
        style={{ 
          borderColor: borderColor,
          backgroundColor: backgroundColor 
        }}
      >
        {/* Code indicator */}
        <div 
          className="absolute -top-3 left-4 px-2 py-1 text-xs font-mono rounded"
          style={{ 
            backgroundColor: borderColor,
            color: '#ffffff'
          }}
        >
          {code}
        </div>
        
        {/* Content */}
        <div 
          className="text-base leading-relaxed"
          style={{ color: textColor }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default StaticWebtextBox;