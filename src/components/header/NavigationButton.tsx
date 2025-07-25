// Navigation button component
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  name: string;
  path?: string;
  bgColor: string;
  hoverColor: string;
  shadowColor: string;
  hoverShadow: string;
  textColor: string;
  icon?: LucideIcon;
  customIcon?: string;
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
    // 3D effect with gold border and enhanced shadows
    'border-2 border-yellow-400 shadow-[0_6px_0_#B8860B,0_8px_16px_rgba(0,0,0,0.4)]',
    // Active state with shine effect
    isActive ? 'ring-4 ring-yellow-300 ring-opacity-70 transform translate-y-1 shadow-[0_4px_0_#B8860B,0_6px_12px_rgba(0,0,0,0.5)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:opacity-30 before:animate-pulse before:rounded-lg' : '',
    item.textColor, 'rounded-lg font-semibold relative overflow-hidden',
    'transition-all duration-200', 
    // Enhanced 3D hover effects
    'hover:transform hover:translate-y-1 hover:shadow-[0_4px_0_#B8860B,0_6px_12px_rgba(0,0,0,0.5)] hover:border-yellow-300',
    'active:translate-y-2 active:shadow-[0_2px_0_#B8860B,0_4px_8px_rgba(0,0,0,0.3)]',
    'flex items-center justify-center',
    'w-[60px] h-[60px]', // Fixed size for icon-only buttons
    'font-fun',
    'text-sm',
    isDropdown ? "group cursor-pointer" : "cursor-pointer"
  );

  const handleClick = () => {
    if (isDropdown && onClick) {
      onClick();
      return;
    }
    
    if (item.path) {
      navigate(item.path);
      // Only scroll to top if there's no hash in the path
      if (!item.path.includes('#')) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  if (isDropdown) {
    return (
      <div 
        className="relative"
        onMouseEnter={() => onHover?.(item.name)}
        onMouseLeave={() => onHover?.(null)}
      >
        <div className={buttonClasses} onClick={handleClick} aria-label={item.name}>
           {item.customIcon ? (
             <img 
               src={item.customIcon} 
               alt={`${item.name} icon`}
               className="w-[55px] h-[55px] object-contain"
             />
           ) : item.icon && (
             <item.icon size={50} stroke="white" fill={item.name === 'About' || item.name === 'Privacy' ? 'none' : 'white'} strokeWidth={item.name === 'About' || item.name === 'Privacy' ? 2 : 1} />
           )}
        </div>
        {item.description && isHovered && (
          <div className="nav-bubble opacity-100 visible z-50">
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
        <div className={buttonClasses} aria-label={item.name}>
           {item.customIcon ? (
             <img 
               src={item.customIcon} 
               alt={`${item.name} icon`}
               className="w-[55px] h-[55px] object-contain"
             />
           ) : item.icon && (
             <item.icon size={50} stroke="white" fill={item.name === 'About' || item.name === 'Privacy' ? 'none' : 'white'} strokeWidth={item.name === 'About' || item.name === 'Privacy' ? 2 : 1} />
           )}
        </div>
        {item.description && isHovered && (
          <div className="nav-bubble opacity-100 visible z-50">
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
      <div className={buttonClasses} onClick={handleClick} aria-label={item.name}>
         {item.customIcon ? (
           <img 
             src={item.customIcon} 
             alt={`${item.name} icon`}
             className="w-[55px] h-[55px] object-contain"
           />
         ) : item.icon && (
           <item.icon size={50} stroke="white" fill={item.name === 'About' || item.name === 'Privacy' ? 'none' : 'white'} strokeWidth={item.name === 'About' || item.name === 'Privacy' ? 2 : 1} />
         )}
      </div>
      {item.description && isHovered && (
        <div className="nav-bubble opacity-100 visible z-50">
          {item.description}
        </div>
      )}
    </div>
  );
};

export default NavigationButton;