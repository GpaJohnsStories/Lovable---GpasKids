import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { getStoryPhotos } from '@/utils/storyUtils';
import { AudioButton } from '@/components/AudioButton';
import { SuperAV } from '@/components/SuperAV';
import { ArrowRight } from 'lucide-react';
import { FontScaleStep, DEFAULT_FONT_SCALE, getTypographyClasses } from '@/utils/fontScaleUtils';
import { useNavigate } from 'react-router-dom';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import { extractHeaderTokens, createSafeHeaderHtml } from '@/utils/headerTokens';
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";
import { buildCacheBustedUrl, getAssetVersionFromStory } from '@/utils/storyUtils';
import { toast } from '@/hooks/use-toast';
import { useIconCache } from '@/contexts/IconCacheContext';

interface ProportionalWebTextBoxProps {
  webtextCode: string;
  borderColor: string;
  backgroundColor: string;
  title?: string;
  id?: string;
}

export const ProportionalWebTextBox: React.FC<ProportionalWebTextBoxProps> = ({
  webtextCode,
  borderColor,
  backgroundColor,
  title,
  id
}) => {
  const navigate = useNavigate();
  const { lookupStoryByCode } = useStoryCodeLookup();
  const [webtext, setWebtext] = useState<any>(null);
  const [iconUrl, setIconUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [fontScale, setFontScale] = useState<FontScaleStep>(DEFAULT_FONT_SCALE);
  
  // Define isSysWel first, before using it
  const isSysWel = webtextCode === "SYS-WEL";
  const isSysCem = webtextCode === "SYS-CEM";
  
  // Load Buddy's new icon for SYS-WEL
  const { iconUrl: buddyIconUrl, iconName: buddyIconName, isLoading: buddyIconLoading } = useCachedIcon(isSysWel ? '!CO-BG1.jpg' : null);
  
  // Load the secret email button icon for SYS-CEM
  const { iconUrl: secretEmailIconUrl, iconName: secretEmailIconName, isLoading: secretEmailIconLoading } = useCachedIcon(isSysCem ? '!CO-CEZ.gif' : null);
  
  // Audio controls state for peppermint button
  const [showSuperAV, setShowSuperAV] = useState(false);
  const [displayImage, setDisplayImage] = useState<{url: string, alt: string} | null>(null);
  
  const { getIconUrl, getIconName } = useIconCache();
  
  const photos = webtext ? getStoryPhotos(webtext) : [];
  const mainPhoto = photos[0];

  // Effect to determine display image priority: BIGICON > mainPhoto > buddyIcon fallback
  useEffect(() => {
    const loadDisplayImage = async () => {
      if (!webtext) return;
      
      // Extract header tokens to check for BIGICON
      const { tokens } = extractHeaderTokens(webtext.content || '');
      
      // Priority: BIGICON > mainPhoto > fallback (buddyIcon for SYS-WEL)
      if (tokens.bigIcon) {
        try {
          const iconUrl = await getIconUrl(tokens.bigIcon);
          const iconName = getIconName(tokens.bigIcon);
          setDisplayImage({ url: iconUrl, alt: iconName || 'Big Icon' });
          return;
        } catch (error) {
          console.warn('Failed to load BIGICON:', error);
        }
      }
      
      if (mainPhoto?.url) {
        setDisplayImage({ url: mainPhoto.url, alt: mainPhoto.alt || 'Story Photo' });
        return;
      }
      
      // For SYS-WEL, fallback to Buddy icon
      if (isSysWel && buddyIconUrl) {
        setDisplayImage({ url: buddyIconUrl, alt: buddyIconName || 'Buddy' });
        return;
      }
      
      setDisplayImage(null);
    };

    loadDisplayImage();
  }, [webtext, mainPhoto, buddyIconUrl, buddyIconName, isSysWel, getIconUrl, getIconName]);

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

  // Get typography classes for current scale
  const typographyClasses = getTypographyClasses(fontScale);
  
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

  // Secret email copy functionality for SYS-CEM
  const handleSecretEmailCopy = async () => {
    try {
      // Fetch SYS-CES webtext content
      const sysCesData = await lookupStoryByCode('SYS-CES', true);
      if (!sysCesData.story?.content) {
        toast({
          title: "Error",
          description: "Could not retrieve secret email",
          variant: "destructive"
        });
        return;
      }

      // Decode the obfuscated email
      let email = sysCesData.story.content;
      // Remove all slashes
      email = email.replace(/\//g, '');
      // Replace "dot" with "."
      email = email.replace(/dot/g, '.');
      // Replace "at" with "@"
      email = email.replace(/at/g, '@');
      // Clean up any extra whitespace
      email = email.trim();

      // Copy to clipboard
      await navigator.clipboard.writeText(email);
      
      toast({
        description: "Buddy's secret copied to clipboard. Now paste it into email \"Send To\" box.",
        variant: "default",
        className: "emerald-toast !bg-emerald-500 !text-white !border-none"
      });
      
    } catch (error) {
      // Fallback if clipboard API fails
      toast({
        title: "Copy manually",
        description: "Please manually copy: Contact Gpa John at gmail.com",
        variant: "default"
      });
    }
  };

  // Special styling for SYS-WEL content
  if (isSysWel) {
    return (
      <>
        <div id={id} className="bg-emerald-50 border-4 border-emerald-600 rounded-lg p-4 sm:p-6 mb-8 overflow-hidden relative">
          {/* Top Right Control Box - Always visible */}
          <div className="absolute z-[5]" style={{ top: -1, right: -1 }}>
            <div className="bg-white/90 border-4 border-emerald-600 rounded-lg px-2 py-1 shadow-lg">
              <div className="flex items-center justify-end gap-2">
                <div className="text-base font-handwritten font-bold text-emerald-900 leading-tight">
                  Click to listen or<br />change word size
                </div>
                <ChevronRight className="w-8 h-8 text-emerald-800 font-bold" strokeWidth={4} />
                <AudioButton code="SYS-WEL" onClick={() => setShowSuperAV(true)} />
              </div>
            </div>
          </div>

          {/* Top section with photo and title */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Photo in left column on tablets+ */}
            {displayImage && (
              <div className="w-fit flex-shrink-0">
                <div className="inline-block group">
                  <button 
                    onClick={() => navigate('/guide')}
                    title={buddyIconName || ''}
                    className="relative block transform transition-all duration-200 hover:scale-105 active:scale-95 rounded-lg shadow-lg hover:shadow-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-1 border-2 border-emerald-700"
                    style={{
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  >
                    <img
                      src={displayImage.url}
                      alt={displayImage.alt}
                      className="w-auto h-auto max-h-48 md:max-h-64 lg:max-h-80 object-contain rounded border border-emerald-800"
                    />
                  </button>
                  {buddyIconName && (
                    <div className="mt-2 bg-emerald-900/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-yellow-100 text-center font-bold shadow-lg border border-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontSize: '13pt', fontFamily: 'Kalam, Comic Sans MS, cursive, sans-serif' }}>
                      {buddyIconName}
                    </div>
                  )}
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
                          className="font-handwritten font-bold text-emerald-900 leading-tight break-words text-left"
                          style={{ 
                            fontFamily: "'Kalam', 'Comic Sans MS', 'Arial', sans-serif",
                            fontSize: `${Math.floor(currentFontSize * 2.25)}px`
                          }}
                          dangerouslySetInnerHTML={createSafeHeaderHtml(titleHtml)}
                        />
                      );
                    } else {
                      return (
                        <h1 
                          className="font-handwritten font-bold text-emerald-900 leading-tight break-words text-left"
                          style={{ 
                            fontFamily: "'Kalam', 'Comic Sans MS', 'Arial', sans-serif",
                            fontSize: `${Math.floor(currentFontSize * 2.25)}px`
                          }}
                        >
                          {webtext?.title || "Welcome to Grandpa John's Story Corner!"}
                        </h1>
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Content below title with proportional scaling */}
              <div className="flex-1 min-w-0">
                <IsolatedStoryRenderer
                  content={getContent()}
                  className="proportional-content text-emerald-900 leading-relaxed break-words"
                  category="WebText"
                  fontSize={currentFontSize}
                  useRichCleaning={true}
                  showHeaderPreview={false} // Don't show header preview for SYS-WEL since we handle title separately
                  enableProportionalSizing={true}
                />
              </div>
            </div>
          </div>

          {/* Bottom right: Webtext code */}
          <div className="flex justify-end">
            <div className="bg-emerald-100/70 rounded px-3 py-1 text-sm font-mono text-emerald-800 border border-emerald-500">
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
            audioUrl={webtext?.audio_url ? buildCacheBustedUrl(webtext.audio_url, getAssetVersionFromStory(webtext)) : undefined}
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
        className={`rounded-lg p-6 ${backgroundColor} relative w-full min-h-fit`}
        style={{ borderColor }}
      >
        {/* Audio Button - Always visible in top right corner */}
        <div className="absolute top-1 right-1 z-[5]">
          <AudioButton code={webtextCode} onClick={() => setShowSuperAV(true)} />
        </div>

        {/* Title */}
        {(webtext?.title || title) && (
          <div className="mb-6 pr-16">
            {(() => {
              const content = getContent();
              const { tokens } = extractHeaderTokens(content);
              const titleHtml = tokens.titleHtml;
              
              if (titleHtml) {
                return (
                  <h3 
                    className={`${typographyClasses.h3} font-bold text-amber-800`}
                    dangerouslySetInnerHTML={createSafeHeaderHtml(titleHtml)}
                  />
                );
              } else {
                return (
                  <h3 className={`${typographyClasses.h3} font-bold text-amber-800`}>
                    {webtext?.title || title}
                  </h3>
                );
              }
            })()}
          </div>
        )}

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
          <IsolatedStoryRenderer
            content={getContent()}
            className="proportional-content text-amber-900 leading-relaxed"
            category="WebText"
            fontSize={currentFontSize}
            useRichCleaning={true}
            showHeaderPreview={false} // Don't show header preview since we handle title separately
            enableProportionalSizing={true}
          />
          
          {/* Clear the float */}
          <div className="clear-both"></div>
        </div>

        {/* Bottom section with webtext code and secret email button for SYS-CEM */}
        <div className="flex justify-between items-end mt-6">
          {/* Bottom Left: Secret Email Button for SYS-CEM */}
          {isSysCem && secretEmailIconUrl && (
            <button
              onClick={handleSecretEmailCopy}
              className="w-[85px] h-[85px] transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              title={secretEmailIconName || 'Copy secret email'}
            >
              <img
                src={secretEmailIconUrl}
                alt={secretEmailIconName || 'Secret email button'}
                className="w-[85px] h-[85px] object-contain"
              />
            </button>
          )}
          
          {/* Bottom Right: Webtext Code */}
          <div className="bg-white/70 rounded px-3 py-1 text-sm font-mono text-amber-700 border border-amber-300">
            {webtextCode}
          </div>
        </div>
      </div>

      {/* SuperAV Floating Popup with scale support */}
        <SuperAV
          isOpen={showSuperAV}
          onClose={() => setShowSuperAV(false)}
          title={webtext?.title || title || "Content"}
          author={webtext?.author}
          voiceName={webtext?.ai_voice_name}
          showAuthor={false}
          audioUrl={webtext?.audio_url ? buildCacheBustedUrl(webtext.audio_url, getAssetVersionFromStory(webtext)) : undefined}
          fontScale={fontScale}
          onFontScaleChange={setFontScale}
        />
    </>
  );
};