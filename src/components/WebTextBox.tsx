import React, { useState, useEffect } from 'react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { getStoryPhotos } from '@/utils/storyUtils';
import { AudioButton } from '@/components/AudioButton';

import { SuperSuper } from '@/components/SuperSuper';
import { ArrowRight } from 'lucide-react';

interface WebTextBoxProps {
  webtextCode: string;
  borderColor: string;
  backgroundColor: string;
  title: string;
  id?: string;
}

export const WebTextBox: React.FC<WebTextBoxProps> = ({
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
  
  // Audio controls state for peppermint button
  const [showSuperAudio, setShowSuperAudio] = useState(false);

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
          {/* Peppermint Audio Button - Top Right Corner - only show if audio is available */}
          {webtext?.audio_url && (
            <div className="absolute top-4 right-4 z-[5] flex items-center gap-2">
              <div className="text-base sm:text-lg font-handwritten font-bold text-green-800">
                Click to listen
              </div>
              <ArrowRight className="text-green-800" size={20} strokeWidth={3} />
              <AudioButton code="SYS-WEL" onClick={() => setShowSuperAudio(true)} />
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

              {/* Content below title */}
              <div className="flex-1 min-w-0">
                <div 
                  className="font-handwritten text-blue-800 leading-relaxed break-words [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:break-words [&>h3]:font-handwritten [&>p]:text-base [&>p]:sm:text-lg [&>p]:mb-3 [&>p]:break-words [&>p]:font-handwritten [&>ul]:list-disc [&>ul]:list-inside [&>ul]:mb-3 [&>ul]:font-handwritten [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:mb-3 [&>ol]:font-handwritten [&>li]:text-base [&>li]:sm:text-lg [&>li]:mb-1 [&>li]:font-handwritten [&>span]:font-handwritten [&>em]:font-handwritten [&>strong]:font-handwritten [&>i]:font-handwritten [&>b]:font-handwritten"
                  dangerouslySetInnerHTML={{ __html: getContent() }}
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
          
          {/* SuperAudio Floating Popup */}
          <SuperSuper
            isOpen={showSuperAudio}
            onClose={() => setShowSuperAudio(false)}
            title={webtext?.title || "Welcome to Grandpa John's Story Corner!"}
            author={webtext?.author}
            voiceName={webtext?.ai_voice_name}
            showAuthor={false}
            audioUrl={webtext?.audio_url}
            fontSize={16}
            onFontSizeChange={() => {}}
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
          <h3 className="text-2xl sm:text-3xl font-bold text-amber-800">
            {webtext?.title || title}
          </h3>
          
          {/* Audio Button in top right */}
          {webtext?.audio_url && (
            <div className="flex-shrink-0">
              <AudioButton code={webtextCode} onClick={() => setShowSuperAudio(true)} />
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
          
          {/* Content that wraps around the floated photo */}
          <div 
            className="font-handwritten text-amber-900 leading-relaxed [&>ul]:list-disc [&>ul]:list-inside [&>ul]:mb-3 [&>ul]:font-handwritten [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:mb-3 [&>ol]:font-handwritten [&>li]:mb-1 [&>li]:font-handwritten [&>p]:font-handwritten [&>h3]:font-handwritten [&>span]:font-handwritten [&>em]:font-handwritten [&>strong]:font-handwritten [&>i]:font-handwritten [&>b]:font-handwritten"
            dangerouslySetInnerHTML={{ __html: getContent() }}
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

      {/* SuperAudio Floating Popup */}
      <SuperSuper
        isOpen={showSuperAudio}
        onClose={() => setShowSuperAudio(false)}
        title={webtext?.title || title}
        author={webtext?.author}
        voiceName={webtext?.ai_voice_name}
        showAuthor={false}
        audioUrl={webtext?.audio_url}
        fontSize={16}
        onFontSizeChange={() => {}}
      />
    </>
  );
};