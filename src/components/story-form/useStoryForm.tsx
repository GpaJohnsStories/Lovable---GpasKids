
import { useState, useEffect } from 'react';
import { handleStorySubmission } from './StoryFormSubmission';

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers";
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

export const useStoryForm = (story?: Story, onSave?: () => void) => {
  const [formData, setFormData] = useState<Story>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await handleStorySubmission(formData, story, onSave);
    } catch (error) {
      // Error is already handled in handleStorySubmission
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handlePhotoUpload,
    handlePhotoRemove,
    handleVideoUpload,
    handleVideoRemove,
    handleSubmit
  };
};
