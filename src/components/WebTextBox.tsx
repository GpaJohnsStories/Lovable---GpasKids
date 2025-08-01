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
      <div className="bg-blue-50 border-4 border-blue-300 rounded-lg p-6 mb-8">
        {/* Header with icon and title */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {iconUrl && (
              <img 
                src={iconUrl} 
                alt={icon}
                className="w-10 h-10 object-contain border-2 border-blue-300 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <h1 className="text-2xl md:text-3xl font-handwritten font-bold text-blue-800">
              {webtext?.title || "Welcome to Grandpa John's Story Corner!"}
            </h1>
          </div>
          
          {/* Audio Controls */}
          <div className="flex-shrink-0">
            <div className="border-2 border-blue-300 rounded-lg bg-blue-100/50 p-2">
              <div className="text-center italic font-bold text-blue-700 text-sm mb-1">
                Shall I read it to you?
              </div>
              <UniversalAudioControls
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

        {/* Main content area with photo and text */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main photo with tooltip */}
          {mainPhoto && (
            <div className="lg:w-1/3 flex-shrink-0">
              <div className="group relative">
                <img
                  src={mainPhoto.url}
                  alt={mainPhoto.alt}
                  className="w-full h-auto rounded-lg border-2 border-blue-300 shadow-lg cursor-pointer transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {mainPhoto.alt}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            <div 
              className="font-handwritten text-lg text-blue-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: getContent() }}
            />
          </div>
        </div>

        {/* Bottom right: Webtext code */}
        <div className="flex justify-end mt-4">
          <div className="bg-blue-100/70 rounded px-3 py-1 text-sm font-mono text-blue-600 border border-blue-200">
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