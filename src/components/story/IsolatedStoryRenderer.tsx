import React from 'react';
import { createSafeHtml } from "@/utils/xssProtection";
import { wrapParagraphs } from "@/utils/textUtils";
import { processIconTokens } from "@/utils/iconTokens";
import { stripLegacyTokens } from "@/utils/legacyTokenStripper";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface IsolatedStoryRendererProps {
  content?: string;
  excerpt?: string;
  useRichCleaning?: boolean;
  className?: string;
  category?: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText" | "STORY";
  fontSize?: number;
  onFontSizeChange?: (fontSize: number) => void;
  showHeaderPreview?: boolean; // Keep for compatibility but unused
  enableProportionalSizing?: boolean;
  colorPresetId?: string;
}

/**
 * Completely isolated story content renderer that uses its own styling
 * to ensure identical formatting across admin and public views
 */
const IsolatedStoryRenderer: React.FC<IsolatedStoryRendererProps> = ({ 
  content, 
  excerpt, 
  useRichCleaning = false,
  className = "",
  category,
  fontSize = 16,
  onFontSizeChange,
  showHeaderPreview = true, // Keep for compatibility but ignore
  enableProportionalSizing = false,
  colorPresetId
}) => {
  // Fetch color preset if provided
  const { data: colorPreset } = useQuery({
    queryKey: ['color-preset', colorPresetId],
    queryFn: async () => {
      if (!colorPresetId) return null;
      const { data, error } = await supabase
        .from('color_presets')
        .select('background_color_hex, box_border_color_hex, font_color_hex, photo_border_color_hex')
        .eq('id', colorPresetId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching color preset:', error);
        return null;
      }
      return data;
    },
    enabled: !!colorPresetId
  });

  const isWebText = category === "WebText";
  const baseFontFamily = isWebText 
    ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" 
    : "Georgia, serif";

  // Apply color preset if available, otherwise transparent/inherit
  const backgroundColor = colorPreset?.background_color_hex || 'transparent';
  const borderColor = colorPreset?.box_border_color_hex || 'transparent';
  const textColor = colorPreset?.font_color_hex || 'inherit';

  if (content) {
    // Strip legacy tokens from content for clean display
    let processedContent = stripLegacyTokens(content);
    
    // Preprocess content to handle quote-wrapped strings
    if (typeof processedContent === 'string' && processedContent.startsWith('"') && processedContent.endsWith('"')) {
      try {
        // Remove the wrapping quotes and unescape the content
        processedContent = JSON.parse(processedContent);
      } catch (e) {
        // If parsing fails, use the content as-is
      }
    }
    
    // Process icon tokens before other processing
    processedContent = processIconTokens(processedContent);
    
    // Wrap plain text in paragraphs if needed
    processedContent = wrapParagraphs(processedContent);
    
    // Convert inline px/pt font sizes to em if proportional sizing is enabled
    if (enableProportionalSizing && typeof processedContent === 'string') {
      const baseFontSize = 16; // Base font size in pixels
      processedContent = processedContent.replace(
        /font-size:\s*(\d+(?:\.\d+)?)(px|pt)/gi,
        (match, size, unit) => {
          const sizeInPx = unit === 'pt' ? parseFloat(size) * 1.333 : parseFloat(size);
          const emSize = sizeInPx / baseFontSize;
          return `font-size: ${emSize.toFixed(3)}em`;
        }
      );
    }
    
    const safeHtml = createSafeHtml(processedContent);
    
    return (
      <>
        <div 
          className={`rendered-story-content ${className}`}
          style={{
            // Targeted resets that preserve HTML element defaults
            margin: 0,
            padding: colorPreset ? '16px' : 0,
            border: colorPreset ? `3px solid ${borderColor}` : 0,
            boxSizing: 'border-box',
            display: 'block',
            backgroundColor: backgroundColor,
            borderRadius: colorPreset ? '8px' : 0,
            // Remove fontFamily from container to allow inline styles to work
            fontSize: `${fontSize}px`,
            color: textColor,
            lineHeight: '1.5',
          }}
          dangerouslySetInnerHTML={safeHtml}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Inline icon styling for {{ICON}} tokens */
            .inline-icon-55 {
              width: 55px;
              height: 55px;
              display: inline-block;
              margin: 0 4px;
              object-fit: contain;
              vertical-align: middle;
            }
            
            /* Preserve inline font-family styles - no overrides */
            span[style*="font-family"] {
              /* Let inline styles work naturally */
            }
            div[style*="font-family"]:not(.no-text-styles) strong,
            div[style*="font-family"]:not(.no-text-styles) b,
            div[style*="font-family"]:not(.no-text-styles) span[style*="font-weight: bold"],
            div[style*="font-family"]:not(.no-text-styles) span[style*="font-weight:bold"] {
              font-weight: bold !important;
            }
            div[style*="font-family"]:not(.no-text-styles) em,
            div[style*="font-family"]:not(.no-text-styles) i,
            div[style*="font-family"]:not(.no-text-styles) span[style*="font-style: italic"],
            div[style*="font-family"]:not(.no-text-styles) span[style*="font-style:italic"] {
              font-style: italic !important;
            }
            div[style*="font-family"]:not(.no-text-styles) u,
            div[style*="font-family"]:not(.no-text-styles) span[style*="text-decoration: underline"],
            div[style*="font-family"]:not(.no-text-styles) span[style*="text-decoration:underline"] {
              text-decoration: underline !important;
            }
            /* Default font family for content without inline styles */
            div:not([style*="font-family"]) {
              font-family: ${isWebText ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" : "Georgia, serif"} !important;
            }
          `
        }} />
      </>
    );
  }

  if (excerpt) {
    return (
      <div 
        className={className}
        style={{
          // Targeted resets that preserve HTML element defaults
          margin: 0,
          padding: 0,
          border: 0,
          boxSizing: 'border-box',
          display: 'block',
          fontFamily: baseFontFamily,
          fontSize: `${fontSize}px`,
          color: '#000000',
          lineHeight: '1.5',
        }}
      >
        {excerpt}
      </div>
    );
  }

  return null;
};

export default IsolatedStoryRenderer;