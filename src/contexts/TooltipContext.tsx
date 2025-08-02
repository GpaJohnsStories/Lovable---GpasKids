import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIconCache } from './IconCacheContext';

interface TooltipContextType {
  shouldShowTooltips: boolean;
  registerTooltip: (id: string) => void;
  unregisterTooltip: (id: string) => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shouldShowTooltips, setShouldShowTooltips] = useState(false);
  const [activeTooltips, setActiveTooltips] = useState<Set<string>>(new Set());
  const { isPreloading } = useIconCache();

  // Only show tooltips after icons are preloaded and a brief delay for rendering
  useEffect(() => {
    if (!isPreloading) {
      const timer = setTimeout(() => {
        setShouldShowTooltips(true);
      }, 200); // Small delay to ensure all components are rendered
      
      return () => clearTimeout(timer);
    } else {
      setShouldShowTooltips(false);
    }
  }, [isPreloading]);

  const registerTooltip = (id: string) => {
    setActiveTooltips(prev => new Set(prev).add(id));
  };

  const unregisterTooltip = (id: string) => {
    setActiveTooltips(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <TooltipContext.Provider value={{ 
      shouldShowTooltips, 
      registerTooltip, 
      unregisterTooltip 
    }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltipContext must be used within a TooltipProvider');
  }
  return context;
};