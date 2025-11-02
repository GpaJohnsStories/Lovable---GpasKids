
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  photo_alt_1: string;
  photo_alt_2: string;
  photo_alt_3: string;
  video_url: string;
  ai_voice_name?: string;
  ai_voice_model?: string;
  copyright_status?: string;
  audio_url?: string;
  publication_status_code?: number;
}

export const useStoryData = (storyId?: string) => {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = async () => {
    if (!storyId) {
      console.log('🎯 useStoryData: No storyId provided, skipping fetch');
      setStory(null);
      setIsLoading(false);
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
      
      const processedData = data;
      
      console.log('🎯 useStoryData: Successfully fetched story:', processedData);
      setStory(processedData as Story);
    } catch (err: any) {
      console.error('🎯 useStoryData: Error fetching story:', err);
      setError(err.message);
      
      // Show toast for user-friendly error
      if (err.message?.includes('No rows')) {
        setError('Story not found with the provided ID');
      }
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
