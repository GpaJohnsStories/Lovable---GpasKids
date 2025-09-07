/**
 * Utilities for image aspect ratio classification and adaptive spacing
 */

export type ImageAspectType = 'portrait' | 'square' | 'landscape';

/**
 * Classifies an image's aspect ratio
 * @param naturalWidth - The natural width of the image
 * @param naturalHeight - The natural height of the image
 * @returns The aspect type classification
 */
export const classifyImageAspect = (naturalWidth: number, naturalHeight: number): ImageAspectType => {
  const aspectRatio = naturalWidth / naturalHeight;
  
  if (aspectRatio < 0.9) {
    return 'portrait';
  } else if (aspectRatio <= 1.1) {
    return 'square';
  } else {
    return 'landscape';
  }
};

/**
 * Gets the appropriate right margin class for text wrapping based on image aspect
 * @param aspectType - The aspect type of the image
 * @returns The Tailwind CSS class for right margin
 */
export const getImageGutterClass = (aspectType: ImageAspectType): string => {
  switch (aspectType) {
    case 'portrait':
      return 'mr-3'; // Tight spacing for narrow images
    case 'square':
      return 'mr-4'; // Medium spacing for square images
    case 'landscape':
      return 'mr-6'; // Wider spacing for wide images
    default:
      return 'mr-4'; // Default fallback
  }
};

/**
 * Gets responsive image gutter classes that adapt to screen size
 * @param aspectType - The aspect type of the image
 * @returns The responsive Tailwind CSS classes
 */
export const getResponsiveImageGutterClass = (aspectType: ImageAspectType): string => {
  switch (aspectType) {
    case 'portrait':
      return 'mr-2 md:mr-3'; // Very tight on mobile, tight on desktop
    case 'square':
      return 'mr-3 md:mr-4'; // Tight on mobile, medium on desktop
    case 'landscape':
      return 'mr-4 md:mr-6'; // Medium on mobile, wide on desktop
    default:
      return 'mr-3 md:mr-4'; // Default fallback
  }
};