import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStoryCodeLookup } from "@/hooks/useStoryCodeLookup";
import { getWebtextTheme } from "@/utils/webtextTheme";
import { getAssetVersionFromStory, buildCacheBustedUrl } from "@/utils/storyUtils";
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";
import { AudioButton } from "@/components/AudioButton";
import { SuperAV } from "@/components/SuperAV";
import { useCachedIcon } from "@/hooks/useCachedIcon";
import { extractHeaderTokens, createSafeHeaderHtml } from "@/utils/headerTokens";

interface SysWelWebTextBoxProps {
  code: string;
  title?: string;
  id?: string;
}

const SysWelWebTextBox: React.FC<SysWelWebTextBoxProps> = ({ 
  code, 
  title,
  id 
}) => {
  const [webtextData, setWebtextData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSuperAV, setShowSuperAV] = useState(false);
  const { lookupStoryByCode } = useStoryCodeLookup();
  const navigate = useNavigate();

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
  const theme = useMemo(() => (webtextData ? getWebtextTheme(webtextData) : null), [webtextData]);
  const isIconCode = !!(theme?.image && !theme.image.startsWith('http') && !theme.image.startsWith('/'));
  const { iconUrl } = useCachedIcon(isIconCode ? theme!.image : null);
  
  // Extract header tokens from content
  const extractedData = useMemo(() => {
    if (!webtextData?.content) return { tokens: {}, contentWithoutTokens: '' };
    return extractHeaderTokens(webtextData.content);
  }, [webtextData?.content]);
  
  const { tokens: headerTokens, contentWithoutTokens: remainingContent } = extractedData;
  
  // Calculate the final image URL
  const finalImageUrl = useMemo(() => {
    if (!theme?.image) return null;
    
    // If it's an icon code, use the resolved URL from cache
    if (isIconCode && iconUrl) {
      return iconUrl;
    }
    
    // If it's already a full URL, use with cache busting
    if (theme.image.startsWith('http') || theme.image.startsWith('/')) {
      const version = getAssetVersionFromStory(webtextData);
      return buildCacheBustedUrl(theme.image, version);
    }
    
    return null;
  }, [theme?.image, isIconCode, iconUrl, webtextData]);

  if (loading) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 relative">
        <div className="text-18-system">Loading...</div>
        {/* Code Display in Bottom Right */}
        <div className="absolute bottom-2 right-2 text-xs font-mono text-amber-700">
          {code}
        </div>
      </div>
    );
  }

  if (!webtextData) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 relative">
        <div className="text-18-system">Coming Soon</div>
        {/* Code Display in Bottom Right */}
        <div className="absolute bottom-2 right-2 text-xs font-mono text-amber-700">
          {code}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-6 mb-4 relative border-4"
      style={{
        backgroundColor: theme!.colors.backgroundTint,
        borderColor: theme!.colors.lighterBorder,
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}
      id={id}
    >
      {/* Audio Button - Top Right */}
      <div className="absolute top-2 right-2 z-10">
        <AudioButton 
          code={code}
          onClick={() => setShowSuperAV(true)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex gap-4">
        {/* Left Side - Image */}
        {finalImageUrl && (
          <div className="flex-shrink-0">
            <div
              className="rounded-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl border-4"
              style={{
                backgroundColor: theme!.colors.photoMatColor,
                borderColor: theme!.colors.primary,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
              onClick={() => navigate('/guide')}
              title="Click to visit the Guide page"
            >
              <img
                src={finalImageUrl}
                alt={webtextData.title || "Webtext illustration"}
                className="w-auto h-auto max-h-48 md:max-h-64 lg:max-h-80 object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
          </div>
        )}

        {/* Right Side - Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {(headerTokens.titleHtml || title || webtextData.title) && (
            <h2 
              className="font-handwritten font-bold leading-tight break-words text-left m-0 p-0"
              style={{ color: theme!.colors.primary }}
            >
              {headerTokens.titleHtml ? (
                <span dangerouslySetInnerHTML={createSafeHeaderHtml(headerTokens.titleHtml)} />
              ) : (
                title || webtextData.title
              )}
            </h2>
          )}

          {/* Content */}
          <div className="text-18-system syswel-box-content">
            <IsolatedStoryRenderer 
              content={remainingContent || webtextData.content}
              category="WebText"
              fontSize={24}
              showHeaderPreview={false}
            />
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
              .syswel-box-content .rendered-story-content > *:first-child {
                margin-top: 0.125rem !important;
              }
              .syswel-box-content .rendered-story-content h1:first-child,
              .syswel-box-content .rendered-story-content h2:first-child,
              .syswel-box-content .rendered-story-content h3:first-child {
                margin-top: 0 !important;
                padding-top: 0 !important;
              }
            `
          }} />
        </div>
      </div>


      {/* Code Display in Bottom Right */}
      <div 
        className="absolute bottom-2 right-2 text-xs font-mono"
        style={{ color: theme!.colors.primary }}
      >
        {code}
      </div>

      {/* SuperAV Popup */}
      <SuperAV
        isOpen={showSuperAV}
        onClose={() => setShowSuperAV(false)}
        title={webtextData?.title || title}
        author={webtextData?.author}
        voiceName={webtextData?.ai_voice_name}
        showAuthor={false}
        audioUrl={webtextData?.audio_url ? buildCacheBustedUrl(webtextData.audio_url, getAssetVersionFromStory(webtextData)) : undefined}
      />
    </div>
  );
};

export default SysWelWebTextBox;