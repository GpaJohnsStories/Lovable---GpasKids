import React, { useId, useEffect } from 'react';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useTooltipContext } from '@/contexts/TooltipContext';

interface AudioButtonProps {
  code: string; // storyCode or webtextCode
  onClick: () => void;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ code, onClick, className = "" }) => {
  const { iconUrl: candyIconUrl, iconName, isLoading: candyLoading, error: candyError } = useCachedIcon('!CO-RPC.gif');
  const { shouldShowTooltips, registerTooltip, unregisterTooltip } = useTooltipContext();
  const tooltipId = useId();

  useEffect(() => {
    registerTooltip(tooltipId);
    return () => {
      unregisterTooltip(tooltipId);
    };
  }, [tooltipId, registerTooltip, unregisterTooltip]);

  const tooltipText = iconName || "Click if you want to listen or change word size.";

  return (
    <div className={`relative z-[5] ${className}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={(e) => {
              console.log('🎵 AudioButton clicked! Code:', code);
              e.preventDefault();
              e.stopPropagation();
              onClick();
            }}
            className="relative rounded-full focus:outline-none"
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0
            }}
          >
            {/* Show loading spinner while icon loads */}
            {candyLoading && (
              <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Show text if no icon available, otherwise show candy image */}
            {(candyError || !candyIconUrl) && !candyLoading ? (
              <div className="w-full h-full bg-red-200 flex items-center justify-center text-red-800 text-xs font-bold rounded-full">
                !CO-RPC
              </div>
            ) : candyIconUrl && !candyLoading && !candyError ? (
              <img
                src={candyIconUrl}
                alt={tooltipText}
                className="w-full h-full rounded-full"
                style={{ 
                  backgroundColor: 'transparent',
                  display: 'block',
                  objectFit: 'cover'
                }}
              />
            ) : null}
          </button>
        </TooltipTrigger>
        
        {shouldShowTooltips && (
          <TooltipContent 
            side="bottom" 
            align="end"
            className="bg-red-600 text-white text-base font-bold border border-red-700 shadow-lg"
          >
            {tooltipText}
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
};