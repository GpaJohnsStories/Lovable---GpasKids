import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoryFormState } from '@/hooks/useStoryFormState';
import { useStoryFormActions } from '@/hooks/useStoryFormActions';
import StoryFormContent from './StoryFormContent';

interface SimpleStoryFormProps {
  storyId?: string;
  onSave: () => void;
  onCancel: () => void;
}

const SimpleStoryForm: React.FC<SimpleStoryFormProps> = ({ storyId, onSave, onCancel }) => {
  const {
    formData,
    isLoadingStory,
    refetchStory,
    handleInputChange,
    handlePhotoUpload,
    handlePhotoRemove,
    handleVideoUpload,
    handleVideoRemove
  } = useStoryFormState(storyId);

  const { handleSaveOnly, handleSubmit, isSaving } = useStoryFormActions(
    storyId,
    refetchStory,
    onSave
  );

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  const onSaveOnlyHandler = async () => {
    await handleSaveOnly(formData);
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
        <StoryFormContent
          formData={formData}
          isSaving={isSaving}
          onInputChange={handleInputChange}
          onPhotoUpload={handlePhotoUpload}
          onPhotoRemove={handlePhotoRemove}
          onVideoUpload={handleVideoUpload}
          onVideoRemove={handleVideoRemove}
          onSubmit={onSubmitHandler}
          onCancel={onCancel}
          onSaveOnly={onSaveOnlyHandler}
        />
      </CardContent>
    </Card>
  );
};

export default SimpleStoryForm;