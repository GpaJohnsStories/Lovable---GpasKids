
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import RichTextEditor from "../RichTextEditor";
import StoryFormFields from "../StoryFormFields";
import StoryPhotoUpload from "../StoryPhotoUpload";
import StoryFormActions from "../StoryFormActions";
import { useStoryForm } from './useStoryForm';

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
  published: string;
}

interface StoryFormContainerProps {
  story?: Story;
  onSave: () => void;
  onCancel: () => void;
}

const StoryFormContainer: React.FC<StoryFormContainerProps> = ({ story, onSave, onCancel }) => {
  const {
    formData,
    isLoading,
    handleInputChange,
    handlePhotoUpload,
    handlePhotoRemove,
    handleSubmit
  } = useStoryForm(story, onSave);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-800">
          {story ? 'Edit Story' : 'Create New Story'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <StoryFormFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <div>
            <Label htmlFor="content">Story Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => handleInputChange('content', content)}
              placeholder="Write your story here..."
            />
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-4 block">Story Photos</Label>
            <StoryPhotoUpload
              photoUrls={{
                photo_link_1: formData.photo_link_1,
                photo_link_2: formData.photo_link_2,
                photo_link_3: formData.photo_link_3,
              }}
              onPhotoUpload={handlePhotoUpload}
              onPhotoRemove={handlePhotoRemove}
            />
          </div>

          <StoryFormActions 
            isLoading={isLoading} 
            onCancel={onCancel} 
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default StoryFormContainer;
