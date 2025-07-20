
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X, Mic, Volume2 } from "lucide-react";
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
  console.log('🎯 StoryFormContent: Rendering with formData:', {
    id: formData.id,
    title: formData.title,
    hasAudio: !!formData.audio_url,
    aiVoiceName: formData.ai_voice_name
  });

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

      <div>
        <Label className="text-base font-medium text-gray-700 mb-4 block">AI Voice & Audio Generation</Label>
        <VoiceSelection
          selectedVoice={formData.ai_voice_name || 'Nova'}
          onVoiceChange={onVoiceChange || (() => {})}
          isRecording={isGeneratingAudio}
          onStartRecording={formData.id && onGenerateAudio ? onGenerateAudio : undefined}
          onStopRecording={undefined}
        />
        {!formData.id && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              💡 <strong>Audio Generation:</strong> Save the story first to enable audio generation
            </p>
          </div>
        )}
        {formData.audio_url && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-green-800 font-medium mb-2 flex items-center">
              <Volume2 className="h-4 w-4 mr-2" />
              Audio Version Available
            </h4>
            <audio controls className="w-full">
              <source src={formData.audio_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <p className="text-xs text-green-600 mt-2">
              Voice: {formData.ai_voice_name || 'Nova'}
            </p>
          </div>
        )}
      </div>

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
