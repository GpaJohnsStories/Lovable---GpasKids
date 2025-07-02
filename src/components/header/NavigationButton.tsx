
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, LucideIcon } from "lucide-react";

interface NavigationItem {
  name: string;
  path?: string;
  bgColor: string;
  hoverColor: string;
  shadowColor: string;
  hoverShadow: string;
  textColor: string;
  icon?: LucideIcon;
  description?: string;
  subItems?: Array<{
    name: string;
    path: string;
    disabled?: boolean;
  }>;
}

interface NavigationButtonProps {
  item: NavigationItem;
  isActive: boolean;
  isDropdown?: boolean;
  onClick?: () => void;
  onHover?: (buttonName: string | null) => void;
  isHovered?: boolean;
}

const NavigationButton = ({ item, isActive, isDropdown = false, onClick, onHover, isHovered }: NavigationButtonProps) => {
  const navigate = useNavigate();

  const buttonClasses = cn(
    item.bgColor, item.hoverColor, item.shadowColor, item.hoverShadow,
    isActive ? 'ring-4 ring-white ring-opacity-50 transform translate-y-1 shadow-[0_4px_0_#7AB8C4,0_6px_12px_rgba(0,0,0,0.4)]' : '',
    item.textColor, 'px-5 py-2 rounded-lg font-semibold',
    'transition-all duration-200', 
    'hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#7AB8C4,0_4px_8px_rgba(0,0,0,0.3)]',
    'flex items-center justify-center min-w-[100px]',
    'font-fun border-t border-white border-opacity-30',
    'text-sm', item.icon ? 'gap-1' : '',
    isDropdown ? "group cursor-pointer" : "cursor-pointer"
  );

  const handleClick = () => {
    if (isDropdown && onClick) {
      onClick();
      return;
    }
    
    if (item.path) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      navigate(item.path);
    }
  };

  if (isDropdown) {
    return (
      <div 
        className="relative"
        onMouseEnter={() => onHover?.(item.name)}
        onMouseLeave={() => onHover?.(null)}
      >
        <div className={buttonClasses} onClick={handleClick}>
          <span className={item.icon ? '' : 'text-center w-full'}>{item.name}</span>
          <ChevronDown
            className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </div>
        {item.description && isHovered && (
          <div className="nav-bubble opacity-100 visible">
            {item.description}
          </div>
        )}
      </div>
    );
  }

  if (!item.path) {
    return (
      <div 
        className="relative"
        onMouseEnter={() => onHover?.(item.name)}
        onMouseLeave={() => onHover?.(null)}
      >
        <div className={buttonClasses}>
          {item.icon && <item.icon size={16} />}
          <span className={item.icon ? '' : 'text-center w-full'}>
            {item.name}
          </span>
        </div>
        {item.description && isHovered && (
          <div className="nav-bubble opacity-100 visible">
            {item.description}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => onHover?.(item.name)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className={buttonClasses} onClick={handleClick}>
        {item.icon && <item.icon size={16} />}
        <span className={item.icon ? '' : 'text-center w-full'}>
          {item.name}
        </span>
      </div>
      {item.description && isHovered && (
        <div className="nav-bubble opacity-100 visible">
          {item.description}
        </div>
      )}
    </div>
  );
};

export default NavigationButton;
