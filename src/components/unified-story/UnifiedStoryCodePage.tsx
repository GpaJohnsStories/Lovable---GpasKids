import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedStoryCodeField from "@/components/story-form/EnhancedStoryCodeField";
import UnifiedStoryDashboard from './UnifiedStoryDashboard';
import { AudioButton } from '@/components/AudioButton';
import { UniversalAudioControls } from '@/components/UniversalAudioControls';
import { useStoryFormState } from '@/hooks/useStoryFormState';
import { useStoryFormActions } from '@/hooks/useStoryFormActions';
import { useAdminSession } from '@/hooks/useAdminSession';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';

const UnifiedStoryCodePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codeParam = searchParams.get('code');
  
  const [mode, setMode] = useState<'code-entry' | 'editing'>('code-entry');
  const [storyCode, setStoryCode] = useState(codeParam || '');
  const [currentStoryId, setCurrentStoryId] = useState<string | undefined>();
  const [showAudioControls, setShowAudioControls] = useState(false);

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
  } = useStoryFormState(currentStoryId);

  const { handleStoryFormSave } = useAdminSession();
  const { lookupStoryByCode } = useStoryCodeLookup();
  
  const { handleSaveOnly, handleSubmit, isSaving } = useStoryFormActions(
    currentStoryId,
    refetchStory,
    handleStoryFormSave
  );

  // Pre-fill story code and auto-trigger lookup if provided in URL
  React.useEffect(() => {
    if (codeParam && codeParam !== storyCode) {
      setStoryCode(codeParam);
      // Automatically trigger story lookup and bypass code entry form
      const performAutoLookup = async () => {
        console.log('🔧 UnifiedStoryCodePage: Auto-looking up story with code:', codeParam);
        const story = await lookupStoryByCode(codeParam, true); // Silent mode
        if (story) {
          console.log('🎯 UnifiedStoryCodePage: Auto-found existing story:', story.id, story.title);
          handleStoryFound(story);
        } else {
          console.log('🎯 UnifiedStoryCodePage: Auto-creating new story with code:', codeParam);
          handleConfirmNew();
        }
      };
      performAutoLookup();
    }
  }, [codeParam]); // Removed problematic dependencies

  const handleStoryCodeChange = async (code: string) => {
    setStoryCode(code);
    
    // Update form data with the story code
    if (mode === 'editing') {
      handleInputChange('story_code', code);
    }
  };

  const handleStoryFound = (story: any) => {
    console.log('🎯 UnifiedStoryCodePage: Loading existing story:', story.id, story.title);
    setCurrentStoryId(story.id);
    setMode('editing');
    
    // Update URL to include the story code
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('code', storyCode);
    window.history.replaceState({}, '', newUrl);
  };

  const handleConfirmNew = () => {
    console.log('🎯 UnifiedStoryCodePage: Creating new story with code:', storyCode);
    setCurrentStoryId(undefined);
    setMode('editing');
    
    // Set the story code in form data for new stories
    handleInputChange('story_code', storyCode);
    
    // Update URL to include the story code
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('code', storyCode);
    window.history.replaceState({}, '', newUrl);
  };

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

  if (isLoadingStory) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading story...</div>
      </div>
    );
  }

  if (mode === 'code-entry') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-orange-800">
              Story Management
            </CardTitle>
            <CardDescription className="text-lg">
              Enter a story code to edit an existing story or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <EnhancedStoryCodeField
                  value={storyCode}
                  onChange={handleStoryCodeChange}
                  onStoryFound={handleStoryFound}
                  onConfirmNew={handleConfirmNew}
                />
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 underline"
              >
                Back to Admin Stories
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pageTitle = currentStoryId 
    ? `Edit "${formData.title || 'Untitled Story'}"` 
    : `Create New Story (${storyCode})`;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {pageTitle}
          </h1>
          
          {/* Peppermint Candy Audio Button */}
          <AudioButton
            code={formData.story_code || storyCode}
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
          hideStoryCodeField={true}
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

export default UnifiedStoryCodePage;