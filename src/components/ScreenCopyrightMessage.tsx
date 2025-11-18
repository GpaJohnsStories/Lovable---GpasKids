import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { supabase } from '@/integrations/supabase/client';
import SecureStoryContent from '@/components/secure/SecureStoryContent';

interface ScreenCopyrightMessageProps {
  copyrightStatus: string;
}

const ScreenCopyrightMessage: React.FC<ScreenCopyrightMessageProps> = ({ copyrightStatus }) => {
  const { lookupStoryByCode } = useStoryCodeLookup();
  
  // Map copyright status to story code
  const storyCode = 
    copyrightStatus === 'O' ? 'PRT-COF' :
    copyrightStatus === '©' ? 'PRT-FCR' :
    copyrightStatus === 'L' ? 'PRT-LCS' :
    null;

  // Fetch copyright message story
  const { data: story, isLoading } = useQuery({
    queryKey: ['screen-copyright', storyCode],
    queryFn: async () => {
      if (!storyCode) return null;
      const result = await lookupStoryByCode(storyCode, true);
      return result.story;
    },
    enabled: !!storyCode
  });

  // Fetch color preset
  const { data: preset } = useQuery({
    queryKey: ['color-preset', story?.color_preset_id],
    queryFn: async () => {
      if (!story?.color_preset_id) return null;
      const { data } = await supabase
        .from('color_presets')
        .select('*')
        .eq('id', story.color_preset_id)
        .maybeSingle();
      return data;
    },
    enabled: !!story?.color_preset_id
  });

  if (isLoading || !story || !story.content) return null;

  return (
    <div 
      className="screen-copyright-message"
      style={{
        borderColor: preset?.box_border_color_hex || '#8B4513',
        backgroundColor: preset?.background_color_hex || '#F5F5DC',
        color: preset?.font_color_hex || '#000000',
        borderWidth: '4px',
        borderStyle: 'solid',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        margin: '2rem auto',
        maxWidth: '56rem',
        textAlign: 'center'
      }}
    >
      <SecureStoryContent 
        content={story.content}
        className=""
      />
    </div>
  );
};

export default ScreenCopyrightMessage;
