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

  const tooltipText = "Click to listen or change word size.";

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
            {/* Show consistent loading skeleton while icon loads */}
            {candyLoading && (
              <div className="w-full h-full rounded-full bg-muted animate-pulse flex items-center justify-center">
                <div className="w-6 h-6 bg-muted-foreground/20 rounded-full"></div>
              </div>
            )}
            
            {/* Show enhanced fallback if no icon available, otherwise show candy image */}
            {(candyError || !candyIconUrl) && !candyLoading ? (
              <div className="w-full h-full bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center text-destructive text-xs font-bold rounded-full">
                <span className="rotate-12">🍬</span>
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
                onError={() => console.warn('🍬 AudioButton icon failed to load')}
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