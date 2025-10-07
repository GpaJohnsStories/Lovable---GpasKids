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
    const backgroundColor = colorPreset.background_color_hex || "rgba(74, 124, 89, 0.2)";
    const fontColor = colorPreset.font_color_hex || "#4A7C59";
    
    return {
      primaryColor: fontColor,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      photoMatColor: backgroundColor
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