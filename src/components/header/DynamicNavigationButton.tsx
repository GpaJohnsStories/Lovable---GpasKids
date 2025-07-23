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

  const getDisplayName = () => {
    if (button.button_name && button.button_name.trim()) {
      return button.button_name;
    }
    // Fallback to capitalized button_code
    return button.button_code.charAt(0).toUpperCase() + button.button_code.slice(1);
  };

  return (
    <Button
      variant="outline"
      size={button.button_size === 'large' ? 'lg' : button.button_size === 'small' ? 'sm' : 'default'}
      onClick={handleClick}
      className={cn(
        "min-h-[48px] min-w-[48px] px-6 py-3 rounded-lg font-semibold transition-all duration-200 border-2",
        button.bg_color,
        button.hover_bg_color,
        button.text_color,
        button.hover_shadow,
        isActive && "ring-2 ring-offset-2 ring-primary"
      )}
      title={button.description || undefined}
    >
      <div className="flex items-center gap-2">
        {button.icon_url && (
          <img 
            src={button.icon_url} 
            alt="" 
            className="w-5 h-5 object-contain"
          />
        )}
        <span className="hidden sm:inline">
          {getDisplayName()}
        </span>
      </div>
    </Button>
  );
};

export default DynamicNavigationButton;