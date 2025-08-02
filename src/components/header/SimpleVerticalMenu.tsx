import { useState } from "react";
import { useLocation } from "react-router-dom";
import MenuButton from "./MenuButton";
import { useCachedIcon } from "@/hooks/useCachedIcon";

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
  submenuLayout?: 'column' | 'grid';
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
      icon: "ICO-HOM.png",
      text: "Home",
      color: "#F97316",
      onClick: () => {
        window.location.href = "/";
        onClose();
      }
    },
    {
      id: "library",
      icon: "ICO-LIB.gif",
      text: "Library", 
      color: "#F97316",
      submenus: [
        {
          id: "browse-stories",
          icon: "ICO-BR2.gif",
          text: "Browse Stories",
          onClick: () => {
            window.location.href = "/library";
            onClose();
          }
        },
        {
          id: "read-story",
          icon: "ICO-RE2.gif", 
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
      icon: "ICO-COM.gif",
      text: "Comments",
      color: "#F97316", 
      submenus: [
        {
          id: "view-comments",
          icon: "ICO-VC2.gif",
          text: "View Comments",
          onClick: () => {
            window.location.href = "/view-comments";
            onClose();
          }
        },
        {
          id: "make-comment",
          icon: "ICO-MC2.gif",
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
      icon: "ICO-WRI.gif", 
      text: "Writing",
      color: "#F97316",
      submenus: [
        {
          id: "submit-story",
          icon: "ICO-SU2.gif",
          text: "Submit Story",
          onClick: () => {
            window.location.href = "/writing";
            onClose();
          }
        },
        {
          id: "how-to-write",
          icon: "ICO-HT2.gif",
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
      icon: "ICO-GUI.gif",
      text: "Guide",
      color: "#F97316",
      onClick: () => {
        window.location.href = "/help-gpa";
        onClose();
      }
    },
    {
      id: "about-us",
      icon: "ICO-ABO.gif",
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
          icon: "",
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
          icon: "",
          text: "Authors",
          onClick: () => {
            window.location.href = "/public-author-bios";
            onClose();
          }
        }
      ],
      submenuLayout: 'grid'
    },
    {
      id: "safe-secure",
      icon: "ICO-SAF.gif",
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-20"
        onClick={onClose}
      />
      
      {/* Menu Container - positioned below gold button, scrolls with page */}
      <div className="absolute top-full right-0 z-30 mt-2 max-h-[calc(100vh-10rem)] overflow-y-auto">
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
                
                {/* Submenu positioned to the left */}
                {item.submenus && activeSubmenu === item.id && (
                  <div className="absolute right-[74px] top-0 z-40 animate-slide-in-right">
                    <div className={item.submenuLayout === 'grid' ? "grid grid-cols-2 gap-0" : "flex flex-col gap-0"}>
                      {item.submenus.map((submenuItem) => (
                        <MenuButton
                          key={submenuItem.id}
                          icon={submenuItem.icon}
                          text={submenuItem.text}
                          color="#F97316"
                          onClick={() => handleSubmenuItemClick(submenuItem.onClick)}
                          customSize={submenuButtonSize}
                          disabled={submenuItem.disabled}
                          disabledMessage={submenuItem.disabledMessage}
                        />
                      ))}
                    </div>
                  </div>
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