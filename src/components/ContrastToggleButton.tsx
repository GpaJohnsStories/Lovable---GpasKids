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
  const { iconUrl, isLoading } = useCachedIcon('!CO-VCB.png', true);

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
      onClick={toggleContrast}
      data-allow-superav-passthrough="true"
      variant="link"
      className="p-0 m-0 bg-transparent hover:bg-transparent border-none shadow-none h-auto w-auto focus:ring-0 focus:outline-none no-underline hover:no-underline cursor-pointer"
      aria-label={isHighContrast ? "Turn off high contrast" : "Turn on high contrast"}
    >
      <div className="w-[85px] h-[85px] flex items-center justify-center">
        {iconUrl ? (
          <img 
            src={iconUrl} 
            alt="Contrast Toggle" 
            className="h-[85px] w-[85px] block object-contain"
          />
        ) : (
          <Eye className="h-10 w-10 text-orange-500" />
        )}
      </div>
    </Button>
  );

  if (inline) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent className="bg-[#60a5fa] border-[#60a5fa]">
            <p className="font-fun text-21px font-bold text-white" style={{
              textShadow: '2px 2px 0px #666, 4px 4px 0px #333, 6px 6px 8px rgba(0,0,0,0.3)',
              fontFamily: 'Arial, sans-serif'
            }}>
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
          <TooltipContent className="bg-[#60a5fa] border-[#60a5fa]">
            <p className="font-fun text-21px font-bold text-white" style={{
              textShadow: '2px 2px 0px #666, 4px 4px 0px #333, 6px 6px 8px rgba(0,0,0,0.3)',
              fontFamily: 'Arial, sans-serif'
            }}>
              {isHighContrast ? "Turn off high contrast" : "Turn on high contrast"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ContrastToggleButton;