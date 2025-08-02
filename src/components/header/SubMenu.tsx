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

  // Calculate positioning based on level and position
  const getPositionClasses = () => {
    const baseClasses = "absolute z-50 animate-slide-in-right";
    
    if (position === 'left') {
      // Submenus to the left with 1-2px spacing
      if (level === 1) return `${baseClasses} right-[62px] top-0`; // 60px button + 2px spacing
      if (level === 2) return `${baseClasses} right-[62px] top-0`; // 60px button + 2px spacing
    }
    
    if (position === 'below') {
      // Submenus below with small spacing
      if (level === 3) return `${baseClasses} top-[62px] left-0`; // 60px button + 2px spacing
      if (level === 4) return `${baseClasses} top-[62px] left-0`; // 60px button + 2px spacing
    }
    
    return baseClasses;
  };

  // Calculate button size based on hierarchy: main = 60px, submenu = 45px, sub-submenu = 30px
  const getButtonSize = () => {
    if (level === 1) return { width: '45px', height: '45px', iconSize: '40px' }; // 3/4 of main
    if (level === 2) return { width: '30px', height: '30px', iconSize: '26px' }; // 1/2 of main
    if (level === 3) return { width: '30px', height: '30px', iconSize: '26px' }; // 1/2 of main
    if (level === 4) return { width: '30px', height: '30px', iconSize: '26px' }; // 1/2 of main
    return { width: '45px', height: '45px', iconSize: '40px' };
  };

  const buttonSize = getButtonSize();

  return (
    <div className={getPositionClasses()}>
      <div className="flex flex-col gap-1">
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