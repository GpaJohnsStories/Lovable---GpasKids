import { useState } from "react";
import { useLocation } from "react-router-dom";
import MenuButton from "./MenuButton";

interface SimpleVerticalMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SubMenuItem {
  id: string;
  icon: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
  disabledMessage?: string;
}

interface MainMenuItem {
  id: string;
  icon: string;
  text: string;
  color: string;
  onClick?: () => void;
  submenus?: SubMenuItem[];
  disabled?: boolean;
  disabledMessage?: string;
  tooltipText?: string;
}

const SimpleVerticalMenu = ({ isVisible, onClose }: SimpleVerticalMenuProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const location = useLocation();
  
  // Check if we have a stored story path or if we're currently on a story page
  const currentStoryPath = sessionStorage.getItem('currentStoryPath');
  const isStorySelected = location.pathname.startsWith('/story/') || currentStoryPath;

  // Close submenu when menu becomes invisible
  if (!isVisible) {
    if (activeSubmenu) {
      setActiveSubmenu(null);
    }
    return null;
  }

  const mainMenuItems: MainMenuItem[] = [
    {
      id: "guide", 
      icon: "!CO-MM1.jpg", // Guide icon - Main Menu 1
      text: "!CO-MM1.jpg",
      tooltipText: "Guide",
      color: "#F97316",
      onClick: () => {
        window.location.href = "/guide";
        onClose();
      }
    },
    {
      id: "home",
      icon: "!CO-MM2.jpg", // Home icon - Main Menu 2
      text: "!CO-MM2.jpg",
      tooltipText: "Home",
      color: "#F97316",
      onClick: () => {
        window.location.href = "/";
        onClose();
      }
    },
    {
      id: "library",
      icon: "!CO-MM3.jpg", // Library icon - Main Menu 3
      text: "Library", 
      color: "#F97316",
      onClick: () => {
        window.location.href = "/library";
        onClose();
      }
    },
    {
      id: "read-story",
      icon: "!CO-MM4.jpg", // Read Story icon - Main Menu 4
      text: "Read Story",
      color: "#F97316",
      onClick: () => {
        console.log("Read Story clicked");
        // If we're already on a story page, just close the menu
        if (location.pathname.startsWith('/story/')) {
          onClose();
          return;
        }
        // Otherwise, navigate to the stored story path
        const storedPath = sessionStorage.getItem('currentStoryPath');
        if (storedPath) {
          window.location.href = storedPath;
        }
        onClose();
      },
      disabled: !isStorySelected,
      disabledMessage: "Select a story first to read"
    },
    {
      id: "comments",
      icon: "!CO-MM5.jpg", // Comments icon - Main Menu 5
      text: "Comments",
      color: "#F97316", 
      submenus: [
        {
          id: "view-comments",
          icon: "!CO-S51.jpg", // View Comments - Submenu 5-1
          text: "View Comments",
          onClick: () => {
            window.location.href = "/view-comments";
            onClose();
          }
        },
        {
          id: "make-comment",
          icon: "!CO-S52.jpg", // Make Comment - Submenu 5-2
          text: "Make Comment", 
          onClick: () => {
            window.location.href = "/make-comment";
            onClose();
          }
        }
      ]
    },
    {
      id: "writing",
      icon: "!CO-MM6.jpg", // Writing icon - Main Menu 6
      text: "Writing",
      color: "#F97316",
      submenus: [
        {
          id: "submit-story",
          icon: "!CO-S61.jpg", // Submit Story - Submenu 6-1
          text: "Submit Story",
          onClick: () => {
            window.location.href = "/writing";
            onClose();
          }
        }
      ]
    },
    {
      id: "about-us",
      icon: "!CO-MM7.jpg", // About Us icon - Main Menu 7
      text: "About Us",
      color: "#F97316",
      submenus: [
        {
          id: "grandpa-john",
          icon: "!CO-S71.jpg", // Grandpa John - Submenu 7-1
          text: "Grandpa John",
          onClick: () => {
            window.location.href = "/about";
            onClose();
          }
        },
        {
          id: "3-helpers",
          icon: "!CO-S72.jpg", // 3 Helpers - Submenu 7-2
          text: "3 Helpers", 
          onClick: () => {
            window.location.href = "/about#buddy";
            onClose();
          }
        },
        {
          id: "authors",
          icon: "!CO-S73.jpg", // Authors - Submenu 7-3
          text: "Authors",
          onClick: () => {
            window.location.href = "/author-bios-simple";
            onClose();
          }
        },
        {
          id: "the-3-ais",
          icon: "!CO-S74.jpg", // 3 Helpful AI's - Submenu 7-4
          text: "3 Helpful AI's",
          onClick: () => {
            window.location.href = "/about#special-thank-you";
            onClose();
          }
        }
      ]
    },
    {
      id: "safe-secure",
      icon: "!CO-MM8.jpg", // Safe & Secure icon - Main Menu 8
      text: "Safe & Secure", 
      color: "#F97316",
      onClick: () => {
        window.location.href = "/privacy";
        onClose();
      }
    }
  ];

  const handleMainMenuClick = (item: MainMenuItem) => {
    if (item.submenus) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    } else if (item.onClick) {
      item.onClick();
      // Close any open submenu when clicking a non-submenu item
      setActiveSubmenu(null);
    }
  };

  const handleSubmenuItemClick = (onClick: () => void) => {
    onClick();
    setActiveSubmenu(null);
  };

  // Close submenu when clicking outside the menu area
  const handleMenuContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Button sizes are now hardcoded in MenuButton component (64x64px buttons, 56x56px icons)

  return (
    <>
      {/* Menu Container - positioned below gold button, scrolls with page */}
      <div 
        className="absolute top-full right-0 z-30 mt-2"
        onClick={handleMenuContainerClick}
      >
        <div className="relative">
          {/* Main Menu - 1x7 vertical layout with hardcoded sizing */}
          <div className="flex flex-col gap-0" style={{ width: '64px' }}>
            {mainMenuItems.map((item) => (
              <div key={item.id} className="relative" style={{ width: '64px', height: '64px', flexShrink: 0 }}>
                <MenuButton
                  icon={item.icon}
                  text={item.text}
                  color={item.color}
                  onClick={() => handleMainMenuClick(item)}
                  disabled={item.disabled}
                  disabledMessage={item.disabledMessage}
                  tooltipText={item.tooltipText}
                />
                
                {/* Submenu buttons arranged horizontally in a line going left */}
                {item.submenus && activeSubmenu === item.id && (
                  <>
                    {item.submenus.map((submenuItem, index) => (
                      <div 
                        key={submenuItem.id}
                        className="absolute top-0 z-40"
                        style={{ 
                          right: `${(index + 1) * 68}px`,
                          width: '64px',
                          height: '64px'
                        }}
                      >
                        <MenuButton
                          icon={submenuItem.icon}
                          text={submenuItem.text}
                          color="#F97316"
                          onClick={() => handleSubmenuItemClick(submenuItem.onClick)}
                          disabled={submenuItem.disabled}
                          disabledMessage={submenuItem.disabledMessage}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleVerticalMenu;