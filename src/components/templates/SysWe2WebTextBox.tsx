import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import BaseWebTextBox from "./BaseWebTextBox";

interface SysWe2WebTextBoxProps {
  code: string;
  title?: string;
  id?: string;
}

const SysWe2WebTextBox: React.FC<SysWe2WebTextBoxProps> = ({ code, title, id }) => {
  const [colorPreset, setColorPreset] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColorPreset = async () => {
      try {
        // First, get the story's color_preset_id
        const { data: storyData, error: storyError } = await supabase
          .from('stories')
          .select('color_preset_id')
          .eq('story_code', code)
          .single();
        
        if (storyError) {
          console.error('Error fetching story:', storyError);
        }

        // Use the story's preset ID, or fallback to '2'
        const presetId = storyData?.color_preset_id || '2';
        
        // Fetch the color preset
        const { data, error } = await supabase
          .from('color_presets')
          .select('*')
          .eq('id', presetId)
          .single();
        
        if (error) {
          console.error('Error fetching color preset:', error);
          // Fallback to original green theme
          setColorPreset({
            box_border_color_hex: "#4A7C59",
            background_color_hex: "#4A7C59",
            font_color_hex: "#4A7C59"
          });
        } else {
          setColorPreset(data);
        }
      } catch (error) {
        console.error('Error fetching color preset:', error);
        // Fallback to original green theme
        setColorPreset({
          box_border_color_hex: "#4A7C59",
          background_color_hex: "#4A7C59",
          font_color_hex: "#4A7C59"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchColorPreset();
  }, [code]);

  // Convert color preset to theme format
  const theme = useMemo(() => {
    if (!colorPreset) return null;
    
    const borderColor = colorPreset.box_border_color_hex || "#4A7C59";
    const fontColor = colorPreset.font_color_hex || "#4A7C59";
    const photoBorderColor = colorPreset.photo_border_color_hex || borderColor;
    
    // Always use rgba with 20% opacity for background
    let backgroundColor = "rgba(74, 124, 89, 0.2)"; // Default green with transparency
    
    if (colorPreset.background_color_hex) {
      const bgHex = colorPreset.background_color_hex;
      if (bgHex.startsWith('rgba')) {
        backgroundColor = bgHex;
      } else if (bgHex.startsWith('#')) {
        // Convert hex to rgba with 0.2 opacity
        const hex = bgHex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
      }
    }
    
    return {
      primaryColor: fontColor,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      photoMatColor: backgroundColor,
      photoBorderColor: photoBorderColor
    };
  }, [colorPreset]);

  if (loading || !theme) {
    return (
      <div className="rounded-lg border p-4 mb-4">
        <div className="text-18-system">Loading...</div>
      </div>
    );
  }

  return (
    <BaseWebTextBox
      code={code}
      title={title}
      id={id}
      theme={theme}
      cssClassPrefix="syswe2"
    />
  );
};

export default SysWe2WebTextBox;