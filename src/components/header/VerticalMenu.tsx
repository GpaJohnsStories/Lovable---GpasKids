import { useState } from "react";
import MenuButton from "./MenuButton";
import MenuItemWithSubmenus from "./MenuItemWithSubmenus";

interface VerticalMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const VerticalMenu = ({ isVisible, onClose }: VerticalMenuProps) => {
  if (!isVisible) return null;

  // First menu item: HOME (no submenus)
  const homeMenuItem = {
    id: "home",
    icon: "ICO-HOX.jpg",
    text: "HOME",
    color: "#F97316",
    onClick: () => {
      window.location.href = "/";
      onClose();
    }
  };

  // Second menu item: STORIES (with submenus - example structure)
  const storiesMenuItem = {
    id: "stories",
    icon: "ICO-ST1",
    text: "STORIES",
    color: "#F97316",
    onClick: () => {
      console.log("Stories menu clicked");
    },
    submenus: [
      {
        items: [
          {
            id: "library",
            icon: "ICO-LB1",
            text: "LIBRARY",
            onClick: () => {
              window.location.href = "/library";
              onClose();
            }
          }
        ],
        position: 'left' as const,
        level: 1
      },
      {
        items: [
          {
            id: "read-stories",
            icon: "ICO-RD1",
            text: "READ",
            onClick: () => {
              console.log("Read stories clicked");
              onClose();
            }
          }
        ],
        position: 'left' as const,
        level: 2
      }
    ]
  };

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div 
        className="fixed inset-0 z-30 bg-black/20"
        onClick={onClose}
      />
      
      {/* Waterfall Dropdown Menu Container - positioned absolutely relative to header */}
      <div className="absolute top-full right-4 z-40 animate-slide-in-right">
        <div className="flex flex-col gap-2">
          {/* First menu item: HOME (no submenus) */}
          <MenuButton
            key={homeMenuItem.id}
            icon={homeMenuItem.icon}
            text={homeMenuItem.text}
            color={homeMenuItem.color}
            onClick={homeMenuItem.onClick}
          />
          
          {/* Second menu item: STORIES (with submenus) */}
          <MenuItemWithSubmenus
            key={storiesMenuItem.id}
            id={storiesMenuItem.id}
            icon={storiesMenuItem.icon}
            text={storiesMenuItem.text}
            color={storiesMenuItem.color}
            onClick={storiesMenuItem.onClick}
            submenus={storiesMenuItem.submenus}
          />
        </div>
      </div>
    </>
  );
};

export default VerticalMenu;