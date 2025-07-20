
import React from 'react';
import { useStoryFormState } from '@/hooks/useStoryFormState';
import { useStoryFormActions } from '@/hooks/useStoryFormActions';
import StoryFormContent from './StoryFormContent';
import { toast } from "sonner";

interface SimpleStoryFormProps {
  storyId?: string;
  onSave: () => void;
  onCancel: () => void;
}

const SimpleStoryForm: React.FC<SimpleStoryFormProps> = ({ storyId, onSave, onCancel }) => {
  const {
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
  } = useStoryFormState(storyId);

  const { handleSaveOnly, handleSubmit, isSaving } = useStoryFormActions(
    storyId,
    refetchStory,
    onSave
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  const onSaveOnly = async () => {
    await handleSaveOnly(formData);
  };

  const onGenerateAudio = async () => {
    try {
      await handleGenerateAudio();
      toast.success("Audio generation started! Check back in a few moments.");
    } catch (error) {
      toast.error("Failed to generate audio. Please try again.");
    }
  };

  if (isLoadingStory) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading story...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {storyId ? 'Edit Story' : 'Create New Story'}
        </h1>
        
        <StoryFormContent
          formData={formData}
          isSaving={isSaving}
          isGeneratingAudio={isGeneratingAudio}
          onInputChange={handleInputChange}
          onPhotoUpload={handlePhotoUpload}
          onPhotoRemove={handlePhotoRemove}
          onVideoUpload={handleVideoUpload}
          onVideoRemove={handleVideoRemove}
          onVoiceChange={handleVoiceChange}
          onGenerateAudio={onGenerateAudio}
          onSubmit={onSubmit}
          onCancel={onCancel}
          onSaveOnly={onSaveOnly}
        />

        {formData.audio_url && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-green-800 font-medium mb-2">Audio Version Available</h3>
            <audio controls className="w-full">
              <source src={formData.audio_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleStoryForm;
