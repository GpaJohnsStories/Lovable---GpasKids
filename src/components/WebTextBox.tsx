import React, { useState, useEffect } from 'react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { getStoryPhotos } from '@/utils/storyUtils';
import { AudioButton } from '@/components/AudioButton';
import { SuperAV } from '@/components/SuperAV';
import { ArrowRight } from 'lucide-react';
import { extractHeaderTokens, createSafeHeaderHtml } from '@/utils/headerTokens';
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";

interface WebTextBoxProps {
  webtextCode: string;
  borderColor: string;
  backgroundColor: string;
  title: string;
  id?: string;
  showReturn?: boolean;
  onReturnClick?: () => void;
}

export const WebTextBox: React.FC<WebTextBoxProps> = ({
  webtextCode,
  borderColor,
  backgroundColor,
  title,
  id,
  showReturn = false,
  onReturnClick
}) => {
  const { lookupStoryByCode } = useStoryCodeLookup();
  const [webtext, setWebtext] = useState<any>(null);
  const [iconUrl, setIconUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  
  // Audio controls state for peppermint button
  const [showSuperAV, setShowSuperAV] = useState(false);

  const getContent = () => {
    if (loading) return "Loading...";
    if (!webtext) return "Coming Soon";
    return webtext.content || webtext.excerpt || "No content available";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch webtext content
      const webtextData = await lookupStoryByCode(webtextCode, true);
      setWebtext(webtextData.story);
      
      // Set icon URL from the webtext story photos
      if (webtextData.story) {
        const photos = getStoryPhotos(webtextData.story);
        if (photos.length > 0 && photos[0].url) {
          setIconUrl(photos[0].url);
        } else {
          setIconUrl(''); // Explicitly set to empty if no photos
        }
      } else {
        setIconUrl(''); // Explicitly set to empty if no webtext data
      }
      
      setLoading(false);
    };

    fetchData();
  }, [webtextCode, lookupStoryByCode]);

  const isSysWel = webtextCode === "SYS-WEL";
  const photos = webtext ? getStoryPhotos(webtext) : [];
  const mainPhoto = photos[0];

  // Special styling for SYS-WEL content
  if (isSysWel) {
    return (
      <>
        <div id={id} className="bg-blue-100 border-4 border-blue-500 rounded-lg p-4 sm:p-6 mb-8 overflow-hidden relative">
          {/* Peppermint Audio Button - Always visible in top right corner */}
          <div className="absolute top-1 right-1 z-[5] flex items-center gap-2">
            <div className="text-base sm:text-lg font-handwritten font-bold text-green-800">
              Click to listen or change word size
            </div>
            <ArrowRight className="text-green-800" size={20} strokeWidth={3} />
            <AudioButton code="SYS-WEL" onClick={() => setShowSuperAV(true)} />
          </div>

          {/* Top section with photo and title */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Photo in left column on tablets+ */}
            {mainPhoto && (
              <div className="w-fit flex-shrink-0">
                <div className="group relative">
                  <img
                    src={mainPhoto.url}
                    alt={mainPhoto.alt}
                    className="w-auto h-auto max-h-48 md:max-h-64 lg:max-h-80 object-contain rounded-lg border-2 border-blue-500 shadow-lg cursor-pointer transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontSize: '21px', fontFamily: 'Arial, sans-serif', lineHeight: '1.25' }}>
                    {mainPhoto.alt}
                  </div>
                </div>
              </div>
            )}

            {/* Title and content section */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Title section */}
              <div className="mb-4">
                <div className="flex items-start gap-3 justify-start">
                  {(() => {
                    const content = getContent();
                    const { tokens } = extractHeaderTokens(content);
                    const titleHtml = tokens.titleHtml;
                    
                    if (titleHtml) {
                      return (
                        <h1 
                          className="text-2xl sm:text-3xl lg:text-4xl font-handwritten font-bold text-blue-800 leading-tight break-words text-left"
                          dangerouslySetInnerHTML={createSafeHeaderHtml(titleHtml)}
                        />
                      );
                    } else {
                      return (
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-handwritten font-bold text-blue-800 leading-tight break-words text-left">
                          {webtext?.title || "Welcome to Grandpa John's Story Corner!"}
                        </h1>
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Content below title */}
              <div className="flex-1 min-w-0">
                <IsolatedStoryRenderer
                  content={getContent()}
                  className="font-handwritten text-blue-800 leading-relaxed break-words"
                  category="WebText"
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  useRichCleaning={true}
                  showHeaderPreview={false}
                  enableProportionalSizing={true}
                />
              </div>
            </div>
          </div>

          {/* Bottom section with return button and webtext code */}
          <div className="flex justify-between items-end">
            {showReturn && (
              <button
                onClick={onReturnClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-handwritten text-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                ← Return
              </button>
            )}
            <div className="bg-blue-200/70 rounded px-3 py-1 text-sm font-mono text-blue-700 border border-blue-400">
              {webtextCode}
            </div>
          </div>
          
          {/* SuperAV Floating Popup */}
          <SuperAV
            isOpen={showSuperAV}
            onClose={() => setShowSuperAV(false)}
            title={webtext?.title || "Welcome to Grandpa John's Story Corner!"}
            author={webtext?.author}
            voiceName={webtext?.ai_voice_name}
            showAuthor={false}
            audioUrl={webtext?.audio_url}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
          />
        </div>
      </>
    );
  }

  // Generic styling for other webtext content
  return (
    <>
      <div 
        id={id}
        className={`rounded-lg border-4 p-6 ${backgroundColor} relative`}
        style={{ borderColor }}
      >
        {/* Audio Button - Always visible in top right corner */}
        <div className="absolute top-1 right-1 z-[5]">
          <AudioButton code={webtextCode} onClick={() => setShowSuperAV(true)} />
        </div>

        {/* Title */}
        <div className="mb-6 pr-16">
          {(() => {
            const content = getContent();
            const { tokens } = extractHeaderTokens(content);
            const titleHtml = tokens.titleHtml;
            
            if (titleHtml) {
              return (
                <h3 
                  className="text-2xl sm:text-3xl font-bold text-amber-800"
                  dangerouslySetInnerHTML={createSafeHeaderHtml(titleHtml)}
                />
              );
            } else {
              return (
                <h3 className="text-2xl sm:text-3xl font-bold text-amber-800">
                  {webtext?.title || title}
                </h3>
              );
            }
          })()}
        </div>

        {/* Photo and Content Section with true text wrapping */}
        <div className="relative">
          {/* Photo floated to the left */}
          {iconUrl && (
            <div className="float-left mr-6 mb-4">
              <div className="group relative">
                <img 
                  src={iconUrl} 
                  alt={photos[0]?.alt || "webtext icon"}
                  className="w-auto h-48 md:h-64 lg:h-80 object-contain border rounded"
                  style={{ borderColor }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {photos[0]?.alt && (
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontSize: '21px', fontFamily: 'Arial, sans-serif', lineHeight: '1.25' }}>
                    {photos[0].alt}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Content that wraps around the floated photo */}
          <IsolatedStoryRenderer
            content={getContent()}
            className="font-handwritten text-amber-900 leading-relaxed"
            category="WebText"
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            useRichCleaning={true}
            showHeaderPreview={false}
            enableProportionalSizing={true}
          />
          
          {/* Clear the float */}
          <div className="clear-both"></div>
        </div>

        {/* Bottom section with return button and webtext code */}
        <div className="flex justify-between items-end mt-6">
          {showReturn && (
            <button
              onClick={onReturnClick}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-handwritten text-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              ← Return
            </button>
          )}
          <div className="bg-white/70 rounded px-3 py-1 text-sm font-mono text-amber-700 border border-amber-300">
            {webtextCode}
          </div>
        </div>
      </div>

      {/* SuperAV Floating Popup */}
      <SuperAV
        isOpen={showSuperAV}
        onClose={() => setShowSuperAV(false)}
        title={webtext?.title || title}
        author={webtext?.author}
        voiceName={webtext?.ai_voice_name}
        showAuthor={false}
        audioUrl={webtext?.audio_url}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
    </>
  );
};