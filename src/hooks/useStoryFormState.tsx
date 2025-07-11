import { useState, useEffect } from 'react';
import { useStoryData } from '@/hooks/useStoryData';

export interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "System" | "STORY";
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
  published: 'N'
};

export const useStoryFormState = (storyId?: string) => {
  const [formData, setFormData] = useState<Story>(initialFormData);
  const { story, isLoading: isLoadingStory, refetch: refetchStory } = useStoryData(storyId);

  // Load story data into form when it's fetched
  useEffect(() => {
    if (story) {
      setFormData(story);
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

  return {
    formData,
    isLoadingStory,
    refetchStory,
    handleInputChange,
    handlePhotoUpload,
    handlePhotoRemove,
    handleVideoUpload,
    handleVideoRemove
  };
};