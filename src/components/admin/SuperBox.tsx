import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { supabase } from '@/integrations/supabase/client';
import { processIconTokens } from '@/utils/iconTokens';
import { AudioButton } from '@/components/AudioButton';
import { SuperAV } from '@/components/SuperAV';
import { FontScaleStep, DEFAULT_FONT_SCALE } from '@/utils/fontScaleUtils';
import CopyrightIcon from '@/components/CopyrightIcon';
import PrintIcon from '@/components/PrintIcon';
import PrintWatermark from '@/components/PrintWatermark';
import PrintBlackBox from '@/components/PrintBlackBox';
import PrintCopyrightFooter from '@/components/PrintCopyrightFooter';
import '@/styles/SuperBox.css';

/**
 * SuperBox Component
 * 
 * Displays rich content from the stories table with customizable styling via color presets.
 * Designed for child-friendly accessibility with large fonts (min 21px) and responsive layout.
 * 
 * Features:
 * - Validates required fields (site, category, copyright_status, story_code, title)
 * - Processes tokens: {{ICON}}, {{PHOTO-N, position}}, {{PHOTO, all}}, {{VIDEO}}
 * - Integrates AudioButton + SuperAV for audio playback
 * - Responsive photo sizing: 350px (mobile) / 600px (tablet/desktop)
 * - Floated photo layout with proper text wrapping
 * 
 * Usage:
 *   <SuperBox code="ABC-123" />
 * 
 * @param code - Story code to load from database
 */

interface SuperBoxProps {
  code: string;
}

export const SuperBox: React.FC<SuperBoxProps> = ({ code }) => {
  const [showSuperAV, setShowSuperAV] = useState(false);
  const [fontScale, setFontScale] = useState<FontScaleStep>(DEFAULT_FONT_SCALE);
  const { lookupStoryByCode } = useStoryCodeLookup();

  // Debug logging for font scale changes
  React.useEffect(() => {
    console.log(`[SuperBox ${code}] fontScale changed to:`, fontScale);
    console.log(`[SuperBox ${code}] CSS var will be: var(--font-scale-${fontScale})`);
  }, [fontScale, code]);

  // Wrapped setter with logging
  const handleFontScaleChange = (newScale: FontScaleStep) => {
    console.log(`[SuperBox ${code}] handleFontScaleChange called with:`, newScale);
    setFontScale(newScale);
  };

  // Load story data
  const { data: story, isLoading, error } = useQuery({
    queryKey: ['superbox', code],
    queryFn: async () => {
      const result = await lookupStoryByCode(code, true);
      return result.story;
    },
  });

  // Load color preset if assigned
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
    enabled: !!story?.color_preset_id,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="super-box-loading">
        <div className="super-box-loading-spinner"></div>
        <p>Loading content...</p>
      </div>
    );
  }

  // Error state
  if (error || !story) {
    return (
      <div className="super-box-error">
        <p>⚠️ Error loading content for code: {code}</p>
      </div>
    );
  }

  // Validate required fields
  const missingFields: string[] = [];
  if (!story.site) missingFields.push('site');
  if (!story.category) missingFields.push('category');
  if (!story.copyright_status) missingFields.push('copyright_status');
  if (!story.story_code) missingFields.push('story_code');
  if (!story.title) missingFields.push('title');

  // Process content tokens
  const processedContent = story.content ? processSuperBoxTokens(story.content, story) : '';

  // Build inline styles from color preset
  const boxStyles: React.CSSProperties = {
    borderColor: preset?.box_border_color_hex || '#8B4513',
    backgroundColor: preset?.background_color_hex || '#FFFFFF',
    color: preset?.font_color_hex || '#000000',
  };

  const titleStyle: React.CSSProperties = {
    color: preset?.font_color_hex || '#000000',
    fontFamily: preset?.font_name || 'inherit',
  };

  const photoBorderColor = preset?.photo_border_color_hex || '#8B4513';

  return (
    <>
      {/* Print Components - Must be BEFORE main content to appear at top when printed */}
      <PrintWatermark show={story.copyright_status === 'L'} />
      <PrintBlackBox show={story.copyright_status === 'L'} />
      
      <div className="super-box" style={boxStyles} id={story.story_code}>
        {/* Error Banner - Inside border at top */}
        {missingFields.length > 0 && (
          <div className="super-box-error-banner">
            ⚠️ Missing Required Fields: {missingFields.join(', ')}
          </div>
        )}

        {/* Audio/Font Control Button - Top Right - Always visible */}
        <div className="super-box-audio-button">
          <AudioButton code={story.story_code} onClick={() => setShowSuperAV(true)} />
        </div>

        {/* Copyright & Print Icons - Top Right, below SuperAV button, stacked vertically */}
        {(() => {
          const status = story.copyright_status?.trim();
          const showIcons = status && (status === 'O' || status === 'L');
          console.log('SuperBox copyright check:', { 
            raw: story.copyright_status, 
            trimmed: status, 
            showIcons,
            storyCode: story.story_code 
          });
          return showIcons ? (
            <div className="super-box-copyright-icon">
              <CopyrightIcon copyrightStatus={status} />
              <PrintIcon storyCode={story.story_code} />
            </div>
          ) : null;
        })()}

        {/* Title - Always from story.title */}
        <h2 className="super-box-title" style={titleStyle}>
          {story.title}
        </h2>

        {/* Author - If present */}
        {story.author && (
          <p className="super-box-author" style={{ color: preset?.font_color_hex || '#000000' }}>
            {story.author}
          </p>
        )}

        {/* Tagline - If present */}
        {story.tagline && (
          <p className="super-box-tagline" style={{ color: preset?.font_color_hex || '#000000' }}>
            {story.tagline}
          </p>
        )}

        {/* Excerpt - If present */}
        {story.excerpt && (
          <p className="super-box-excerpt" style={{ color: preset?.font_color_hex || '#000000' }}>
            {story.excerpt}
          </p>
        )}

        {/* Main Content with Token Processing */}
        <div
          className="super-box-content"
          style={{ 
            color: preset?.font_color_hex || '#000000',
            fontFamily: preset?.font_name || 'inherit',
            fontSize: (() => {
              const scaleToRem = {
                'xs': '0.75rem',
                'sm': '0.875rem',
                'base': '1.3125rem',
                'lg': '1.5rem',
                'xl': '1.75rem',
                '2xl': '2rem',
                '3xl': '2.5rem',
                '4xl': '3rem'
              };
              const remValue = scaleToRem[fontScale] || '1.3125rem';
              console.log(`[SuperBox ${code}] Applying fontSize:`, remValue, `for fontScale:`, fontScale);
              return remValue;
            })(),
          }}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        {/* Code Display - Bottom Right */}
        <div className="super-box-code" style={{ color: preset?.font_color_hex || '#000000' }}>
          * {story.story_code}
        </div>

        {/* Apply photo border color to all photos via inline style injection */}
        <style>{`
          #${story.story_code} .super-box-photo,
          #${story.story_code} .super-box-photo-grid-item {
            border-color: ${photoBorderColor};
          }
        `}</style>
      </div>

      {/* SuperAV Audio Player / Font Control Popup - Always available */}
      <SuperAV
        isOpen={showSuperAV}
        onClose={() => setShowSuperAV(false)}
        title={story.title}
        author={story.author || undefined}
        voiceName={story.ai_voice_name || undefined}
        audioUrl={story.audio_url || undefined}
        showAuthor={true}
        fontScale={fontScale}
        onFontScaleChange={handleFontScaleChange}
      />
      
      {/* Print Copyright Footer - At end of document */}
      <PrintCopyrightFooter show={story.copyright_status !== '©'} />
    </>
  );
};

/**
 * Process SuperBox tokens in content
 * 
 * Supported tokens:
 * - {{ICON}}filename{{/ICON}} - Display icon from icons bucket
 * - {{PHOTO-1, left}} - Display photo 1 floated left (no closing tag)
 * - {{PHOTO-2, right}} - Display photo 2 floated right (no closing tag)
 * - {{PHOTO-3, center}} - Display photo 3 centered (no closing tag)
 * - {{PHOTO, all}} - Display all available photos in responsive grid
 * - {{VIDEO}}filename.mp4{{/VIDEO}} - Display video player
 * 
 * @param content - Raw content with tokens
 * @param story - Story object with photo links and metadata
 * @returns Processed HTML content
 */
function processSuperBoxTokens(content: string, story: any): string {
  if (!content) return '';

  let processed = content;

  // 1. ICON Tokens - Use existing utility
  processed = processIconTokens(processed);

  // 2. PHOTO Tokens - {{PHOTO-1, left}}, {{PHOTO-2, right}}, etc.
  // Position: left, right, center
  // No closing tag
  processed = processed.replace(
    /\{\{PHOTO-(\d+),\s*(left|right|center)\}\}/gi,
    (match, num, position) => {
      const photoUrl = story[`photo_link_${num}`];
      const photoAlt = story[`photo_alt_${num}`] || `Photo ${num}`;

      if (!photoUrl) return ''; // Skip if no photo

      return `<img 
        src="${photoUrl}" 
        alt="${photoAlt}" 
        class="super-box-photo photo-${position.toLowerCase()}" 
        loading="lazy"
      />`;
    }
  );

  // 3. PHOTO-ALL Token - {{PHOTO, all}}
  // Display all available photos in a responsive grid
  processed = processed.replace(
    /\{\{PHOTO,\s*all\}\}/gi,
    () => {
      const photos = [];
      for (let i = 1; i <= 4; i++) {
        const photoUrl = story[`photo_link_${i}`];
        const photoAlt = story[`photo_alt_${i}`] || `Photo ${i}`;
        if (photoUrl) {
          photos.push(`
            <img 
              src="${photoUrl}" 
              alt="${photoAlt}" 
              class="super-box-photo-grid-item" 
              loading="lazy"
            />
          `);
        }
      }

      if (photos.length === 0) return '';

      return `<div class="super-box-photo-grid photo-count-${photos.length}">
        ${photos.join('')}
      </div>`;
    }
  );

  // 4. VIDEO Token - {{VIDEO}}filename.mp4{{/VIDEO}}
  processed = processed.replace(
    /\{\{VIDEO\}\}([^{]+?)\{\{\/VIDEO\}\}/gi,
    (match, filename) => {
      const videoUrl = story.video_url || `/video/${filename.trim()}`;
      return `<video controls class="super-box-video">
        <source src="${videoUrl}" type="video/mp4" />
        Your browser does not support video playback.
      </video>`;
    }
  );

  return processed;
}

export default SuperBox;
