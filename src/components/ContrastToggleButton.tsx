import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Eye } from 'lucide-react';

interface ContrastToggleButtonProps {
  inline?: boolean;
}

const ContrastToggleButton: React.FC<ContrastToggleButtonProps> = ({ inline = false }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const { iconUrl, isLoading } = useCachedIcon('!CO-VCB.png');

  // Load saved contrast preference on mount
  useEffect(() => {
    const savedContrast = localStorage.getItem('high-contrast') === 'true';
    setIsHighContrast(savedContrast);
    if (savedContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    }
  }, []);

  const toggleContrast = () => {
    const newContrastState = !isHighContrast;
    setIsHighContrast(newContrastState);
    
    // Update document attribute
    if (newContrastState) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
    
    // Persist to localStorage
    localStorage.setItem('high-contrast', newContrastState.toString());
  };

  const buttonContent = (
    <Button
      variant="default"
      size="lg"
      onClick={toggleContrast}
      className="w-[70px] h-[70px] rounded-lg transition-all hover:scale-105 active:scale-95"
      aria-label={isHighContrast ? "Turn off high contrast" : "Turn on high contrast"}
    >
      {iconUrl && !isLoading ? (
        <img 
          src={iconUrl} 
          alt="Contrast Toggle" 
          className="w-full h-full object-contain"
        />
      ) : (
        <Eye className="w-6 h-6" />
      )}
    </Button>
  );

  if (inline) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-base-content-lg">
              {isHighContrast ? "Turn off high contrast" : "Turn on high contrast"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 print:hidden">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-base-content-lg">
              {isHighContrast ? "Turn off high contrast" : "Turn on high contrast"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ContrastToggleButton;