
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UnifiedStoryDashboard from './UnifiedStoryDashboard';
import { AudioButton } from '@/components/AudioButton';
import { UniversalAudioControls } from '@/components/UniversalAudioControls';
import { useStoryFormState } from '@/hooks/useStoryFormState';
import { useStoryFormActions } from '@/hooks/useStoryFormActions';
import { useAdminSession } from '@/hooks/useAdminSession';
import { toast } from "sonner";

interface UnifiedStoryPageProps {
  mode: 'add' | 'update';
}

const UnifiedStoryPage: React.FC<UnifiedStoryPageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storyId = mode === 'update' ? id : undefined;
  const [showAudioControls, setShowAudioControls] = useState(false);

  console.log('🎯 UnifiedStoryPage: Rendering with mode:', mode);
  console.log('🎯 UnifiedStoryPage: URL id param:', id);
  console.log('🎯 UnifiedStoryPage: Computed storyId:', storyId);

  const {
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
    error: storyError
  } = useStoryFormState(storyId);

  const { handleStoryFormSave } = useAdminSession();
  
  const { handleSaveOnly, handleSubmit, isSaving } = useStoryFormActions(
    storyId,
    refetchStory,
    handleStoryFormSave
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

  const toggleAudioControls = () => {
    setShowAudioControls(!showAudioControls);
  };

  // Show error if we're in update mode but no ID is provided
  if (mode === 'update' && !id) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg text-red-600">Error: No story ID provided for update mode</div>
      </div>
    );
  }

  // Show error if story fetch failed
  if (storyError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg text-red-600">Error loading story: {storyError}</div>
      </div>
    );
  }

  if (isLoadingStory) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading story...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Add / Edit Stories & WebText
          </h1>
          
          {/* Peppermint Candy Audio Button */}
          <AudioButton
            code={formData.story_code || ''}
            onClick={toggleAudioControls}
            className="ml-4"
          />
        </div>
        
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
          onGenerateAudio={handleGenerateAudio}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          onSaveOnly={onSaveOnly}
          allowTextToSpeech={true}
          context="unified-story-system"
          onStoryFound={populateFormWithStory}
        />
      </div>
      
      {/* Universal Audio Controls Popup */}
      {showAudioControls && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Audio Controls</h3>
              <button 
                onClick={() => setShowAudioControls(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <UniversalAudioControls
              content={formData.content || ''}
              title={formData.title || ''}
              allowTextToSpeech={true}
              size="lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedStoryPage;
