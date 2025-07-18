
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import NavigationButton from "./NavigationButton";

interface NavigationItem {
  name: string;
  path?: string;
  bgColor: string;
  hoverColor: string;
  shadowColor: string;
  hoverShadow: string;
  textColor: string;
  description?: string;
  subItems?: Array<{
    name: string;
    path: string;
    disabled?: boolean;
  }>;
}

interface NavigationDropdownProps {
  item: NavigationItem;
  onHover?: (buttonName: string | null) => void;
  isHovered?: boolean;
}

const NavigationDropdown = ({ item, onHover, isHovered }: NavigationDropdownProps) => {
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isActive = item.subItems?.some(si => location.pathname === si.path) || false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <NavigationButton 
            item={item} 
            isActive={isActive} 
            isDropdown 
            onHover={onHover}
            isHovered={isHovered}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 md:w-[200px] bg-amber-50 border border-orange-200 rounded-lg shadow-lg">
        {item.subItems?.map((subItem) => (
          <DropdownMenuItem key={subItem.name} asChild className="p-0 focus:bg-transparent focus:text-inherit" disabled={subItem.disabled}>
              <Link
                to={subItem.path}
                onClick={(e) => {
                  if (subItem.disabled) {
                    e.preventDefault();
                    return;
                  }
                  // Don't scroll to top when there's a hash - let the About page handle it
                  if (!subItem.path.includes('#')) {
                    scrollToTop();
                  }
                }}
              className={cn(
                "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors w-full",
                "hover:bg-amber-100 focus:bg-amber-100 font-fun text-orange-800",
                subItem.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent focus:bg-transparent"
              )}
            >
              {subItem.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationDropdown;
