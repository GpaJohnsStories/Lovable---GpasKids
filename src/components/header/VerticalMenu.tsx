import { useState } from "react";
import MenuButton from "./MenuButton";

interface VerticalMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const VerticalMenu = ({ isVisible, onClose }: VerticalMenuProps) => {
  if (!isVisible) return null;

  const menuItems = [
    {
      id: "home",
      icon: "ICO-HO2",
      text: "HOME",
      color: "#F97316", // Vibrant orange
      onClick: () => {
        window.location.href = "/";
        onClose();
      }
    }
  ];

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div 
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />
      
      {/* Waterfall Dropdown Menu Container - positioned below main menu button */}
      <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <MenuButton
              key={item.id}
              icon={item.icon}
              text={item.text}
              color={item.color}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default VerticalMenu;