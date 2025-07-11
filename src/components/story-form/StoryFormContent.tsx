import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import SplitViewEditor from "../editor/SplitViewEditor";
import StoryFormFields from "../StoryFormFields";
import StoryPhotoUpload from "../StoryPhotoUpload";
import StoryVideoUpload from "../StoryVideoUpload";
import type { Story } from '@/hooks/useStoryFormState';

interface StoryFormContentProps {
  formData: Story;
  isSaving: boolean;
  onInputChange: (field: keyof Story, value: string) => void;
  onPhotoUpload: (photoNumber: 1 | 2 | 3, url: string) => void;
  onPhotoRemove: (photoNumber: 1 | 2 | 3) => void;
  onVideoUpload: (url: string) => void;
  onVideoRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onSaveOnly: () => void;
}

const StoryFormContent: React.FC<StoryFormContentProps> = ({
  formData,
  isSaving,
  onInputChange,
  onPhotoUpload,
  onPhotoRemove,
  onVideoUpload,
  onVideoRemove,
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

      <div>
        <Label htmlFor="content">Story Content *</Label>
        <SplitViewEditor
          content={formData.content}
          onChange={(content) => onInputChange('content', content)}
          placeholder="Write your story here..."
          onSave={onSaveOnly}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSaving} 
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