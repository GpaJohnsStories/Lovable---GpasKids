import React, { useState } from "react";
import { useStoryCodeLookup } from "@/hooks/useStoryCodeLookup";
import { useCachedIcon } from "@/hooks/useCachedIcon";
import { AudioButton } from "@/components/AudioButton";
import { StoryContentRenderer } from "@/components/story-content/StoryContentRenderer";
import { getSuperWebTheme } from "@/utils/superWebTheme";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SuperAV } from "@/components/SuperAV";

/* ===== SUPER-WEB-BOX TEMPLATE START ===== */
interface SuperWebBoxProps {
  code: string;
  color: string; // Hex color code (e.g., "#FF6B35")
  title?: string;
  id?: string;
}

const SuperWebBox: React.FC<SuperWebBoxProps> = ({ 
  code, 
  color,
  title,
  id 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSuperAVOpen, setIsSuperAVOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const { lookupStoryByCode } = useStoryCodeLookup();
  
  const { data: story, isLoading, error } = useQuery({
    queryKey: ['story', code],
    queryFn: async () => {
      const result = await lookupStoryByCode(code, true);
      return result.story;
    },
    enabled: !!code,
  });

  const theme = getSuperWebTheme(story, color);
  const { iconUrl, iconName } = useCachedIcon(theme.image);

  if (isLoading) {
    return (
      <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4 animate-pulse">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
        <p className="text-red-600 font-semibold">Error loading content for code: {code}</p>
      </div>
    );
  }

  const displayTitle = title || story.title || "Untitled Story";
  const hasTagline = !!story.tagline;
  const hasAuthor = !!story.author;

  return (
    <div 
      id={id}
      className="super-web-box rounded-lg overflow-hidden mb-6"
      style={{
        border: `4px solid ${color}`,
        backgroundColor: theme.backgroundTint
      }}
    >
      {/* Header Section */}
      <div className="super-web-header p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Title - Required, 30px, bold */}
            <h2 
              className="super-web-title font-bold leading-tight mb-2"
              style={{
                color: color,
                fontSize: '30px'
              }}
            >
              {displayTitle}
            </h2>
            
            {/* Tagline - Optional, 24px */}
            {hasTagline && (
              <h3 
                className="super-web-tagline leading-tight mb-2"
                style={{
                  color: color,
                  fontSize: '24px'
                }}
              >
                {story.tagline}
              </h3>
            )}
            
            {/* Author - Optional, 24px, bold */}
            {hasAuthor && (
              <p 
                className="super-web-author font-bold mb-3"
                style={{
                  color: color,
                  fontSize: '24px'
                }}
              >
                by {story.author}
              </p>
            )}
          </div>
          
          {/* Audio Button in top right */}
          {story.story_code && (
            <div className="flex-shrink-0 ml-4">
              <AudioButton 
                code={story.story_code}
                onClick={() => {
                  console.log('Super-Web-Box audio clicked for:', story.story_code);
                  setIsSuperAVOpen(true);
                }}
                className="super-web-audio-btn"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="super-web-content p-4 pt-2">
        <div className="flex gap-4">
          {/* Image Section */}
          {iconUrl && (
            <div className="flex-shrink-0">
              <TooltipProvider>
                <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
                  <TooltipTrigger asChild>
                    <div 
                      className="rounded overflow-hidden"
                      style={{ border: `3px solid ${color}` }}
                      onClick={() => setShowTooltip(!showTooltip)}
                    >
                      <img
                        src={iconUrl}
                        alt={iconName || displayTitle}
                        className="w-24 h-24 object-cover"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="max-w-none bg-white border border-gray-300 shadow-lg text-black"
                    style={{ 
                      fontSize: '24px',
                      maxWidth: 'min(200px, 90vw)',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.4'
                    }}
                  >
                    {iconName || displayTitle}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {/* Text Content */}
          <div className="flex-1">
            <div className="super-web-text-content">
              {story.content && (
                <StoryContentRenderer 
                  content={story.content}
                  className="rendered-story-content"
                  fontSize={fontSize}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SuperAV Floating Popup */}
      <SuperAV
        isOpen={isSuperAVOpen}
        onClose={() => setIsSuperAVOpen(false)}
        title={displayTitle}
        author={story.author || undefined}
        voiceName={story.ai_voice_name || undefined}
        showAuthor={false}
        audioUrl={story.audio_url || undefined}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      {/* CSS Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .super-web-box {
          font-family: inherit;
        }
        
        /* Text Content Styling - All text 24px bold with theme color */
        .super-web-text-content,
        .super-web-text-content *,
        .super-web-text-content .rendered-story-content,
        .super-web-text-content .rendered-story-content *,
        .super-web-text-content .rendered-story-content p,
        .super-web-text-content .rendered-story-content div,
        .super-web-text-content .rendered-story-content span,
        .super-web-text-content .rendered-story-content h1,
        .super-web-text-content .rendered-story-content h2,
        .super-web-text-content .rendered-story-content h3,
        .super-web-text-content .rendered-story-content h4,
        .super-web-text-content .rendered-story-content h5,
        .super-web-text-content .rendered-story-content h6,
        .super-web-text-content .rendered-story-content li,
        .super-web-text-content .rendered-story-content ul,
        .super-web-text-content .rendered-story-content ol,
        .super-web-text-content .rendered-story-content strong,
        .super-web-text-content .rendered-story-content em,
        .super-web-text-content .rendered-story-content b,
        .super-web-text-content .rendered-story-content i,
        .super-web-text-content .rendered-story-content a {
          color: ${color};
          font-size: ${fontSize}px;
          font-weight: bold;
          line-height: 1.4;
        }
        
        /* Override for bold elements */
        .super-web-text-content .rendered-story-content strong,
        .super-web-text-content .rendered-story-content b {
          font-weight: bold !important;
        }
        
        /* Override for italic elements */
        .super-web-text-content .rendered-story-content em,
        .super-web-text-content .rendered-story-content i {
          font-style: italic !important;
        }
        
        /* Audio button styling */
        .super-web-audio-btn {
          color: ${color};
          background: transparent;
        }
        
        .super-web-audio-btn:hover {
          background: transparent;
          color: inherit;
        }
      `}} />
    </div>
  );
};

export default SuperWebBox;
/* ===== SUPER-WEB-BOX TEMPLATE END ===== */