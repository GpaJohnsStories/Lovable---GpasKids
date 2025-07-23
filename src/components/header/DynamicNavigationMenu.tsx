import React from "react";
import { useLocation } from "react-router-dom";
import { useMenuData, MenuButton } from "@/hooks/useMenuData";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import DynamicNavigationButton from "./DynamicNavigationButton";
import DynamicNavigationDropdown from "./DynamicNavigationDropdown";

interface DynamicNavigationMenuProps {
  menuGroup?: string;
}

const DynamicNavigationMenu: React.FC<DynamicNavigationMenuProps> = ({ menuGroup = "Public" }) => {
  const location = useLocation();
  const { data: menuButtons, isLoading } = useMenuData(menuGroup);

  if (isLoading) {
    return (
      <NavigationMenu>
        <NavigationMenuList className="flex flex-wrap gap-2 md:gap-4">
          <div className="animate-pulse bg-muted rounded h-10 w-20"></div>
          <div className="animate-pulse bg-muted rounded h-10 w-20"></div>
          <div className="animate-pulse bg-muted rounded h-10 w-20"></div>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  const isActive = (button: MenuButton) => {
    if (button.path) {
      return location.pathname === button.path;
    }
    // For buttons with subitems, check if any subitem matches current path
    return button.subitems?.some(subitem => location.pathname === subitem.subitem_path) || false;
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-wrap gap-2 md:gap-4">
        {menuButtons?.map((button) => {
          const active = isActive(button);
          
          if (button.subitems && button.subitems.length > 0) {
            return (
              <DynamicNavigationDropdown
                key={button.button_code}
                button={button}
                isActive={active}
              />
            );
          } else {
            return (
              <DynamicNavigationButton
                key={button.button_code}
                button={button}
                isActive={active}
              />
            );
          }
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DynamicNavigationMenu;