import MenuButton from "./MenuButton";

interface SubMenuItem {
  id: string;
  icon: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
  disabledMessage?: string;
  customSize?: {
    width: string;
    height: string;
    iconSize: string;
  };
}

interface SubMenuProps {
  items: SubMenuItem[];
  isVisible: boolean;
  position: 'left' | 'below';
  level: number; // 1, 2, 3, 4 for different submenu levels
}

const SubMenu = ({ items, isVisible, position, level }: SubMenuProps) => {
  if (!isVisible || items.length === 0) return null;

  // Calculate positioning based on level and position (using 10px gap standard)
  const getPositionClasses = () => {
    const zIndex = level === 1 ? "z-40" : "z-50"; // Level 1 at z-40, level 2+ at z-50 (below tooltips)
    const baseClasses = `absolute ${zIndex} animate-slide-in-right`;
    
    if (position === 'left') {
      // Level 1: positioned relative to main menu button  
      if (level === 1) return `${baseClasses} right-[74px] top-0`; // 64px button + 10px gap
      // Level 2: positioned relative to level 1 submenu button (cascading)
      if (level === 2) return `${baseClasses} right-[148px] top-0`; // 74px (from main) + 64px (level1 width) + 10px gap
    }
    
    if (position === 'below') {
      // Submenus below with 10px gap standard
      if (level === 3) return `${baseClasses} top-[74px] left-0`; // 64px button + 10px gap
      if (level === 4) return `${baseClasses} top-[74px] left-0`; // 64px button + 10px gap
    }
    
    return baseClasses;
  };

  // All submenu buttons same size as golden button on phone (4rem x 4rem)
  const getButtonSize = () => {
    return { width: '4rem', height: '4rem', iconSize: '3.5rem' }; // Same as main menu buttons
  };

  const buttonSize = getButtonSize();

  return (
    <div className={`${getPositionClasses()} level-${level}`}>
      <div className="flex flex-col gap-0">
        {items.map((item) => (
          <MenuButton
            key={item.id}
            icon={item.icon}
            text={item.text}
            color="#F97316"
            onClick={item.onClick}
            customSize={item.customSize || buttonSize}
            disabled={item.disabled}
            disabledMessage={item.disabledMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default SubMenu;