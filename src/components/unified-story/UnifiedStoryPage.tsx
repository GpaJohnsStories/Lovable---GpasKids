
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UnifiedStoryDashboard from './UnifiedStoryDashboard';
import { AudioButton } from '@/components/AudioButton';
import { SuperAV } from '@/components/SuperAV';
import { useStoryFormState } from '@/hooks/useStoryFormState';
import { useStoryFormActions } from '@/hooks/useStoryFormActions';
import { useAdminSession } from '@/hooks/useAdminSession';
import { toast } from "sonner";
import { FileText, Save, X } from 'lucide-react';

interface UnifiedStoryPageProps {
  mode: 'add' | 'update';
}

const UnifiedStoryPage: React.FC<UnifiedStoryPageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storyId = mode === 'update' ? id : undefined;
  const [showSuperAV, setShowSuperAV] = useState(false);
  const [fontSize, setFontSize] = useState(16);

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
    handleStartNew,
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
    setShowSuperAV(!showSuperAV);
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
        <div className="flex items-center justify-between mb-4">
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
        
        {/* Action Buttons Box */}
        <div className="mb-6 p-4 border-[3px] border-[#16a34a] bg-green-50 rounded-lg">
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={handleStartNew}
              className="flex-none text-sm h-10 px-4 text-white bg-blue-600 border-blue-700 hover:bg-blue-700 rounded-md border flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Start New
            </button>
            
            <button 
              type="button" 
              onClick={onSaveOnly}
              disabled={isSaving}
              className="flex-1 text-sm h-10 px-4 text-white bg-green-600 border-green-700 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md border flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Details & Text Before Audio'}
            </button>
            
            <button 
              type="button" 
              onClick={handleCancel}
              className="flex-none text-sm h-10 px-4 text-white bg-red-600 border-red-700 hover:bg-red-700 rounded-md border flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              Exit
            </button>
          </div>
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
          onStartNew={handleStartNew}
          allowTextToSpeech={true}
          context="unified-story-system"
          onStoryFound={(story) => populateFormWithStory(story, true)}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
      </div>
      
      {/* SuperAV Player */}
      {showSuperAV && (
        <SuperAV
          isOpen={showSuperAV}
          onClose={() => setShowSuperAV(false)}
          title={formData.title || 'Story'}
          author={formData.author}
          voiceName={formData.ai_voice_name}
          showAuthor={true}
          audioUrl={formData.audio_url}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
      )}
    </div>
  );
};

export default UnifiedStoryPage;
