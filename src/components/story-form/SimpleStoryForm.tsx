
import React from 'react';
import { useStoryFormState } from '@/hooks/useStoryFormState';
import { useStoryFormActions } from '@/hooks/useStoryFormActions';
import StoryFormContent from './StoryFormContent';
import { toast } from "sonner";
import { Volume2 } from 'lucide-react';

interface SimpleStoryFormProps {
  storyId?: string;
  onSave: () => void;
  onCancel: () => void;
  allowTextToSpeech?: boolean;
  context?: string;
}

const SimpleStoryForm: React.FC<SimpleStoryFormProps> = ({ 
  storyId, 
  onSave, 
  onCancel, 
  allowTextToSpeech = false,
  context = "default"
}) => {
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
      toast.success("Audio generation started! Check back in a few moments.", {
        duration: 5000,
      });
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {storyId ? 'Edit Story' : 'Create New Story'}
          </h1>
          {formData.audio_url && (
            <div className="flex items-center text-green-600 text-sm font-medium">
              <Volume2 className="h-4 w-4 mr-1" />
              Audio Available
            </div>
          )}
        </div>
        
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
          allowTextToSpeech={allowTextToSpeech}
          context={context}
        />
      </div>
    </div>
  );
};

export default SimpleStoryForm;
