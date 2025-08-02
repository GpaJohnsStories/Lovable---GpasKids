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
}

const SimpleVerticalMenu = ({ isVisible, onClose }: SimpleVerticalMenuProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const location = useLocation();
  
  // Check if we're on a story page for the Read button
  const isStorySelected = location.pathname.startsWith('/story/');

  if (!isVisible) return null;

  const mainMenuItems: MainMenuItem[] = [
    {
      id: "home",
      icon: "ICO-HOX.jpg", // Home icon (available in storage)
      text: "Home",
      color: "#F97316",
      onClick: () => {
        window.location.href = "/";
        onClose();
      }
    },
    {
      id: "library",
      icon: "ICO-LB1.gif", // Library icon (available in storage)
      text: "Library", 
      color: "#F97316",
      submenus: [
        {
          id: "browse-stories",
          icon: "ICO-LB2.gif", // Browse Stories (available in storage)
          text: "Browse Stories",
          onClick: () => {
            window.location.href = "/library";
            onClose();
          }
        },
        {
          id: "read-story",
          icon: "ICO-LB3.gif", // Read Story (available in storage) 
          text: "Read Story",
          onClick: () => {
            console.log("Read Story clicked");
            onClose();
          },
          disabled: !isStorySelected,
          disabledMessage: "Select a story first to read"
        }
      ]
    },
    {
      id: "comments",
      icon: "ICO-CO1.gif", // Comments icon (available in storage)
      text: "Comments",
      color: "#F97316", 
      submenus: [
        {
          id: "view-comments",
          icon: "ICO-CO2.gif", // View Comments (available in storage)
          text: "View Comments",
          onClick: () => {
            window.location.href = "/view-comments";
            onClose();
          }
        },
        {
          id: "make-comment",
          icon: "ICO-CO3.gif", // Make Comment (available in storage)
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
      icon: "ICO-WR3.jpg", // Writing icon (main menu) 
      text: "Writing",
      color: "#F97316",
      submenus: [
        {
          id: "submit-story",
          icon: "ICO-WR2.gif", // Submit Story (1st/rightmost submenu - tall & slender)
          text: "Submit Story",
          onClick: () => {
            window.location.href = "/writing";
            onClose();
          }
        },
        {
          id: "how-to-write",
          icon: "ICO-WR3.jpg", // How To Write (2nd/leftmost submenu - same as main)
          text: "How To Write",
          onClick: () => {
            window.location.href = "/how-to";
            onClose();
          }
        }
      ]
    },
    {
      id: "guide", 
      icon: "ICO-GU1.jpg", // Guide icon (available in storage)
      text: "Guide",
      color: "#F97316",
      onClick: () => {
        window.location.href = "/help-gpa";
        onClose();
      }
    },
    {
      id: "about-us",
      icon: "ICO-AB1.jpg", // About Us icon (available in storage)
      text: "About Us",
      color: "#F97316",
      submenus: [
        {
          id: "3-helpers",
          icon: "ICO-AB3.jpg",
          text: "3 Helpers", 
          onClick: () => {
            console.log("3 Helpers clicked");
            onClose();
          }
        },
        {
          id: "grandpa-john",
          icon: "ICO-HO1.jpg", // Grandpa John icon (exists in storage)
          text: "Grandpa John",
          onClick: () => {
            window.location.href = "/about";
            onClose();
          }
        },
        {
          id: "the-3-ais",
          icon: "ICO-AB5.jpg", 
          text: "The 3 AI's",
          onClick: () => {
            console.log("The 3 AI's clicked");
            onClose();
          }
        },
        {
          id: "authors",
          icon: "ICO-AB1.jpg", // Authors icon (exists in storage)
          text: "Authors",
          onClick: () => {
            window.location.href = "/public-author-bios";
            onClose();
          }
        }
      ]
    },
    {
      id: "safe-secure",
      icon: "ICO-SA1.jpg", // Safe & Secure icon (available in storage)
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
    }
  };

  const handleSubmenuItemClick = (onClick: () => void) => {
    onClick();
    setActiveSubmenu(null);
  };

  // Main menu button size (same as golden button on phone)
  const mainButtonSize = { width: '4rem', height: '4rem', iconSize: '3.5rem' };
  
  // Submenu button size (same as main menu buttons)
  const submenuButtonSize = { width: '4rem', height: '4rem', iconSize: '3.5rem' };

  return (
    <>
      {/* Menu Container - positioned below gold button, scrolls with page */}
      <div className="absolute top-full right-0 z-30 mt-2">
        <div className="relative">
          {/* Main Menu - 1x7 vertical layout */}
          <div className="flex flex-col gap-0">
            {mainMenuItems.map((item) => (
              <div key={item.id} className="relative">
                <MenuButton
                  icon={item.icon}
                  text={item.text}
                  color={item.color}
                  onClick={() => handleMainMenuClick(item)}
                  customSize={mainButtonSize}
                />
                
                {/* Submenu buttons arranged horizontally in a line going left */}
                {item.submenus && activeSubmenu === item.id && (
                  <>
                    {item.submenus.map((submenuItem, index) => (
                      <div 
                        key={submenuItem.id}
                        className={`absolute top-0 z-40 animate-slide-in-right`}
                        style={{ right: `${(index + 1) * 74}px` }}
                      >
                        <MenuButton
                          icon={submenuItem.icon}
                          text={submenuItem.text}
                          color="#F97316"
                          onClick={() => handleSubmenuItemClick(submenuItem.onClick)}
                          customSize={submenuButtonSize}
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