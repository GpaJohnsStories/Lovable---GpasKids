import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCachedIcon } from "@/hooks/useCachedIcon";
import { useTooltipContext } from "@/contexts/TooltipContext";
import { useEffect, useId } from "react";

interface MenuButtonProps {
  icon: string;
  text: string;
  color: string;
  onClick: () => void;
  customSize?: {
    width: string;
    height: string;
    iconSize: string;
  };
  disabled?: boolean;
  disabledMessage?: string;
  level?: number; // For dynamic tooltip positioning
}

const MenuButton = ({ icon, text, color, onClick, customSize, disabled = false, disabledMessage, level = 0 }: MenuButtonProps) => {
  const { iconUrl, isLoading, error } = useCachedIcon(icon);
  const { shouldShowTooltips, registerTooltip, unregisterTooltip } = useTooltipContext();
  const tooltipId = useId();

  useEffect(() => {
    registerTooltip(tooltipId);
    return () => unregisterTooltip(tooltipId);
  }, [tooltipId, registerTooltip, unregisterTooltip]);

  const freshGreen = "#16a34a";
  const disabledColor = "#9CA3AF"; // Gray-400

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const getButtonStyle = () => {
    const baseColor = disabled ? disabledColor : color;
    // FORCE all buttons to be exactly the same size - 4rem x 4rem (64px x 64px)
    const buttonSize = customSize?.width || '4rem';
    return {
      background: `linear-gradient(135deg, ${baseColor}dd, ${baseColor}bb)`,
      boxShadow: disabled 
        ? `0 4px 8px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)` 
        : `0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`,
      border: `2px solid ${baseColor}`,
      width: buttonSize,
      height: buttonSize, // Always force height = width for perfect square
      minWidth: buttonSize, // Prevent shrinking
      maxWidth: buttonSize, // Prevent growing
      minHeight: buttonSize, // Prevent shrinking
      maxHeight: buttonSize, // Prevent growing
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer'
    };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.background = `linear-gradient(135deg, ${freshGreen}dd, ${freshGreen}bb)`;
      e.currentTarget.style.border = `2px solid ${freshGreen}`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      const baseColor = color;
      e.currentTarget.style.background = `linear-gradient(135deg, ${baseColor}dd, ${baseColor}bb)`;
      e.currentTarget.style.border = `2px solid ${baseColor}`;
    }
  };

  return (
    <Tooltip open={shouldShowTooltips ? undefined : false}>
      <TooltipTrigger asChild>
        <button
          onClick={handleClick}
          className={`group relative flex items-center justify-center rounded-lg transform transition-all duration-200 ${
            disabled ? 'cursor-not-allowed' : 'hover:scale-105 cursor-pointer active:scale-95'
          }`}
          style={getButtonStyle()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={(e) => {
            if (!disabled) {
              e.currentTarget.style.background = `linear-gradient(135deg, ${freshGreen}aa, ${freshGreen}99)`;
              e.currentTarget.style.border = `2px solid ${freshGreen}`;
            }
          }}
          onMouseUp={(e) => {
            if (!disabled) {
              e.currentTarget.style.background = `linear-gradient(135deg, ${freshGreen}dd, ${freshGreen}bb)`;
              e.currentTarget.style.border = `2px solid ${freshGreen}`;
            }
          }}
        >
          {/* Loading state */}
          {isLoading && (
            <div 
              className="animate-pulse bg-orange-300 rounded"
              style={{
                width: '3.5rem', // Fixed size for consistency
                height: '3.5rem', // Fixed size for consistency
              }}
            />
          )}
          
          {/* Show text if no icon available, otherwise show icon */}
          {(error || !iconUrl) && !isLoading ? (
            <div 
              className="flex items-center justify-center text-white text-xs font-bold px-1 overflow-hidden"
              style={{
                width: '3.5rem', // Fixed size for consistency
                height: '3.5rem', // Fixed size for consistency
              }}
            >
              <span className="text-center leading-tight break-words hyphens-auto max-w-full">
                {text}
              </span>
            </div>
          ) : iconUrl && !isLoading && !error ? (
            <img 
              src={iconUrl}
              alt={text}
              style={{
                width: '3.5rem', // Fixed size for consistency - ALL icons same size
                height: '3.5rem', // Fixed size for consistency - ALL icons same size
                opacity: disabled ? 0.5 : 1
              }}
              className="object-contain" // This will fit the icon within the fixed dimensions
            />
          ) : null}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={-20} className="z-[100] bg-popover text-popover-foreground border shadow-md">
        <p className="font-semibold">{disabled && disabledMessage ? disabledMessage : text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default MenuButton;