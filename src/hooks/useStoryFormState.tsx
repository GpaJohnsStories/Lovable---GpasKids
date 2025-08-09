
import { useState, useEffect, useCallback } from 'react';
import { useStoryData } from '@/hooks/useStoryData';
import { supabase } from "@/integrations/supabase/client";

export interface Story {
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
  ai_voice_name: string;
  ai_voice_model: string;
  copyright_status?: string;
  audio_url?: string;
  created_at?: string;
  updated_at?: string;
  audio_generated_at?: string;
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
  ai_voice_model: 'tts-1',
  copyright_status: '©'
};

export const useStoryFormState = (storyId?: string, skipDataFetch = false) => {
  const [formData, setFormData] = useState<Story>(initialFormData);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState<string | undefined>(storyId);
  const { story, isLoading: isLoadingStory, refetch: refetchStory, error } = useStoryData(skipDataFetch ? undefined : currentStoryId);

  const populateFormWithStory = useCallback((storyData: Story, fromCodeLookup = false) => {
    console.log('🎯 useStoryFormState: Populating form with story data:', storyData, 'fromCodeLookup:', fromCodeLookup);
    setFormData({
      ...storyData,
      ai_voice_name: storyData.ai_voice_name || 'Nova',
      ai_voice_model: storyData.ai_voice_model || 'tts-1',
      copyright_status: storyData.copyright_status || '©'
    });
    
    // If this is from a code lookup, update the current story ID so refetchStory works
    if (fromCodeLookup && storyData.id) {
      setCurrentStoryId(storyData.id);
    }
  }, []);

  console.log('🎯 useStoryFormState: Hook called with storyId:', storyId);
  console.log('🎯 useStoryFormState: Story data:', story);
  console.log('🎯 useStoryFormState: Loading state:', isLoadingStory);

  // Load story data into form when it's fetched
  useEffect(() => {
    if (story) {
      console.log('🎯 useStoryFormState: Loading story data into form:', story);
      setFormData({
        ...story,
        ai_voice_name: story.ai_voice_name || 'Nova',
        ai_voice_model: story.ai_voice_model || 'tts-1',
        copyright_status: story.copyright_status || '©'
      });
    } else if (!storyId) {
      console.log('🎯 useStoryFormState: No storyId provided, using initial form data');
      setFormData(initialFormData);
    }
  }, [story, storyId]);

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
    console.log('🎯 useStoryFormState: Starting audio generation for story:', formData.id);
    
    if (!formData.id) {
      throw new Error('Story must be saved before generating audio. Please save your story first.');
    }
    
    if (!formData.content?.trim()) {
      throw new Error('Story content is required to generate audio.');
    }
    
    setIsGeneratingAudio(true);
    
    try {
      // First ensure the voice selection is saved to the database
      const { error: updateError } = await supabase
        .from('stories')
        .update({
          ai_voice_name: formData.ai_voice_name || 'Nova',
          ai_voice_model: formData.ai_voice_model || 'tts-1'
        })
        .eq('id', formData.id);

      if (updateError) {
        console.error('🎯 useStoryFormState: Error updating voice settings:', updateError);
        throw new Error(`Failed to update voice settings: ${updateError.message}`);
      }

      console.log('🎯 useStoryFormState: Calling generate-story-audio with:', {
        storyId: formData.id,
        voiceName: formData.ai_voice_name || 'Nova'
      });

      const { data, error } = await supabase.functions.invoke('generate-story-audio', {
        body: { 
          storyId: formData.id,
          voiceName: formData.ai_voice_name || 'Nova'
        }
      });

      if (error) {
        console.error('🎯 useStoryFormState: Edge function error:', error);
        throw new Error(`Audio generation failed: ${error.message}`);
      }

      console.log('🎯 useStoryFormState: Audio generation response:', data);
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      // Refresh the story data to get the updated audio URL
      if (refetchStory) {
        await refetchStory();
      }
      
    } catch (error) {
      console.error('🎯 useStoryFormState: Error generating audio:', error);
      throw error;
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return {
    formData,
    isLoadingStory,
    isGeneratingAudio,
    refetchStory,
    populateFormWithStory,
    handleInputChange,
    handlePhotoUpload,
    handlePhotoRemove,
    handleVideoUpload,
    handleVideoRemove,
    handleVoiceChange,
    handleGenerateAudio,
    error
  };
};
