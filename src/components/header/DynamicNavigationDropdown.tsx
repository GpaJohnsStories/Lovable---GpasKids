import React from "react";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "@/hooks/useMenuData";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DynamicNavigationDropdownProps {
  button: MenuButton;
  isActive: boolean;
}

const DynamicNavigationDropdown: React.FC<DynamicNavigationDropdownProps> = ({ 
  button, 
  isActive 
}) => {
  const navigate = useNavigate();

  const handleSubitemClick = (path: string) => {
    navigate(path);
    if (!path.includes('#')) {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border-2 border-gray-200 shadow-lg">
        {button.subitems?.map((subitem) => (
          <DropdownMenuItem
            key={subitem.id}
            onClick={() => handleSubitemClick(subitem.subitem_path)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer text-base"
          >
            {subitem.subitem_name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DynamicNavigationDropdown;