import React, { useState, useEffect, useMemo } from "react";
import { useStoryCodeLookup } from "@/hooks/useStoryCodeLookup";
import { getWebtextTheme } from "@/utils/webtextTheme";
import { getAssetVersionFromStory, buildCacheBustedUrl } from "@/utils/storyUtils";
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";
import { AudioButton } from "@/components/AudioButton";
import { SuperAV } from "@/components/SuperAV";
import { useCachedIcon } from "@/hooks/useCachedIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FontScaleStep, DEFAULT_FONT_SCALE, pixelSizeToScale } from "@/utils/fontScaleUtils";

interface BaseWebTextBoxTheme {
  primaryColor: string;
  borderColor: string;
  backgroundColor: string;
  photoMatColor: string;
  photoBorderColor?: string;
}

interface BaseWebTextBoxProps {
  code: string;
  title?: string;
  id?: string;
  theme: BaseWebTextBoxTheme;
  cssClassPrefix: string; // e.g., "syswel", "syswe2"
}

const BaseWebTextBox: React.FC<BaseWebTextBoxProps> = ({ 
  code, 
  title,
  id,
  theme,
  cssClassPrefix
}) => {
  const [webtextData, setWebtextData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSuperAV, setShowSuperAV] = useState(false);
  const [fontScale, setFontScale] = useState<FontScaleStep>(DEFAULT_FONT_SCALE);
  const [showTooltip, setShowTooltip] = useState(false);
  const { lookupStoryByCode } = useStoryCodeLookup();
  
  // Convert font scale to pixel size for IsolatedStoryRenderer
  const getFontSizeFromScale = (scale: FontScaleStep): number => {
    const scaleMap = {
      'xs': 12,
      'sm': 14, 
      'base': 16,
      'lg': 18,
      'xl': 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36
    };
    return scaleMap[scale] || 16;
  };
  
  const currentFontSize = getFontSizeFromScale(fontScale);

  useEffect(() => {
    const fetchWebtext = async () => {
      setLoading(true);
      try {
        const result = await lookupStoryByCode(code, true);
        if (result.found && result.story) {
          setWebtextData(result.story);
        }
      } catch (error) {
        console.error('Error fetching webtext:', error);
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchWebtext();
    }
  }, [code, lookupStoryByCode]);

  // Prepare theme and image resolution hooks unconditionally to preserve hook order
  const webtextTheme = useMemo(() => (webtextData ? getWebtextTheme(webtextData) : null), [webtextData]);
  const isIconCode = !!(webtextTheme?.image && !webtextTheme.image.startsWith('http') && !webtextTheme.image.startsWith('/'));
  const { iconUrl } = useCachedIcon(isIconCode ? webtextTheme!.image : null);
  
  // Calculate the final image URL
  const finalImageUrl = useMemo(() => {
    if (!webtextTheme?.image) return null;
    
    // If it's an icon code, use the resolved URL from cache
    if (isIconCode && iconUrl) {
      return iconUrl;
    }
    
    // If it's already a full URL, use with cache busting
    if (webtextTheme.image.startsWith('http') || webtextTheme.image.startsWith('/')) {
      const version = getAssetVersionFromStory(webtextData);
      return buildCacheBustedUrl(webtextTheme.image, version);
    }
    
    return null;
  }, [webtextTheme?.image, isIconCode, iconUrl, webtextData]);

  if (loading) {
    return (
      <div 
        className="rounded-lg border p-4 mb-4 relative"
        style={{
          backgroundColor: theme.backgroundColor,
          borderColor: theme.borderColor
        }}
      >
        <div className="text-18-system" style={{ color: theme.primaryColor }}>Loading...</div>
        {/* Code Display in Bottom Right */}
        <div 
          className="absolute bottom-2 right-2 text-xs font-mono"
          style={{ color: theme.primaryColor }}
        >
          {code}
        </div>
      </div>
    );
  }

  if (!webtextData) {
    return null;
  }

  return (
    <div
      className="rounded-lg p-6 mb-4 relative border-4"
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: theme.borderColor,
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}
      id={id}
    >
      {/* Audio Button - Top Right */}
      <div className="absolute top-2 right-2 z-0">
        <AudioButton 
          code={code}
          onClick={() => setShowSuperAV(true)}
        />
      </div>

      {/* Main Content Area - Using flow-root to contain floated image */}
      <div className="flow-root">
        {/* Image - Floated Left */}
        {finalImageUrl && (
          <div className="float-left mr-4 mb-2">
            <TooltipProvider>
              <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
                <TooltipTrigger asChild>
                  <div
                    className="rounded-lg overflow-hidden shadow-lg"
                    style={{
                      backgroundColor: theme.photoMatColor,
                      border: `3px solid ${theme.photoBorderColor || theme.borderColor}`
                    }}
                    onClick={() => setShowTooltip(!showTooltip)}
                  >
                    <img
                      src={finalImageUrl}
                      alt={webtextData.title || "Webtext illustration"}
                      className="w-auto h-auto max-h-48 md:max-h-64 lg:max-h-80 object-contain"
                      style={{
                        imageRendering: 'crisp-edges'
                      }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  className="max-w-none bg-white border border-gray-300 shadow-lg text-black"
                  style={{ 
                    fontSize: '24px',
                    maxWidth: 'min(400px, 90vw)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.4'
                  }}
                >
                  {webtextData.photo_alt_1 || webtextData.title || "Click to learn more"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Title - Flows around the floated image */}
        {(title || webtextData.title) && (
          <h2 
            className={`font-handwritten font-bold leading-tight break-words text-left m-0 p-0 ${cssClassPrefix}-title`}
            style={{ fontSize: `${Math.floor(currentFontSize * 2.25)}px` }}
          >
            {title || webtextData.title}
          </h2>
        )}

        {/* Content - Flows around the floated image */}
        <div className={`text-18-system ${cssClassPrefix}-box-content`}>
          <IsolatedStoryRenderer 
            content={webtextData.content}
            category="WebText"
            fontSize={currentFontSize}
            showHeaderPreview={false}
            enableProportionalSizing={true}
          />
        </div>
      </div>

      {/* Code Display in Bottom Right */}
      <div className={`absolute bottom-2 right-2 text-xs font-mono ${cssClassPrefix}-code-display`}>
        {code}
      </div>

      {/* CSS Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .${cssClassPrefix}-title {
            color: ${theme.primaryColor};
          }
          .${cssClassPrefix}-box-content.text-18-system {
            color: ${theme.primaryColor} !important;
            font-size: ${currentFontSize}px !important;
            font-style: normal !important;
          }
          .${cssClassPrefix}-box-content .rendered-story-content > *:first-child {
            margin-top: 0.125rem !important;
          }
          .${cssClassPrefix}-box-content .rendered-story-content h1:first-child,
          .${cssClassPrefix}-box-content .rendered-story-content h2:first-child,
          .${cssClassPrefix}-box-content .rendered-story-content h3:first-child {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          .${cssClassPrefix}-box-content .rendered-story-content,
          .${cssClassPrefix}-box-content .rendered-story-content *,
          .${cssClassPrefix}-box-content .rendered-story-content p,
          .${cssClassPrefix}-box-content .rendered-story-content div,
          .${cssClassPrefix}-box-content .rendered-story-content span,
          .${cssClassPrefix}-box-content .rendered-story-content h1,
          .${cssClassPrefix}-box-content .rendered-story-content h2,
          .${cssClassPrefix}-box-content .rendered-story-content h3,
          .${cssClassPrefix}-box-content .rendered-story-content h4,
          .${cssClassPrefix}-box-content .rendered-story-content h5,
          .${cssClassPrefix}-box-content .rendered-story-content h6,
          .${cssClassPrefix}-box-content .rendered-story-content li,
          .${cssClassPrefix}-box-content .rendered-story-content strong,
          .${cssClassPrefix}-box-content .rendered-story-content em,
          .${cssClassPrefix}-box-content .rendered-story-content b,
          .${cssClassPrefix}-box-content .rendered-story-content i,
          .${cssClassPrefix}-box-content .rendered-story-content a {
            color: ${theme.primaryColor} !important;
            ${cssClassPrefix === 'syswe2' ? 'font-weight: bold !important;' : ''}
          }
          .${cssClassPrefix}-code-display {
            color: ${theme.primaryColor};
          }
        `
      }} />

      {/* SuperAV Popup */}
      <SuperAV
        isOpen={showSuperAV}
        onClose={() => setShowSuperAV(false)}
        title={webtextData?.title || title}
        author={webtextData?.author}
        voiceName={webtextData?.ai_voice_name}
        showAuthor={false}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
        audioUrl={webtextData?.audio_url ? buildCacheBustedUrl(webtextData.audio_url, getAssetVersionFromStory(webtextData)) : undefined}
      />
    </div>
  );
};

export default BaseWebTextBox;