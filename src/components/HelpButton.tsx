
import React from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useHelp } from '@/contexts/HelpContext';

interface HelpButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  showText?: boolean;
}

const HelpButton: React.FC<HelpButtonProps> = ({ 
  className = "",
  size = "sm",
  variant = "outline",
  showText = true
}) => {
  const { showHelp } = useHelp();

  const handleClick = () => {
    const currentPath = window.location.pathname;
    console.log('🔘 HelpButton clicked for path:', currentPath);
    showHelp(currentPath);
  };

  return (
    <Button
      onClick={handleClick}
      className={`bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300 ${className}`}
      size={size}
      variant={variant}
    >
      <HelpCircle className="h-4 w-4" />
      {showText && <span className="ml-2">Help</span>}
    </Button>
  );
};

export default HelpButton;
