import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { getStoryPhotos } from '@/utils/storyUtils';
import { AudioButton } from '@/components/AudioButton';
import { SuperAV } from '@/components/SuperAV';
import { ArrowRight } from 'lucide-react';
import { FontScaleStep, DEFAULT_FONT_SCALE, getTypographyClasses } from '@/utils/fontScaleUtils';
import { createSafeHtml } from "@/utils/xssProtection";

interface ProportionalWebTextBoxProps {
  webtextCode: string;
  borderColor: string;
  backgroundColor: string;
  title: string;
  id?: string;
}

export const ProportionalWebTextBox: React.FC<ProportionalWebTextBoxProps> = ({
  webtextCode,
  borderColor,
  backgroundColor,
  title,
  id
}) => {
  const { lookupStoryByCode } = useStoryCodeLookup();
  const [webtext, setWebtext] = useState<any>(null);
  const [iconUrl, setIconUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [fontScale, setFontScale] = useState<FontScaleStep>(DEFAULT_FONT_SCALE);
  
  // Audio controls state for peppermint button
  const [showSuperAV, setShowSuperAV] = useState(false);

  const getContent = () => {
    if (loading) return { __html: "Loading..." };
    if (!webtext) return { __html: "Coming Soon" };
    const content = webtext.content || webtext.excerpt || "No content available";
    return createSafeHtml(content);
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

  // Get typography classes for current scale
  const typographyClasses = getTypographyClasses(fontScale);
  
  // CSS custom properties for proportional scaling
  const getScaleStyles = () => {
    const scaleMap = {
      'xs': { h3: '1rem', h3Line: '1.3', p: '0.75rem', pLine: '1.2' },
      'sm': { h3: '1.125rem', h3Line: '1.4', p: '0.875rem', pLine: '1.3' },
      'base': { h3: '1.25rem', h3Line: '1.5', p: '1rem', pLine: '1.5' },
      'lg': { h3: '1.5rem', h3Line: '1.5', p: '1.125rem', pLine: '1.5' },
      'xl': { h3: '1.875rem', h3Line: '1.6', p: '1.25rem', pLine: '1.6' },
      '2xl': { h3: '2.25rem', h3Line: '1.7', p: '1.5rem', pLine: '1.6' },
      '3xl': { h3: '2.625rem', h3Line: '1.7', p: '1.875rem', pLine: '1.7' },
      '4xl': { h3: '3rem', h3Line: '1.8', p: '2.25rem', pLine: '1.8' },
    };
    
    const scale = scaleMap[fontScale];
    return {
      '--h3-size': scale.h3,
      '--h3-line-height': scale.h3Line,
      '--p-size': scale.p,
      '--p-line-height': scale.pLine,
    } as React.CSSProperties;
  };

  // Special styling for SYS-WEL content
  if (isSysWel) {
    return (
      <>
        <div id={id} className="bg-blue-100 border-4 border-blue-500 rounded-lg p-4 sm:p-6 mb-8 overflow-hidden relative">
          {/* Top Right Control Box - only show if audio is available */}
          {webtext?.audio_url && (
            <div className="absolute z-[5]" style={{ top: -1, right: -1 }}>
              <div className="bg-white/90 border-4 border-blue-500 rounded-lg p-2 shadow-lg">
                <div className="flex items-center justify-end gap-2">
                  <div className="text-base font-handwritten font-bold text-green-800 leading-tight">
                    Click to listen or<br />change word size
                  </div>
                  <ChevronRight className="w-8 h-8 text-green-600 font-bold" strokeWidth={4} />
                  <AudioButton code="SYS-WEL" onClick={() => setShowSuperAV(true)} />
                </div>
              </div>
            </div>
          )}

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
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-handwritten font-bold text-blue-800 leading-tight break-words text-left">
                    {webtext?.title || "Welcome to Grandpa John's Story Corner!"}
                  </h1>
                </div>
              </div>

              {/* Content below title with proportional scaling */}
              <div className="flex-1 min-w-0">
                <div 
                  className="proportional-content text-blue-800 leading-relaxed break-words"
                  style={getScaleStyles()}
                  dangerouslySetInnerHTML={getContent()}
                />
              </div>
            </div>
          </div>

          {/* Bottom right: Webtext code */}
          <div className="flex justify-end">
            <div className="bg-blue-200/70 rounded px-3 py-1 text-sm font-mono text-blue-700 border border-blue-400">
              {webtextCode}
            </div>
          </div>
          
          {/* SuperAV Floating Popup with scale support */}
          <SuperAV
            isOpen={showSuperAV}
            onClose={() => setShowSuperAV(false)}
            title={webtext?.title || "Welcome to Grandpa John's Story Corner!"}
            author={webtext?.author}
            voiceName={webtext?.ai_voice_name}
            showAuthor={false}
            audioUrl={webtext?.audio_url}
            fontScale={fontScale}
            onFontScaleChange={setFontScale}
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
        className={`rounded-lg border-4 p-6 ${backgroundColor}`}
        style={{ borderColor }}
      >
        {/* Title and Audio Button Row */}
        <div className="flex justify-between items-start mb-6">
          <h3 className={`${typographyClasses.h3} font-bold text-amber-800`}>
            {webtext?.title || title}
          </h3>
          
          {/* Audio Button in top right */}
          {webtext?.audio_url && (
            <div className="flex-shrink-0">
              <AudioButton code={webtextCode} onClick={() => setShowSuperAV(true)} />
            </div>
          )}
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
                  className="w-auto h-48 md:h-64 lg:h-80 object-contain border rounded transition-transform hover:scale-105"
                  style={{ borderColor }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {photos[0]?.alt && (
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photos[0].alt}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Content that wraps around the floated photo with proportional scaling */}
          <div 
            className="proportional-content text-amber-900 leading-relaxed"
            style={getScaleStyles()}
            dangerouslySetInnerHTML={getContent()}
          />
          
          {/* Clear the float */}
          <div className="clear-both"></div>
        </div>

        {/* Bottom Right: Webtext Code */}
        <div className="flex justify-end mt-6">
          <div className="bg-white/70 rounded px-3 py-1 text-sm font-mono text-amber-700 border border-amber-300">
            {webtextCode}
          </div>
        </div>
      </div>

      {/* SuperAV Floating Popup with scale support */}
      <SuperAV
        isOpen={showSuperAV}
        onClose={() => setShowSuperAV(false)}
        title={webtext?.title || title}
        author={webtext?.author}
        voiceName={webtext?.ai_voice_name}
        showAuthor={false}
        audioUrl={webtext?.audio_url}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
      />
    </>
  );
};