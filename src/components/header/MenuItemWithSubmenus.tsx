import { useState, useEffect } from "react";
import MenuButton from "./MenuButton";
import SubMenu from "./SubMenu";

interface SubMenuItem {
  id: string;
  icon: string;
  text: string;
  onClick: () => void;
}

interface SubMenuLevel {
  items: SubMenuItem[];
  position: 'left' | 'below';
  level: number;
}

interface MenuItemWithSubmenusProps {
  id: string;
  icon: string;
  text: string;
  color: string;
  onClick?: () => void;
  submenus: SubMenuLevel[];
  customSize?: {
    width: string;
    height: string;
    iconSize: string;
  };
}

const MenuItemWithSubmenus = ({ 
  id, 
  icon, 
  text, 
  color, 
  onClick, 
  submenus,
  customSize 
}: MenuItemWithSubmenusProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSubmenus, setShowSubmenus] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowSubmenus(true);
    
    // Clear any pending hide timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // Clear any existing timeout first
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    
    // Set a new timeout to hide submenus
    const timeout = setTimeout(() => {
      setShowSubmenus(false);
      setHideTimeout(null);
    }, 100); // Reduced delay to 100ms for faster submenu hiding
    
    setHideTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setShowSubmenus(!showSubmenus);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MenuButton
        icon={icon}
        text={text}
        color={color}
        onClick={handleClick}
        customSize={customSize}
      />
      
      {/* Render all submenu levels */}
      {submenus.map((submenu, index) => (
        <SubMenu
          key={`${id}-submenu-${index}`}
          items={submenu.items}
          isVisible={showSubmenus}
          position={submenu.position}
          level={submenu.level}
        />
      ))}
    </div>
  );
};

export default MenuItemWithSubmenus;