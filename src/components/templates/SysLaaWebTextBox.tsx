import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import BaseWebTextBox from "./BaseWebTextBox";

interface SysLaaWebTextBoxProps {
  code: string;
  title?: string;
  id?: string;
}

const SysLaaWebTextBox: React.FC<SysLaaWebTextBoxProps> = ({ 
  code, 
  title,
  id 
}) => {
  const [colorPreset, setColorPreset] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColorPreset = async () => {
      try {
        const { data, error } = await supabase
          .from('color_presets')
          .select('*')
          .eq('id', '1')
          .single();
        
        if (error) {
          console.error('Error fetching color preset:', error);
          // Fallback to original orange theme
          setColorPreset({
            box_border_color_hex: "#FF8C42",
            background_color_hex: "#FF8C42",
            font_color_hex: "#FF8C42"
          });
        } else {
          setColorPreset(data);
        }
      } catch (error) {
        console.error('Error fetching color preset:', error);
        // Fallback to original orange theme
        setColorPreset({
          box_border_color_hex: "#FF8C42",
          background_color_hex: "#FF8C42", 
          font_color_hex: "#FF8C42"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchColorPreset();
  }, []);

  // Convert color preset to theme format
  const theme = useMemo(() => {
    if (!colorPreset) return null;
    
    const borderColor = colorPreset.box_border_color_hex || "#FF8C42";
    const backgroundColor = colorPreset.background_color_hex || "rgba(255, 140, 66, 0.2)";
    const fontColor = colorPreset.font_color_hex || "#FF8C42";
    
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
      cssClassPrefix="syslaa"
    />
  );
};

export default SysLaaWebTextBox;