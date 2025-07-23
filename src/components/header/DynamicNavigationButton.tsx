import React from "react";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "@/hooks/useMenuData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DynamicNavigationButtonProps {
  button: MenuButton;
  isActive: boolean;
}

const DynamicNavigationButton: React.FC<DynamicNavigationButtonProps> = ({ 
  button, 
  isActive 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (button.path) {
      navigate(button.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getButtonStyle = () => {
    const isGradient = button.top_color !== button.bottom_color;
    const background = isGradient 
      ? `linear-gradient(135deg, ${button.top_color}, ${button.bottom_color})`
      : button.top_color;
    
    const borderRadius = button.button_shape === 'button' ? '8px' : '4px';
    
    return {
      width: `${button.button_width}px`,
      height: `${button.button_height}px`,
      background,
      borderRadius,
      border: '2px solid rgba(255,255,255,0.2)',
      minWidth: `${button.button_width}px`,
      minHeight: `${button.button_height}px`,
    };
  };

  return (
    <button
      onClick={handleClick}
      style={getButtonStyle()}
      className={cn(
        "flex items-center justify-center gap-2 font-semibold transition-all duration-200 text-white",
        "hover:scale-105 hover:shadow-lg",
        isActive && "ring-2 ring-offset-2 ring-primary"
      )}
      title={button.description || undefined}
    >
      {button.icon_url && (
        <img 
          src={button.icon_url} 
          alt="" 
          className="w-5 h-5 object-contain"
        />
      )}
      {button.button_name && (
        <span className="hidden sm:inline text-sm">
          {button.button_name}
        </span>
      )}
    </button>
  );
};

export default DynamicNavigationButton;