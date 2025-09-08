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
        {/* Content */}
        <div 
          className="text-base leading-relaxed"
          style={{ color: textColor }}
        >
          {children}
        </div>
        
        {/* Invisible spacer to maintain consistent bottom padding like SYS-WEL */}
        <div className="h-6 w-full"></div>
        
        {/* Code indicator - bottom right like SYS-WEL */}
        <div 
          className="absolute bottom-2 right-2 text-xs font-mono"
          style={{ color: textColor }}
        >
          {code}
        </div>
      </div>
    </div>
  );
};

export default StaticWebtextBox;