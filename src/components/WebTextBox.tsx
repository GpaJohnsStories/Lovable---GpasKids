import React, { useState, useEffect } from 'react';
import { UniversalAudioControls } from '@/components/UniversalAudioControls';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { supabase } from '@/integrations/supabase/client';
import { getStoryPhotos } from '@/utils/storyUtils';

interface WebTextBoxProps {
  webtextCode: string;
  icon: string;
  borderColor: string;
  backgroundColor: string;
  title: string;
}

export const WebTextBox: React.FC<WebTextBoxProps> = ({
  webtextCode,
  icon,
  borderColor,
  backgroundColor,
  title
}) => {
  const { lookupStoryByCode } = useStoryCodeLookup();
  const [webtext, setWebtext] = useState<any>(null);
  const [iconUrl, setIconUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch webtext content
      const webtextData = await lookupStoryByCode(webtextCode, true);
      setWebtext(webtextData);
      
      // Fetch icon from icon library
      try {
        const { data: iconData, error } = await supabase
          .from('icon_library')
          .select('file_path')
          .eq('icon_code', icon)
          .maybeSingle();
        
        if (!error && iconData) {
          // Construct the full URL for the icon from the storage bucket
          const { data: { publicUrl } } = supabase.storage
            .from('icons')
            .getPublicUrl(iconData.file_path);
          setIconUrl(publicUrl);
        }
      } catch (error) {
        console.error('Error fetching icon:', error);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [webtextCode, icon, lookupStoryByCode]);

  const getContent = () => {
    if (loading) return "Loading...";
    if (!webtext) return "Coming Soon";
    return webtext.content || webtext.excerpt || "No content available";
  };

  const isSysWel = webtextCode === "SYS-WEL";
  const photos = webtext ? getStoryPhotos(webtext) : [];
  const mainPhoto = photos[0];

  // Special styling for SYS-WEL content
  if (isSysWel) {
    return (
      <div className="bg-blue-100 border-4 border-blue-500 rounded-lg p-4 sm:p-6 mb-8 overflow-hidden">
        {/* Top section with photo and title */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Photo in left column on tablets+ */}
          {mainPhoto && (
            <div className="w-full md:w-80 lg:w-64 flex-shrink-0">
              <div className="group relative">
                <img
                  src={mainPhoto.url}
                  alt={mainPhoto.alt}
                  className="w-full h-auto max-h-48 md:max-h-64 lg:max-h-80 object-contain rounded-lg border-2 border-blue-500 shadow-lg cursor-pointer transition-transform hover:scale-105"
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
            {/* Audio Controls at top */}
            <div className="flex justify-center mb-4">
              <div className="rounded-lg bg-blue-200/50 p-3 border border-blue-400/60">
                <div className="text-center italic font-bold text-blue-800 text-xs sm:text-sm mb-1">
                  Shall I read it to you?
                </div>
                <UniversalAudioControls
                  audioUrl={webtext?.audio_url}
                  title={webtext?.title || title}
                  content={getContent()}
                  author={webtext?.author}
                  allowTextToSpeech={true}
                  size="sm"
                  className="bg-transparent border-0"
                />
              </div>
            </div>

            {/* Title section below audio controls */}
            <div className="mb-4">
              <div className="flex items-start gap-3 justify-center">
                {iconUrl && (
                  <img 
                    src={iconUrl} 
                    alt={icon}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain border-2 border-blue-500 rounded mt-1 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-handwritten font-bold text-blue-800 leading-tight break-words text-center">
                  {webtext?.title || "Welcome to Grandpa John's Story Corner!"}
                </h1>
              </div>
            </div>

            {/* Content below title */}
            <div className="flex-1 min-w-0">
              <div 
                className="font-handwritten text-blue-800 leading-relaxed break-words [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:break-words [&>p]:text-base [&>p]:sm:text-lg [&>p]:mb-3 [&>p]:break-words"
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
      </div>
    );
  }

  // Generic styling for other webtext content
  return (
    <div 
      className={`rounded-lg border-4 p-6 ${backgroundColor}`}
      style={{ borderColor }}
    >
      {/* Top Row */}
      <div className="flex justify-between items-start mb-4">
        {/* Left: Icon and Title */}
        <div className="flex items-center gap-3">
          {iconUrl && (
            <img 
              src={iconUrl} 
              alt={icon}
              className="w-8 h-8 object-contain border rounded"
              style={{ borderColor }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <h3 className="text-xl font-bold text-amber-800">
            {webtext?.title || title}
          </h3>
        </div>
        
        {/* Right: Audio Controls */}
        <div className="flex-shrink-0 -mt-6 -mr-6">
          <div 
            className="border-2 rounded-lg"
            style={{ borderColor }}
          >
            <div 
              className="text-center italic font-bold mb-0"
              style={{ 
                fontSize: '14pt',
                color: borderColor 
              }}
            >
              Shall I read it to you?
            </div>
            <UniversalAudioControls
              audioUrl={webtext?.audio_url}
              title={webtext?.title || title}
              content={getContent()}
              author={webtext?.author}
              allowTextToSpeech={true}
              size="sm"
              className="bg-transparent border-0"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div 
          className="text-amber-900 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: getContent() }}
        />
      </div>

      {/* Bottom Right: Webtext Code */}
      <div className="flex justify-end">
        <div className="bg-white/70 rounded px-3 py-1 text-sm font-mono text-amber-700 border border-amber-300">
          {webtextCode}
        </div>
      </div>
    </div>
  );
};