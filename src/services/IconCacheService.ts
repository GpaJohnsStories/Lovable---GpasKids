import { supabase } from "@/integrations/supabase/client";

interface CachedIcon {
  url: string;
  blob: Blob;
  timestamp: number;
}

interface IconCacheConfig {
  maxAge: number; // in milliseconds
  maxSize: number; // maximum number of icons to cache
}

class IconCacheService {
  private cache: Map<string, CachedIcon> = new Map();
  private loadingPromises: Map<string, Promise<string>> = new Map();
  private config: IconCacheConfig = {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 50 // max 50 icons
  };

  // Priority icons to preload (using "!" prefix for priority identification)
  private readonly PRIORITY_ICONS = [
    '!CO-HOX.jpg',      // Home icon
    '!CO-LB1.gif',      // Library main icon
    '!CO-LB2.gif',      // Browse Stories submenu
    '!CO-LB3.gif',      // Read Story submenu
    '!CO-CO1.gif',      // Comments main icon
    '!CO-CO2.gif',      // View Comments submenu
    '!CO-CO3.gif',      // Make Comment submenu
    '!CO-WR3.jpg',      // Writing main icon
    '!CO-WR2.gif',      // Submit Story submenu (tall & slender)
    '!CO-AV1.jpg',      // SuperAV Play button
    '!CO-AV2.jpg',      // SuperAV Pause button
    '!CO-WR3.jpg',      // How To Write submenu (same as main)
    '!CO-AB1.jpg',      // About Us main icon / Authors submenu
    '!CO-AB3.jpg',      // 3 Helpers submenu
    '!CO-AB5.jpg',      // The 3 AI's submenu
    '!CO-SA1.jpg',      // Safe & Secure main icon
    '!CO-MU2.gif',      // Menu button icon
    '!CO-HL2.gif',      // Buddy icon
    '!CO-HO1.jpg',      // Grandpa John icon
    '!CO-CDY.png',      // Peppermint candy audio button
    '!CO-CSZ.jpg',      // SuperAV change word size icon
    '!CO-CCP.png',      // SuperAV chocolate plus (increase font) icon
    '!CO-CCM.png',      // SuperAV chocolate minus (decrease font) icon
    '!CA-PL1.jpg',      // SuperAV play button icon
    '!CO-AV8.jpg',      // SuperAV fastest speed button icon
  ];

  /**
   * Get icon URL, either from cache or by loading it
   */
  async getIconUrl(iconPath: string): Promise<string> {
    // Check if already loading
    if (this.loadingPromises.has(iconPath)) {
      return this.loadingPromises.get(iconPath)!;
    }

    // Check cache first
    const cached = this.getCachedIcon(iconPath);
    if (cached) {
      return cached.url;
    }

    // Load icon
    const loadPromise = this.loadIcon(iconPath);
    this.loadingPromises.set(iconPath, loadPromise);

    try {
      const url = await loadPromise;
      return url;
    } finally {
      this.loadingPromises.delete(iconPath);
    }
  }

  /**
   * Preload priority icons (public menu and header icons)
   */
  async preloadPriorityIcons(): Promise<void> {
    console.log('🔄 Preloading priority icons...');
    
    const preloadPromises = this.PRIORITY_ICONS.map(async (iconPath) => {
      try {
        await this.getIconUrl(iconPath);
        console.log(`✅ Preloaded: ${iconPath}`);
      } catch (error) {
        console.warn(`⚠️ Failed to preload ${iconPath}:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
    console.log('🎯 Priority icon preloading complete');
  }

  /**
   * Get cached icon if valid
   */
  private getCachedIcon(iconPath: string): CachedIcon | null {
    const cached = this.cache.get(iconPath);
    
    if (!cached) {
      return null;
    }

    // Check if expired
    const isExpired = Date.now() - cached.timestamp > this.config.maxAge;
    if (isExpired) {
      this.cache.delete(iconPath);
      URL.revokeObjectURL(cached.url);
      return null;
    }

    return cached;
  }

  /**
   * Load icon from Supabase storage and cache it
   */
  private async loadIcon(iconPath: string): Promise<string> {
    try {
      // Get the icon from Supabase storage
      const { data, error } = await supabase.storage
        .from('icons')
        .download(iconPath);

      if (error) {
        throw new Error(`Failed to download icon ${iconPath}: ${error.message}`);
      }

      if (!data) {
        throw new Error(`No data received for icon: ${iconPath}`);
      }

      // Create blob URL
      const url = URL.createObjectURL(data);

      // Cache the icon
      this.cacheIcon(iconPath, data, url);

      return url;
    } catch (error) {
      console.error(`Failed to load icon ${iconPath}:`, error);
      
      // No fallback - let components handle missing icons by showing text
      throw error;
    }
  }

  /**
   * Cache an icon
   */
  private cacheIcon(iconPath: string, blob: Blob, url: string): void {
    // Clean up old entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldestEntry();
    }

    this.cache.set(iconPath, {
      url,
      blob,
      timestamp: Date.now()
    });

    console.log(`📦 Cached icon: ${iconPath} (cache size: ${this.cache.size})`);
  }

  /**
   * Evict the oldest cached entry
   */
  private evictOldestEntry(): void {
    let oldestKey = '';
    let oldestTimestamp = Date.now();

    for (const [key, cached] of this.cache.entries()) {
      if (cached.timestamp < oldestTimestamp) {
        oldestTimestamp = cached.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const cached = this.cache.get(oldestKey);
      if (cached) {
        URL.revokeObjectURL(cached.url);
        this.cache.delete(oldestKey);
        console.log(`🗑️ Evicted oldest cached icon: ${oldestKey}`);
      }
    }
  }

  /**
   * Create a fallback icon for failed loads
   */
  private createFallbackIcon(): string {
    // Create a simple colored square as fallback
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#F97316'; // Orange color from theme
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = '#FFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('?', 32, 36);
    }

    return canvas.toDataURL();
  }

  /**
   * Clear all cached icons
   */
  clearCache(): void {
    for (const cached of this.cache.values()) {
      URL.revokeObjectURL(cached.url);
    }
    this.cache.clear();
    console.log('🧹 Icon cache cleared');
  }

  /**
   * Clear specific icons from cache (useful for updated icons)
   */
  clearSpecificIcons(iconPaths: string[]): void {
    iconPaths.forEach(iconPath => {
      const cached = this.cache.get(iconPath);
      if (cached) {
        URL.revokeObjectURL(cached.url);
        this.cache.delete(iconPath);
        console.log(`🗑️ Cleared cached icon: ${iconPath}`);
      }
    });
  }

  /**
   * Force refresh a specific icon by clearing it from cache
   */
  refreshIcon(iconPath: string): void {
    this.clearSpecificIcons([iconPath]);
    console.log(`🔄 Icon ${iconPath} will be reloaded on next access`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      keys: Array.from(this.cache.keys()),
      loadingCount: this.loadingPromises.size
    };
  }
}

// Export singleton instance
export const iconCacheService = new IconCacheService();