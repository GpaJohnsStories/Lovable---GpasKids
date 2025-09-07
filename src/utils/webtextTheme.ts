/**
 * Webtext Theme Utilities
 * Extracts colors from content and derives theme colors for webtext boxes
 */

/**
 * Extracts the first hex color from HTML content
 */
export const extractFirstColor = (content: string): string | null => {
  if (!content) return null;
  
  // Look for hex colors in style attributes, color properties, etc.
  const hexColorRegex = /#[0-9A-Fa-f]{6}/g;
  const matches = content.match(hexColorRegex);
  
  return matches ? matches[0] : null;
};

/**
 * Derives a complete color theme from a base color
 */
export const deriveColorsFromBase = (baseColor: string) => {
  // Default to SYS-WEL blue if no color provided
  const fallbackColor = '#0B3D91';
  const color = baseColor || fallbackColor;
  
  // Convert hex to RGB for manipulation
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 11, g: 61, b: 145 }; // fallback to SYS-WEL blue
  };
  
  const rgb = hexToRgb(color);
  
  // Create derived colors
  const lighterBorder = `rgb(${Math.min(255, rgb.r + 40)}, ${Math.min(255, rgb.g + 40)}, ${Math.min(255, rgb.b + 40)})`;
  const backgroundTint = `${color}20`; // 20% opacity
  const photoMatColor = `${color}33`; // 33% opacity for photo mat
  const badgeColor = `${color}E6`; // 90% opacity for badge
  
  return {
    primary: color,
    lighterBorder,
    backgroundTint,
    photoMatColor,
    badgeColor
  };
};

/**
 * Selects the best image from story data
 * Priority: BIGICON > photo_link_1 > null
 */
export const selectBestImage = (story: any): string | null => {
  if (!story) return null;
  
  // Check for BIGICON in content first
  if (story.content && story.content.includes('BIGICON')) {
    // Try {{BIGICON}}path{{/BIGICON}} format first
    const blockMatch = story.content.match(/\{\{BIGICON\}\}([^{]+?)\{\{\/BIGICON\}\}/);
    if (blockMatch && blockMatch[1]) {
      return blockMatch[1].trim();
    }
    
    // Try {{BIGICON: path}} format
    const colonMatch = story.content.match(/\{\{BIGICON:\s*([^}]+?)\}\}/);
    if (colonMatch && colonMatch[1]) {
      return colonMatch[1].trim();
    }
    
    // Try BIGICON = path format
    const equalsMatch = story.content.match(/BIGICON\s*=\s*([^\s<]+)/);
    if (equalsMatch && equalsMatch[1]) {
      return equalsMatch[1].trim();
    }
  }
  
  // Fallback to photo_link_1
  return story.photo_link_1 || null;
};

/**
 * Gets the webtext theme from story content
 */
export const getWebtextTheme = (story: any) => {
  const firstColor = extractFirstColor(story?.content || '');
  const colors = deriveColorsFromBase(firstColor);
  const image = selectBestImage(story);
  
  return {
    colors,
    image,
    hasContent: !!story?.content
  };
};