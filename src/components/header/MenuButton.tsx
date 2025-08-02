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
    return {
      background: `linear-gradient(135deg, ${baseColor}dd, ${baseColor}bb)`,
      boxShadow: disabled 
        ? `0 4px 8px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)` 
        : `0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`,
      border: `2px solid ${baseColor}`,
      width: customSize?.width || '60px',
      height: customSize?.height || '60px',
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

  // Dynamic tooltip styles based on level
  const getTooltipStyles = () => {
    const baseZIndex = 1000;
    const zIndex = baseZIndex + (level * 10);
    return {
      zIndex,
      position: 'absolute' as const,
      right: level > 0 ? '100%' : undefined,
      marginRight: level > 0 ? '8px' : undefined,
    };
  };

  return (
    <div className="menu-container overflow-visible relative">
      <Tooltip open={shouldShowTooltips ? undefined : false}>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className={`menu-item group relative flex items-center justify-center rounded-lg transform transition-all duration-200 overflow-visible ${
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
                  width: customSize?.iconSize || '55px',
                  height: customSize?.iconSize || '55px',
                }}
              />
            )}
            
            {/* Show text if no icon available, otherwise show icon */}
            {(error || !iconUrl) && !isLoading ? (
              <div 
                className="flex items-center justify-center text-white text-xs font-bold px-1 overflow-hidden"
                style={{
                  width: customSize?.iconSize || '55px',
                  height: customSize?.iconSize || '55px',
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
                  width: customSize?.iconSize || '55px',
                  height: customSize?.iconSize || '55px',
                  opacity: disabled ? 0.5 : 1
                }}
                className="object-contain"
              />
            ) : null}
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          sideOffset={-20} 
          className={`menu-item-tooltip level-${level} bg-popover text-popover-foreground border shadow-md`}
          style={getTooltipStyles()}
        >
          <p className="font-semibold">{disabled && disabledMessage ? disabledMessage : text}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default MenuButton;