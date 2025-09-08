/**
 * Super-Web-Box Theme Utilities
 * Handles color theming and background tint calculation for Super-Web-Box components
 */

/**
 * Calculate luminance of a color for background tint adjustment
 */
const getLuminance = (r: number, g: number, b: number): number => {
  // Convert RGB to relative luminance (0-1)
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Convert hex color to RGB values
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

/**
 * Create background tint from hex color
 * Uses luminance-based alpha for better readability
 */
export const createBackgroundTint = (hexColor: string): string => {
  const rgb = hexToRgb(hexColor);
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  
  // Adjust alpha based on luminance (lighter colors get lower alpha)
  // Dark colors: 0.12-0.18 alpha
  // Light colors: 0.06-0.12 alpha
  const baseAlpha = 0.18;
  const adjustedAlpha = Math.max(0.06, baseAlpha - (luminance * 0.12));
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${adjustedAlpha})`;
};

/**
 * Extract the best image from story data for Super-Web-Box
 * Uses photo_link_1 from the database
 */
export const selectSuperWebImage = (story: any): string | null => {
  if (!story) return null;
  
  // Use photo_link_1 from database
  return story.photo_link_1 || null;
};

/**
 * Get complete Super-Web-Box theme from story and color
 */
export const getSuperWebTheme = (story: any, hexColor: string) => {
  const backgroundTint = createBackgroundTint(hexColor);
  const image = selectSuperWebImage(story);
  
  return {
    primaryColor: hexColor,
    backgroundTint,
    image,
    hasContent: !!story?.content
  };
};