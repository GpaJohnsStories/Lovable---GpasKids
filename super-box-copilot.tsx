import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import './SuperBox.css';

interface SuperBoxProps {
  code: string;
  title: string;
}

const SuperBox: React.FC<SuperBoxProps> = ({ code, title }) => {
  const [story, setStory] = useState<any>(null);
  const [preset, setPreset] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch story by code
        const { data: storyData, error: storyError } = await supabase
          .from('stories')
          .select('*')
          .eq('code', code)
          .single();

        if (storyError) throw storyError;

        // Validate category
        if (['story', 'author-bio'].includes(storyData.category)) {
          console.error(`Invalid category: ${storyData.category}`);
          setLoading(false);
          return;
        }

        setStory(storyData);

        // Fetch color preset if assigned
        if (storyData.color_preset_id) {
          const { data: presetData, error: presetError } = await supabase
            .from('color_presets')
            .select('*')
            .eq('id', storyData.color_preset_id)
            .single();

          if (!presetError && presetData) {
            setPreset(presetData);
          }
        }
      } catch (error) {
        console.error('Error loading super-box data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [code]);

  const processTokens = (content: string) => {
    if (!content) return '';
    
    let processed = content;

    // ICON token
    processed = processed.replace(/{{ICON}}(.*?){{\/ICON}}/g, (match, filename) => {
      return `<img src="/icons/${filename}" alt="icon" class="super-box-icon" />`;
    });

    // PHOTO tokens with positions
    processed = processed.replace(/{{PHOTO(\d),\s*(left|right|center)}}{{\/PHOTO\1}}/g, 
      (match, num, position) => {
        const photoField = `photo_${num}_url`;
        const photoUrl = story?.[photoField];
        
        if (photoUrl) {
          return `<img src="${photoUrl}" alt="Photo ${num}" class="super-box-photo photo-${position}" />`;
        } else {
          // Placeholder for missing photo
          return `<div class="photo-placeholder photo-${position}">Photo ${num}</div>`;
        }
      });

    // PHOTO all token - responsive grid
    processed = processed.replace(/{{PHOTO,\s*all}}{{\/PHOTO}}/g, () => {
      const photos = [];
      for (let i = 1; i <= 4; i++) {
        const photoField = `photo_${i}_url`;
        if (story?.[photoField]) {
          photos.push(`<img src="${story[photoField]}" alt="Photo ${i}" />`);
        }
      }
      return `<div class="photo-grid photo-count-${photos.length}">${photos.join('')}</div>`;
    });

    // AUDIO token
    processed = processed.replace(/{{AUDIO}}(.*?){{\/AUDIO}}/g, (match, filename) => {
      const audioUrl = story?.audio_url || `/audio/${filename}`;
      return `<audio controls class="super-box-audio"><source src="${audioUrl}" /></audio>`;
    });

    // VIDEO token
    processed = processed.replace(/{{VIDEO}}(.*?){{\/VIDEO}}/g, (match, filename) => {
      const videoUrl = story?.video_url || `/video/${filename}`;
      return `<video controls class="super-box-video"><source src="${videoUrl}" /></video>`;
    });

    return processed;
  };

  if (loading) return <div className="super-box-loading">Loading...</div>;
  if (!story) return <div className="super-box-error">Content not found</div>;

  // Apply preset styles
  const boxStyle: React.CSSProperties = preset ? {
    borderColor: preset.box_border_color,
    backgroundColor: preset.box_background_color,
    fontFamily: preset.font_name,
  } : {};

  // CSS class for this preset
  const presetClass = preset ? `preset-${preset.id}` : '';

  return (
    <div 
      id={story.code} 
      className={`super-box ${presetClass}`}
      style={boxStyle}
    >
      <h2 className="super-box-title">{title || story.title}</h2>
      <div 
        className="super-box-content"
        dangerouslySetInnerHTML={{ 
          __html: processTokens(story.content || story.text) 
        }}
      />
    </div>
  );
};

export default SuperBox;
