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
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Vertical Menu Container */}
      <div className="fixed top-20 right-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-orange-300 p-4 animate-scale-in">
        <div className="flex flex-col gap-3">
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