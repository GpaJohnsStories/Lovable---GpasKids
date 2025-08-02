import { useState, useEffect } from 'react';
import { useIconCache } from '@/contexts/IconCacheContext';

interface UseCachedIconResult {
  iconUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to load and cache an icon
 */
export const useCachedIcon = (iconPath: string | null): UseCachedIconResult => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getIconUrl } = useIconCache();

  useEffect(() => {
    if (!iconPath) {
      setIconUrl(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const loadIcon = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = await getIconUrl(iconPath);
        setIconUrl(url);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load icon';
        setError(errorMessage);
        console.error(`Failed to load icon ${iconPath}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadIcon();
  }, [iconPath, getIconUrl]);

  return {
    iconUrl,
    isLoading,
    error
  };
};