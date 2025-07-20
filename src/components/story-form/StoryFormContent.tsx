
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X, Mic } from "lucide-react";
import SplitViewEditor from "../editor/SplitViewEditor";
import StoryFormFields from "../StoryFormFields";
import StoryPhotoUpload from "../StoryPhotoUpload";
import StoryVideoUpload from "../StoryVideoUpload";
import VoiceSelection from "./VoiceSelection";
import type { Story } from '@/hooks/useStoryFormState';

interface StoryFormContentProps {
  formData: Story;
  isSaving: boolean;
  isGeneratingAudio?: boolean;
  onInputChange: (field: keyof Story, value: string) => void;
  onPhotoUpload: (photoNumber: 1 | 2 | 3, url: string) => void;
  onPhotoRemove: (photoNumber: 1 | 2 | 3) => void;
  onVideoUpload: (url: string) => void;
  onVideoRemove: () => void;
  onVoiceChange?: (voice: string) => void;
  onGenerateAudio?: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onSaveOnly: () => void;
}

const StoryFormContent: React.FC<StoryFormContentProps> = ({
  formData,
  isSaving,
  isGeneratingAudio = false,
  onInputChange,
  onPhotoUpload,
  onPhotoRemove,
  onVideoUpload,
  onVideoRemove,
  onVoiceChange,
  onGenerateAudio,
  onSubmit,
  onCancel,
  onSaveOnly
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <StoryFormFields 
        formData={formData} 
        onInputChange={onInputChange} 
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
          onPhotoUpload={onPhotoUpload}
          onPhotoRemove={onPhotoRemove}
          onAltTextChange={onInputChange}
        />
      </div>

      <div>
        <StoryVideoUpload
          videoUrl={formData.video_url}
          onVideoUpload={onVideoUpload}
          onVideoRemove={onVideoRemove}
        />
      </div>

      {onVoiceChange && (
        <div>
          <VoiceSelection
            selectedVoice={formData.ai_voice_name || 'Nova'}
            onVoiceChange={onVoiceChange}
            isRecording={isGeneratingAudio}
            onStartRecording={formData.id ? onGenerateAudio : undefined}
            onStopRecording={undefined}
          />
          {!formData.id && (
            <p className="text-sm text-amber-600 mt-2">
              💡 Save the story first to generate audio version
            </p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="content">Story Content *</Label>
        <SplitViewEditor
          content={formData.content}
          onChange={(content) => onInputChange('content', content)}
          placeholder="Write your story here..."
          onSave={onSaveOnly}
          category={formData.category}
        />
      </div>

      <div className="flex justify-center space-x-4">
        {onGenerateAudio && formData.id && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onGenerateAudio}
            disabled={isGeneratingAudio || isSaving}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <Mic className="h-4 w-4 mr-2" />
            {isGeneratingAudio ? 'Generating Audio...' : 'Generate Audio'}
          </Button>
        )}
        
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        
        <Button 
          type="submit" 
          disabled={isSaving || isGeneratingAudio} 
          className="cozy-button"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Story & Return to Story List'}
        </Button>
      </div>
    </form>
  );
};

export default StoryFormContent;
