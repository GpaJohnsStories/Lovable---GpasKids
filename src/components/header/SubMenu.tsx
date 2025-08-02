import MenuButton from "./MenuButton";

interface SubMenuItem {
  id: string;
  icon: string;
  text: string;
  onClick: () => void;
}

interface SubMenuProps {
  items: SubMenuItem[];
  isVisible: boolean;
  position: 'left' | 'below';
  level: number; // 1, 2, 3, 4 for different submenu levels
}

const SubMenu = ({ items, isVisible, position, level }: SubMenuProps) => {
  if (!isVisible || items.length === 0) return null;

  // Calculate positioning based on level and position (now using 4rem = 64px buttons)
  const getPositionClasses = () => {
    const baseClasses = "absolute z-50 animate-slide-in-right";
    
    if (position === 'left') {
      // Submenus to the left with 2px gap to prevent overlap
      if (level === 1) return `${baseClasses} right-[66px] top-0`; // 64px button + 2px gap
      if (level === 2) return `${baseClasses} right-[66px] top-0`; // 64px button + 2px gap
    }
    
    if (position === 'below') {
      // Submenus below with 1px gap to prevent overlap
      if (level === 3) return `${baseClasses} top-[65px] left-0`; // 64px button + 1px gap
      if (level === 4) return `${baseClasses} top-[65px] left-0`; // 64px button + 1px gap
    }
    
    return baseClasses;
  };

  // All submenu buttons same size as golden button on phone (4rem x 4rem)
  const getButtonSize = () => {
    return { width: '4rem', height: '4rem', iconSize: '3.5rem' }; // Same as main menu buttons
  };

  const buttonSize = getButtonSize();

  return (
    <div className={getPositionClasses()}>
      <div className="flex flex-col gap-0">
        {items.map((item) => (
          <MenuButton
            key={item.id}
            icon={item.icon}
            text={item.text}
            color="#F97316"
            onClick={item.onClick}
            customSize={buttonSize}
          />
        ))}
      </div>
    </div>
  );
};

export default SubMenu;