
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  google_drive_link: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  photo_alt_1: string;
  photo_alt_2: string;
  photo_alt_3: string;
  video_url: string;
  published: string;
  ai_voice_name?: string;
  ai_voice_model?: string;
  audio_url?: string;
}

export const useStoryData = (storyId?: string) => {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = async () => {
    if (!storyId) {
      console.log('🎯 useStoryData: No storyId provided, skipping fetch');
      return;
    }
    
    console.log('🎯 useStoryData: Fetching story with ID:', storyId);
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single();
      
      if (error) {
        console.error('🎯 useStoryData: Error fetching story:', error);
        throw error;
      }
      
      // Convert any "System" or "STORY" categories to "WebText" for compatibility
      const processedData = {
        ...data,
        category: (data.category === 'System' || data.category === 'STORY') ? 'WebText' : data.category
      };
      
      console.log('🎯 useStoryData: Successfully fetched story:', processedData);
      setStory(processedData as Story);
    } catch (err: any) {
      console.error('🎯 useStoryData: Error fetching story:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  return {
    story,
    isLoading,
    error,
    refetch: fetchStory
  };
};
