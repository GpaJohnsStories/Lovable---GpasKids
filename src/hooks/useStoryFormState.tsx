
import { useState, useEffect } from 'react';
import { useStoryData } from '@/hooks/useStoryData';
import { supabase } from "@/integrations/supabase/client";

export interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "STORY";
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
  ai_voice_name: string;
  ai_voice_model: string;
  audio_url?: string;
}

const initialFormData: Story = {
  title: '',
  author: 'Grandpa John',
  category: 'Fun',
  content: '',
  tagline: '',
  excerpt: '',
  story_code: '',
  google_drive_link: '',
  photo_link_1: '',
  photo_link_2: '',
  photo_link_3: '',
  photo_alt_1: '',
  photo_alt_2: '',
  photo_alt_3: '',
  video_url: '',
  published: 'N',
  ai_voice_name: 'Nova',
  ai_voice_model: 'tts-1'
};

export const useStoryFormState = (storyId?: string) => {
  const [formData, setFormData] = useState<Story>(initialFormData);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const { story, isLoading: isLoadingStory, refetch: refetchStory } = useStoryData(storyId);

  // Load story data into form when it's fetched
  useEffect(() => {
    if (story) {
      setFormData({
        ...story,
        ai_voice_name: story.ai_voice_name || 'Nova',
        ai_voice_model: story.ai_voice_model || 'tts-1'
      });
    }
  }, [story]);

  const handleInputChange = (field: keyof Story, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (photoNumber: 1 | 2 | 3, url: string) => {
    handleInputChange(`photo_link_${photoNumber}` as keyof Story, url);
  };

  const handlePhotoRemove = (photoNumber: 1 | 2 | 3) => {
    handleInputChange(`photo_link_${photoNumber}` as keyof Story, '');
  };

  const handleVideoUpload = (url: string) => {
    handleInputChange('video_url', url);
  };

  const handleVideoRemove = () => {
    handleInputChange('video_url', '');
  };

  const handleVoiceChange = (voice: string) => {
    handleInputChange('ai_voice_name', voice);
  };

  const handleGenerateAudio = async () => {
    if (!formData.id) {
      console.log('Story must be saved before generating audio');
      return;
    }

    setIsGeneratingAudio(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-story-audio', {
        body: { storyId: formData.id }
      });

      if (error) throw error;

      console.log('Audio generation started:', data);
      
      // Refresh the story data to get the updated audio URL
      if (refetchStory) {
        await refetchStory();
      }
      
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return {
    formData,
    isLoadingStory,
    isGeneratingAudio,
    refetchStory,
    handleInputChange,
    handlePhotoUpload,
    handlePhotoRemove,
    handleVideoUpload,
    handleVideoRemove,
    handleVoiceChange,
    handleGenerateAudio
  };
};
