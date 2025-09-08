import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStoryCodeLookup } from "@/hooks/useStoryCodeLookup";
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";
import { extractHeaderTokens, createSafeHeaderHtml } from "@/utils/headerTokens";
import { getWebtextTheme } from "@/utils/webtextTheme";
import { AudioButton } from "@/components/AudioButton";
import { SuperAV } from "@/components/SuperAV";

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
  const { lookupStoryByCode } = useStoryCodeLookup();
  const navigate = useNavigate();

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

  const headerTokens = useMemo(() => {
    if (!webtextData?.content) return { tokens: {}, contentWithoutTokens: "" };
    return extractHeaderTokens(webtextData.content);
  }, [webtextData?.content]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!webtextData) {
    return (
      <div 
        className="relative p-6 rounded-lg shadow-lg mb-6 text-center"
        style={{
          backgroundColor: orangeTheme.backgroundColor,
          border: `2px solid ${orangeTheme.borderColor}`,
          color: orangeTheme.primaryColor
        }}
        id={id}
      >
        <h2 className="text-xl font-bold mb-4">Coming Soon</h2>
        <p>This content is being prepared for you!</p>
        <div className="absolute bottom-2 right-2 text-xs opacity-70">
          {code}
        </div>
      </div>
    );
  }

  const handleImageClick = () => {
    navigate('/guide');
  };

  return (
    <div 
      className="relative p-6 rounded-lg shadow-lg mb-6"
      style={{
        backgroundColor: orangeTheme.backgroundColor,
        border: `2px solid ${orangeTheme.borderColor}`
      }}
      id={id}
    >
      {/* Audio Button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
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
            <div
              className="rounded-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl"
              style={{
                backgroundColor: orangeTheme.photoMatColor,
                padding: '4px'
              }}
              onClick={handleImageClick}
              title={webtextData.title || "Click to learn more"}
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
          </div>
        )}

        {/* Content - Flows around the floated image */}
        <div>
          {/* Title */}
          {(headerTokens.tokens?.titleHtml || title || webtextData.title) && (
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: orangeTheme.primaryColor }}
            >
              {headerTokens.tokens?.titleHtml ? (
                <span dangerouslySetInnerHTML={createSafeHeaderHtml(headerTokens.tokens.titleHtml)} />
              ) : (
                title || webtextData.title
              )}
            </h2>
          )}

          {/* Story Content */}
          <div style={{ color: orangeTheme.primaryColor }}>
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
      <div className="absolute bottom-2 right-2 text-xs opacity-70" style={{ color: orangeTheme.primaryColor }}>
        {code}
      </div>

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