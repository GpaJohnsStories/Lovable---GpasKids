import React, { useState, useEffect, useMemo } from "react";
import { useStoryCodeLookup } from "@/hooks/useStoryCodeLookup";
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";

import { getWebtextTheme } from "@/utils/webtextTheme";
import { AudioButton } from "@/components/AudioButton";
import { SuperAV } from "@/components/SuperAV";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SysWe2WebTextBoxProps {
  code: string;
  title?: string;
  id?: string;
}

const SysWe2WebTextBox: React.FC<SysWe2WebTextBoxProps> = ({ code, title, id }) => {
  const [webtextData, setWebtextData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSuperAV, setShowSuperAV] = useState(false);
  const [contentFontSize, setContentFontSize] = useState(24);
  const [showTooltip, setShowTooltip] = useState(false);
  const { lookupStoryByCode } = useStoryCodeLookup();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await lookupStoryByCode(code, true);
      
      if (result.found && result.story) {
        setWebtextData(result.story);
      } else {
        setWebtextData(null);
      }
      setLoading(false);
    };

    if (code) {
      fetchData();
    }
  }, [code, lookupStoryByCode]);

  // Orange theme colors
  const orangeTheme = useMemo(() => ({
    primaryColor: "#F97316",
    borderColor: "#D2691E", 
    backgroundColor: "#F9731633",
    photoMatColor: "#F9731633"
  }), []);

  const finalImageUrl = useMemo(() => {
    if (!webtextData?.photo_link_1) return null;
    
    const baseUrl = webtextData.photo_link_1;
    const cacheBuster = `?v=${Date.now()}`;
    return `${baseUrl}${cacheBuster}`;
  }, [webtextData?.photo_link_1]);


  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!webtextData) {
    return null;
  }

  return (
    <div 
      className="relative p-6 rounded-lg shadow-lg mb-6"
      style={{
        backgroundColor: orangeTheme.backgroundColor,
        border: `4px solid ${orangeTheme.borderColor}`
      }}
      id={id}
    >
      {/* Audio Button - Top Right */}
      <div className="absolute top-4 right-4 z-0">
        <AudioButton 
          code={code}
          onClick={() => setShowSuperAV(true)}
          className="bg-white/90 hover:bg-white border border-orange-300 text-orange-600 hover:text-orange-700"
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
                      backgroundColor: orangeTheme.photoMatColor,
                      border: `3px solid ${orangeTheme.borderColor}`
                    }}
                    onClick={() => setShowTooltip(!showTooltip)}
                  >
                    <img
                      src={finalImageUrl}
                      alt={webtextData.photo_alt_1 || webtextData.title || "Story image"}
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

        {/* Content - Flows around the floated image */}
        <div>
          {/* Title */}
          {(title || webtextData.title) && (
            <h2 
              className="text-3xl font-bold mb-4 syswe2-title"
            >
              {title || webtextData.title}
            </h2>
          )}

          {/* Story Content */}
          <div className="syswe2-content">
            <IsolatedStoryRenderer
              content={webtextData.content}
              useRichCleaning={true}
              fontSize={contentFontSize}
              onFontSizeChange={setContentFontSize}
              category="WebText"
              enableProportionalSizing={true}
            />
          </div>
        </div>
      </div>

      {/* Code Display - Bottom Right */}
      <div className="absolute bottom-2 right-2 text-xs opacity-70 syswe2-code">
        {code}
      </div>

      {/* CSS Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .syswe2-title {
            color: ${orangeTheme.primaryColor};
          }
          .syswe2-content {
            color: ${orangeTheme.primaryColor};
          }
          .syswe2-code {
            color: ${orangeTheme.primaryColor};
          }
        `
      }} />

      {/* SuperAV Modal */}
      {showSuperAV && (
        <SuperAV
          isOpen={showSuperAV}
          onClose={() => setShowSuperAV(false)}
          title={webtextData.title}
          author={webtextData.author}
          voiceName={webtextData.voice_character || 'buddy'}
          onFontSizeChange={setContentFontSize}
          fontSize={contentFontSize}
        />
      )}
    </div>
  );
};

export default SysWe2WebTextBox;