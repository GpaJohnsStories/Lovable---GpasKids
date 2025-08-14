import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { iconCacheService } from '@/services/IconCacheService';

interface IconCacheContextType {
  getIconUrl: (iconPath: string) => Promise<string>;
  getIconName: (iconPath: string) => string | null;
  isPreloading: boolean;
  preloadingProgress: number;
  cacheStats: {
    size: number;
    maxSize: number;
    keys: string[];
    loadingCount: number;
  };
  refreshStats: () => void;
}

const IconCacheContext = createContext<IconCacheContextType | undefined>(undefined);

interface IconCacheProviderProps {
  children: React.ReactNode;
}

export const IconCacheProvider: React.FC<IconCacheProviderProps> = ({ children }) => {
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadingProgress, setPreloadingProgress] = useState(0);
  const [cacheStats, setCacheStats] = useState(() => iconCacheService.getCacheStats());

  // Initialize cache and preload priority icons
  useEffect(() => {
    const initializeCache = async () => {
      console.log('🚀 Initializing icon cache...');
      setIsPreloading(true);
      setPreloadingProgress(0);

      try {
        await iconCacheService.preloadPriorityIcons();
        setPreloadingProgress(100);
      } catch (error) {
        console.error('Failed to preload icons:', error);
      } finally {
        setIsPreloading(false);
        setCacheStats(iconCacheService.getCacheStats());
        console.log('✅ Icon cache initialization complete');
      }
    };

    initializeCache();

    // Cleanup on unmount
    return () => {
      iconCacheService.clearCache();
    };
  }, []);

  const getIconUrl = useCallback(async (iconPath: string): Promise<string> => {
    try {
      const url = await iconCacheService.getIconUrl(iconPath);
      // Update stats after getting an icon
      setCacheStats(iconCacheService.getCacheStats());
      return url;
    } catch (error) {
      console.error(`Failed to get icon URL for ${iconPath}:`, error);
      throw error;
    }
  }, []);

  const getIconName = useCallback((iconPath: string): string | null => {
    return iconCacheService.getIconName(iconPath);
  }, []);

  const refreshStats = useCallback(() => {
    setCacheStats(iconCacheService.getCacheStats());
  }, []);

  const contextValue: IconCacheContextType = {
    getIconUrl,
    getIconName,
    isPreloading,
    preloadingProgress,
    cacheStats,
    refreshStats
  };

  return (
    <IconCacheContext.Provider value={contextValue}>
      {children}
    </IconCacheContext.Provider>
  );
};

export const useIconCache = (): IconCacheContextType => {
  const context = useContext(IconCacheContext);
  if (!context) {
    throw new Error('useIconCache must be used within an IconCacheProvider');
  }
  return context;
};