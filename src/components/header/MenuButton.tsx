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
  tooltipText?: string; // Optional separate tooltip text
  rounded?: boolean; // If true, button is circular (rounded-full)
}

const MenuButton = ({ icon, text, color, onClick, customSize, disabled = false, disabledMessage, level = 0, tooltipText, rounded = false }: MenuButtonProps) => {
  const { iconUrl, iconName, isLoading, error } = useCachedIcon(icon);
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
    // Hardcoded exact pixel dimensions - 100x100px
    return {
      background: `linear-gradient(135deg, ${baseColor}dd, ${baseColor}bb)`,
      boxShadow: disabled 
        ? `0 4px 8px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)` 
        : `0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`,
      border: `2px solid ${baseColor}`,
      width: '100px',
      height: '100px',
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
          className={`group relative flex items-center justify-center ${rounded ? 'rounded-full' : 'rounded-lg'} transform transition-all duration-200 flex-shrink-0 ${
            disabled ? 'cursor-not-allowed' : 'hover:scale-105 cursor-pointer active:scale-95'
          }`}
          style={{
            ...getButtonStyle(),
            // AGGRESSIVE exact dimensions - override everything
            width: '100px !important',
            height: '100px !important',
            minWidth: '100px !important',
            maxWidth: '100px !important', 
            minHeight: '100px !important',
            maxHeight: '100px !important',
            boxSizing: 'border-box',
            overflow: 'hidden',
            flexShrink: 0,
            flexGrow: 0,
            display: 'flex !important'
          }}
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
          {/* Always show content - prioritize text visibility */}
          {isLoading && (
            <div 
              className="flex items-center justify-center text-white text-xs font-bold"
              style={{
                width: '90px',
                height: '90px',
              }}
            >
              <span className="text-center leading-tight break-words">
                {text}
              </span>
            </div>
          )}
          
          {/* Show icon if available, otherwise show icon code for missing icons */}
          {!isLoading && iconUrl && !error ? (
            <img 
              src={iconUrl}
              alt={text}
              style={{
                width: '90px',
                height: '90px',
                opacity: disabled ? 0.5 : 1
              }}
              className="object-contain"
            />
          ) : !isLoading && (
            <div 
              className="flex items-center justify-center text-white text-xs font-bold px-1"
              style={{
                width: '90px',
                height: '90px',
              }}
            >
              <span className="text-center leading-tight break-words hyphens-auto max-w-full">
                {icon || text}
              </span>
            </div>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={-20} className="z-[100] bg-popover text-popover-foreground border shadow-md">
        <p className="font-semibold">
          {disabled && disabledMessage 
            ? disabledMessage 
            : (tooltipText || iconName || text)
          }
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default MenuButton;