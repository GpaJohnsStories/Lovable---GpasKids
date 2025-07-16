
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SplitViewEditor from "../editor/SplitViewEditor";
import StoryFormFields from "../StoryFormFields";
import StoryPhotoUpload from "../StoryPhotoUpload";
import StoryVideoUpload from "../StoryVideoUpload";
import StoryFormActions from "../StoryFormActions";
import { useStoryForm } from './useStoryForm';

interface Story {
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
}

interface StoryFormContainerProps {
  story?: Story;
  onSave: () => void;
  onCancel: () => void;
}

const StoryFormContainer: React.FC<StoryFormContainerProps> = ({ story, onSave, onCancel }) => {
  console.log('=== StoryFormContainer RENDERING ===', { story: story?.id, onSave, onCancel });
  console.log('=== STORY FORM CONTAINER LOADED - DEBUGGING ACTIVE ===');
  console.log('=== Props received:', { story, onSave: typeof onSave, onCancel: typeof onCancel });
  
  const {
    formData,
    isLoading,
    handleInputChange,
    handlePhotoUpload,
    handlePhotoRemove,
    handleVideoUpload,
    handleVideoRemove,
    handleSubmit
  } = useStoryForm(story, onSave);

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-800">
          {story ? 'Edit Story' : 'Create New Story'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={(e) => {
            console.log('=== FORM SUBMIT EVENT TRIGGERED ===', e);
            console.log('=== handleSubmit function:', typeof handleSubmit);
            console.log('=== formData:', formData);
            handleSubmit(e);
          }} 
          className="space-y-6"
          onLoad={() => console.log('=== FORM LOADED ===')}
        >
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
