import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import SplitViewEditor from "../editor/SplitViewEditor";
import StoryFormFields from "../StoryFormFields";
import StoryPhotoUpload from "../StoryPhotoUpload";
import StoryVideoUpload from "../StoryVideoUpload";
import { useStoryData } from '@/hooks/useStoryData';
import { useStorySave } from '@/hooks/useStorySave';

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

interface SimpleStoryFormProps {
  storyId?: string;
  onSave: () => void;
  onCancel: () => void;
}

const SimpleStoryForm: React.FC<SimpleStoryFormProps> = ({ storyId, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Story>(initialFormData);
  const { story, isLoading: isLoadingStory } = useStoryData(storyId);
  const { saveStory, isSaving } = useStorySave();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== FORM SUBMITTED ===');
    console.log('Form data at submission:', formData);
    console.log('Story ID:', storyId);
    console.log('onSave callback:', typeof onSave);
    
    try {
      console.log('About to call saveStory...');
      const success = await saveStory(formData, onSave);
      console.log('saveStory returned:', success);
      
      if (success) {
        console.log('=== SAVE SUCCESSFUL ===');
      } else {
        console.log('=== SAVE FAILED ===');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  if (isLoadingStory) {
    return (
      <Card className="w-full mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>Loading story...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-800">
          {storyId ? 'Edit Story' : 'Create New Story'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <StoryFormFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <div>
            <Label className="text-base font-medium text-gray-700 mb-4 block">Story Photos</Label>
            <StoryPhotoUpload
              photoUrls={{
                photo_link_1: formData.photo_link_1,
                photo_link_2: formData.photo_link_2,
                photo_link_3: formData.photo_link_3,
              }}
              photoAlts={{
                photo_alt_1: formData.photo_alt_1,
                photo_alt_2: formData.photo_alt_2,
                photo_alt_3: formData.photo_alt_3,
              }}
              onPhotoUpload={handlePhotoUpload}
              onPhotoRemove={handlePhotoRemove}
              onAltTextChange={handleInputChange}
            />
          </div>

          <div>
            <StoryVideoUpload
              videoUrl={formData.video_url}
              onVideoUpload={handleVideoUpload}
              onVideoRemove={handleVideoRemove}
            />
          </div>

          <div>
            <Label htmlFor="content">Story Content *</Label>
            <SplitViewEditor
              content={formData.content}
              onChange={(content) => handleInputChange('content', content)}
              placeholder="Write your story here..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving} 
              className="cozy-button"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Story'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleStoryForm;