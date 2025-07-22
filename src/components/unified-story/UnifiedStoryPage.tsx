
import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UnifiedStoryDashboard from './UnifiedStoryDashboard';
import { useStoryFormState } from '@/hooks/useStoryFormState';
import { useStoryFormActions } from '@/hooks/useStoryFormActions';
import { toast } from "sonner";

interface UnifiedStoryPageProps {
  mode: 'add' | 'update';
}

const UnifiedStoryPage: React.FC<UnifiedStoryPageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storyId = mode === 'update' ? id : undefined;

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
    () => {
      toast.success("Story saved successfully!");
      navigate('/buddys_admin/stories');
    }
  );

  const handleCancel = () => {
    navigate('/buddys_admin/stories');
  };

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

  const pageTitle = mode === 'add' ? 'Add New Story' : `Edit "${formData.title || 'Untitled Story'}"`;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {pageTitle}
        </h1>
        
        <UnifiedStoryDashboard
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
          onCancel={handleCancel}
          onSaveOnly={onSaveOnly}
          allowTextToSpeech={true}
          context="unified-story-system"
        />
      </div>
    </div>
  );
};

export default UnifiedStoryPage;
