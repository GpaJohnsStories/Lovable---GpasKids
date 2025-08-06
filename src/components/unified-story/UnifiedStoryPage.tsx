
import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Volume2 } from 'lucide-react';
import UnifiedStoryDashboard from './UnifiedStoryDashboard';
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {pageTitle}
          </h1>
          
          {/* Red Candy Audio Button */}
          <button
            type="button"
            onClick={onGenerateAudio}
            disabled={isGeneratingAudio || !formData.content?.trim()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3 text-lg disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: isGeneratingAudio || !formData.content?.trim() 
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                : 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
              boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
            }}
          >
            <Volume2 className="h-6 w-6" />
            {isGeneratingAudio ? 'Generating...' : 'Generate Audio'}
          </button>
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
