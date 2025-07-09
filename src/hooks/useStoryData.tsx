import { useState, useEffect } from 'react';
import { adminClient } from "@/integrations/supabase/clients";

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "System";
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
}

export const useStoryData = (storyId?: string) => {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = async () => {
    if (!storyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await adminClient
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single();
      
      if (error) throw error;
      setStory(data);
    } catch (err: any) {
      console.error('Error fetching story:', err);
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