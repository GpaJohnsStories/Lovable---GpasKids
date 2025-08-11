/**
 * Typography scale utilities for proportional font sizing
 */

export type FontScaleStep = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export const FONT_SCALE_STEPS: FontScaleStep[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];

export const DEFAULT_FONT_SCALE: FontScaleStep = 'base';

/**
 * Get the next larger font scale step
 */
export const getNextLargerScale = (currentScale: FontScaleStep): FontScaleStep => {
  const currentIndex = FONT_SCALE_STEPS.indexOf(currentScale);
  const nextIndex = Math.min(currentIndex + 1, FONT_SCALE_STEPS.length - 1);
  return FONT_SCALE_STEPS[nextIndex];
};

/**
 * Get the next smaller font scale step
 */
export const getNextSmallerScale = (currentScale: FontScaleStep): FontScaleStep => {
  const currentIndex = FONT_SCALE_STEPS.indexOf(currentScale);
  const nextIndex = Math.max(currentIndex - 1, 0);
  return FONT_SCALE_STEPS[nextIndex];
};

/**
 * Check if scale is at minimum
 */
export const isMinScale = (scale: FontScaleStep): boolean => {
  return scale === FONT_SCALE_STEPS[0];
};

/**
 * Check if scale is at maximum
 */
export const isMaxScale = (scale: FontScaleStep): boolean => {
  return scale === FONT_SCALE_STEPS[FONT_SCALE_STEPS.length - 1];
};

/**
 * Generate CSS classes for proportional typography
 */
export const getTypographyClasses = (scaleStep: FontScaleStep) => {
  return {
    base: `text-story-${scaleStep}`,
    h3: `text-story-h3-${scaleStep}`,
    p: `text-story-${scaleStep}`,
    li: `text-story-${scaleStep}`,
    span: `text-story-${scaleStep}`,
    em: `text-story-${scaleStep}`,
    strong: `text-story-${scaleStep}`,
    i: `text-story-${scaleStep}`,
    b: `text-story-${scaleStep}`,
  };
};

/**
 * Convert legacy pixel font size to nearest scale step
 */
export const pixelSizeToScale = (pixelSize: number): FontScaleStep => {
  // Map pixel sizes to scale steps based on base rem values
  if (pixelSize <= 12) return 'xs';
  if (pixelSize <= 14) return 'sm';
  if (pixelSize <= 16) return 'base';
  if (pixelSize <= 18) return 'lg';
  if (pixelSize <= 20) return 'xl';
  if (pixelSize <= 24) return '2xl';
  if (pixelSize <= 30) return '3xl';
  return '4xl';
};

/**
 * Get display name for scale step
 */
export const getScaleDisplayName = (scale: FontScaleStep): string => {
  const names = {
    xs: 'Extra Small',
    sm: 'Small',
    base: 'Normal',
    lg: 'Large',
    xl: 'Extra Large',
    '2xl': 'Double Large',
    '3xl': 'Triple Large',
    '4xl': 'Maximum',
  };
  return names[scale];
};