import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStoryCodeLookup } from "@/hooks/useStoryCodeLookup";
import { getWebtextTheme } from "@/utils/webtextTheme";
import { getAssetVersionFromStory, buildCacheBustedUrl } from "@/utils/storyUtils";
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";
import { AudioButton } from "@/components/AudioButton";
import { SuperAV } from "@/components/SuperAV";
import { useCachedIcon } from "@/hooks/useCachedIcon";

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

  if (loading) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 relative">
        <div className="text-18-system">Loading...</div>
        {/* Code indicator */}
        <div className="code-indicator">{code}</div>
      </div>
    );
  }

  if (!webtextData) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 relative">
        <div className="text-18-system">Coming Soon</div>
        {/* Code indicator */}
        <div className="code-indicator">{code}</div>
      </div>
    );
  }

  const theme = getWebtextTheme(webtextData);
  
  // Determine if we have an icon code that needs resolution
  const isIconCode = theme.image && !theme.image.startsWith('http') && !theme.image.startsWith('/');
  const { iconUrl } = useCachedIcon(isIconCode ? theme.image : null);
  
  // Calculate the final image URL
  const finalImageUrl = useMemo(() => {
    if (!theme.image) return null;
    
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
  }, [theme.image, isIconCode, iconUrl, webtextData]);

  return (
    <div
      className="rounded-lg p-6 mb-4 relative border-4"
      style={{
        backgroundColor: theme.colors.backgroundTint,
        borderColor: theme.colors.lighterBorder,
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
              className="w-24 h-24 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl border-2"
              style={{
                backgroundColor: theme.colors.photoMatColor,
                borderColor: theme.colors.primary,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
              onClick={() => navigate('/guide')}
              title="Click to visit the Guide page"
            >
              <img
                src={finalImageUrl}
                alt={webtextData.title || "Webtext illustration"}
                className="w-full h-full object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
          </div>
        )}

        {/* Right Side - Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {(title || webtextData.title) && (
            <h2 
              className="font-bold mb-1 text-20-system"
              style={{ color: theme.colors.primary }}
            >
              {title || webtextData.title}
            </h2>
          )}

          {/* Content */}
          <div className="text-18-system syswel-box-content">
            <IsolatedStoryRenderer 
              content={webtextData.content}
              category="WebText"
              fontSize={18}
              showHeaderPreview={false}
            />
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
              .syswel-box-content .rendered-story-content > *:first-child {
                margin-top: 0.125rem !important;
              }
            `
          }} />
        </div>
      </div>

      {/* Bottom Right Badge */}
      <div 
        className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium text-white shadow-sm"
        style={{ backgroundColor: theme.colors.badgeColor }}
      >
        WebText
      </div>

      {/* Code Indicator */}
      <div className="code-indicator">{code}</div>

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