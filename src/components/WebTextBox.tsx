import React, { useState, useEffect } from 'react';
import { UniversalAudioControls } from '@/components/UniversalAudioControls';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { supabase } from '@/integrations/supabase/client';

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
          setIconUrl(iconData.file_path);
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

  return (
    <div 
      className={`rounded-lg border-4 p-6 mb-6 ${backgroundColor}`}
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
              className="w-8 h-8 object-contain"
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
        <div className="flex-shrink-0">
          <div 
            className="border-2 rounded-lg p-3"
            style={{ borderColor }}
          >
            <div 
              className="text-center italic mb-2"
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