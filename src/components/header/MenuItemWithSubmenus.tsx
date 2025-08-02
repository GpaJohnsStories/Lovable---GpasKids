import { useState } from "react";
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

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowSubmenus(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Delay hiding to allow moving to submenu
    setTimeout(() => {
      if (!isHovered) {
        setShowSubmenus(false);
      }
    }, 200);
  };

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