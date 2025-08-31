import { supabase } from "@/integrations/supabase/client";

interface CachedIcon {
  url: string;
  blob: Blob;
  timestamp: number;
  iconName?: string; // Add icon name for tooltips
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
   * Preload priority icons (automatically detect icons with "!" prefix from database)
   */
  async preloadPriorityIcons(): Promise<void> {
    console.log('🔄 Preloading priority icons...');
    
    try {
      // Fetch all priority icons from database (icons starting with "!")
      const { data: priorityIcons, error } = await supabase
        .from('icon_library')
        .select('file_name_path')
        .like('file_name_path', '!%');

      if (error) {
        console.warn('⚠️ Failed to fetch priority icons from database:', error);
        return;
      }

      if (!priorityIcons || priorityIcons.length === 0) {
        console.log('📭 No priority icons found in database');
        return;
      }

      console.log(`🎯 Found ${priorityIcons.length} priority icons to preload`);

      const preloadPromises = priorityIcons.map(async (iconRecord) => {
        const iconPath = iconRecord.file_name_path;
        try {
          await this.getIconUrl(iconPath);
          console.log(`✅ Preloaded: ${iconPath}`);
        } catch (error) {
          console.warn(`⚠️ Failed to preload ${iconPath}:`, error);
          // Don't throw, just log the error and continue
        }
      });

      await Promise.allSettled(preloadPromises);
      console.log('🎯 Priority icon preloading complete');
    } catch (error) {
      console.error('💥 Error during priority icon preloading:', error);
      // Don't throw, just log the error to prevent app crashes
    }
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
   * Load icon from Supabase storage and cache it with retries
   */
  private async loadIcon(iconPath: string): Promise<string> {
    const maxRetries = 3;
    const retryDelay = 500; // Start with 500ms

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // First, try to get icon metadata from database
        let iconName = iconPath; // Default fallback
        
        const { data: iconData, error: dbError } = await supabase
          .from('icon_library')
          .select('icon_name')
          .eq('file_name_path', iconPath)
          .single();
        
        if (!dbError && iconData) {
          iconName = iconData.icon_name;
        }

        console.log(`🔍 Attempting to download icon: ${iconPath} (attempt ${attempt}/${maxRetries})`);

        // Try download method first
        const { data, error } = await supabase.storage
          .from('icons')
          .download(iconPath);

        if (error) {
          console.warn(`❌ Download failed for ${iconPath}:`, error);
          
          // Fallback to public URL method with cache-busting
          console.log(`🔄 Trying public URL fallback for: ${iconPath}`);
          const { data: publicUrlData } = supabase.storage
            .from('icons')
            .getPublicUrl(iconPath);
          
          if (publicUrlData?.publicUrl) {
            // Add cache-busting parameter
            const cacheBustedUrl = this.addCacheBusting(publicUrlData.publicUrl);
            console.log(`✅ Using cache-busted public URL for ${iconPath}: ${cacheBustedUrl}`);
            
            // Test if URL actually loads before caching
            await this.testImageLoad(cacheBustedUrl);
            
            // Cache the direct URL
            this.cacheDirectUrl(iconPath, cacheBustedUrl, iconName);
            return cacheBustedUrl;
          }
          
          throw new Error(`Failed to get public URL for icon ${iconPath}: ${JSON.stringify(error)}`);
        }

        if (!data) {
          throw new Error(`No data received for icon: ${iconPath}`);
        }

        console.log(`✅ Successfully downloaded icon: ${iconPath}`);

        // Create blob URL
        const url = URL.createObjectURL(data);

        // Cache the icon with its name
        this.cacheIcon(iconPath, data, url, iconName);

        return url;
      } catch (error) {
        console.warn(`💥 Attempt ${attempt} failed for icon ${iconPath}:`, error);
        
        if (attempt === maxRetries) {
          console.error(`💥 All attempts failed for icon ${iconPath}:`, error);
          throw error;
        }
        
        // Exponential backoff delay
        const delay = retryDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error(`Failed to load icon ${iconPath} after ${maxRetries} attempts`);
  }

  /**
   * Add cache-busting parameter to URL
   */
  private addCacheBusting(url: string): string {
    const separator = url.includes('?') ? '&' : '?';
    const timestamp = Date.now();
    return `${url}${separator}v=${timestamp}`;
  }

  /**
   * Test if an image URL actually loads
   */
  private async testImageLoad(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        reject(new Error('Image load timeout'));
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Image failed to load'));
      };
      
      img.src = url;
    });
  }

  /**
   * Cache an icon
   */
  private cacheIcon(iconPath: string, blob: Blob, url: string, iconName?: string): void {
    // Clean up old entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldestEntry();
    }

    this.cache.set(iconPath, {
      url,
      blob,
      timestamp: Date.now(),
      iconName
    });

    console.log(`📦 Cached icon: ${iconPath} (cache size: ${this.cache.size})`);
  }

  /**
   * Cache a direct URL (for public URLs that don't need blob conversion)
   */
  private cacheDirectUrl(iconPath: string, url: string, iconName?: string): void {
    // Clean up old entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldestEntry();
    }

    // Create a minimal blob for consistency (not actually used)
    const dummyBlob = new Blob([''], { type: 'text/plain' });

    this.cache.set(iconPath, {
      url,
      blob: dummyBlob,
      timestamp: Date.now(),
      iconName
    });

    console.log(`📦 Cached direct URL: ${iconPath} (cache size: ${this.cache.size})`);
  }

  /**
   * Get icon name for tooltip/alt text
   */
  getIconName(iconPath: string): string | null {
    const cached = this.cache.get(iconPath);
    return cached?.iconName || null;
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
   * Force refresh all cached icons by clearing cache completely
   */
  refreshAllIcons(): void {
    this.clearCache();
    console.log('🔄 All icons will be reloaded with fresh cache-busting parameters');
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