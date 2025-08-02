import { useState } from "react";
import { useLocation } from "react-router-dom";
import MenuButton from "./MenuButton";
import MenuItemWithSubmenus from "./MenuItemWithSubmenus";

interface VerticalMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const VerticalMenu = ({ isVisible, onClose }: VerticalMenuProps) => {
  if (!isVisible) return null;

  const location = useLocation();
  
  // Check if user has selected a story - either currently viewing one or has one stored
  const hasSelectedStory = location.pathname.startsWith('/story/') || 
                          sessionStorage.getItem('currentStoryPath') !== null;
  
  // Debug logging
  console.log('🔍 Menu state check:', {
    currentPath: location.pathname,
    sessionStoryPath: sessionStorage.getItem('currentStoryPath'),
    hasSelectedStory
  });

  // Define main menu button size (same as golden button on phone: 4rem x 4rem)
  const mainButtonSize = {
    width: '4rem',     // 64px - same as golden button on phone
    height: '4rem',    // 64px - same as golden button on phone  
    iconSize: '3.5rem' // Slightly smaller than container for padding
  };

  // First menu item: HOME (no submenus)
  const homeMenuItem = {
    id: "home",
    icon: "ICO-HOX.jpg",
    text: "Home",
    color: "#F97316",
    onClick: () => {
      window.location.href = "/";
      onClose();
    }
  };

  // Second menu item: LIBRARY (with submenus - example structure)
  const storiesMenuItem = {
    id: "stories",
    icon: "ICO-LB1.gif",
    text: "Library",
    color: "#F97316",
    onClick: () => {
      console.log("Library menu clicked");
    },
    submenus: [
      {
        items: [
          {
            id: "library",
            icon: "ICO-LB2.gif",
            text: "Story List",
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
            icon: "ICO-LB3.gif",
            text: "Read",
            onClick: hasSelectedStory ? () => {
              // If already on a story page, stay there, otherwise use stored path
              if (location.pathname.startsWith('/story/')) {
                // Already viewing a story, no need to navigate
                onClose();
              } else {
                const storyPath = sessionStorage.getItem('currentStoryPath');
                if (storyPath) {
                  window.location.href = storyPath;
                }
                onClose();
              }
            } : () => {
              // Do nothing if no story selected
            },
            disabled: !hasSelectedStory,
            disabledMessage: "You have not yet selected a story to read from the Library List."
          }
        ],
        position: 'left' as const,
        level: 2
      }
    ]
  };

  // Third menu item: COMMENTS (with submenus)
  const commentsMenuItem = {
    id: "comments",
    icon: "ICO-CO1.gif",
    text: "Comments",
    color: "#F97316",
    onClick: () => {
      console.log("Comments menu clicked");
    },
    submenus: [
      {
        items: [
          {
            id: "write-comment",
            icon: "ICO-CO2.gif",
            text: "Write a Comment",
            onClick: () => {
              window.location.href = "/make-comment";
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
            id: "all-comments",
            icon: "ICO-CO3.gif",
            text: "All Comments",
            onClick: () => {
              window.location.href = "/view-comments";
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
      
      {/* Waterfall Dropdown Menu Container - aligned with right edge of golden button */}
      <div className="absolute top-full right-0 z-40 animate-slide-in-right">
        <div className="flex flex-col gap-0 items-end">
          {/* First menu item: HOME (no submenus) */}
          <MenuButton
            key={homeMenuItem.id}
            icon={homeMenuItem.icon}
            text={homeMenuItem.text}
            color={homeMenuItem.color}
            onClick={homeMenuItem.onClick}
            customSize={mainButtonSize}
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
            customSize={mainButtonSize}
          />
          
          {/* Third menu item: COMMENTS (with submenus) */}
          <MenuItemWithSubmenus
            key={commentsMenuItem.id}
            id={commentsMenuItem.id}
            icon={commentsMenuItem.icon}
            text={commentsMenuItem.text}
            color={commentsMenuItem.color}
            onClick={commentsMenuItem.onClick}
            submenus={commentsMenuItem.submenus}
            customSize={mainButtonSize}
          />
        </div>
      </div>
    </>
  );
};

export default VerticalMenu;