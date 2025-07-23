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

  const getDisplayName = () => {
    if (button.button_name && button.button_name.trim()) {
      return button.button_name;
    }
    // Fallback to capitalized button_code
    return button.button_code.charAt(0).toUpperCase() + button.button_code.slice(1);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={button.button_size === 'large' ? 'lg' : button.button_size === 'small' ? 'sm' : 'default'}
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