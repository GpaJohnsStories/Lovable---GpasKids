import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X, FileText, Image, Video, Volume2 } from "lucide-react";
import StoryFormFields from "../StoryFormFields";
import StoryPhotoUpload from "../StoryPhotoUpload";
import StoryVideoUpload from "../StoryVideoUpload";
import VoiceSelection from "../story-form/VoiceSelection";
import AudioUploadSection from "./AudioUploadSection";
import SplitViewEditor from "../editor/SplitViewEditor";
import { UniversalAudioControls } from "../UniversalAudioControls";
import { StackedAudioControls } from "./StackedAudioControls";
import type { Story } from '@/hooks/useStoryFormState';

interface UnifiedStoryDashboardProps {
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
  allowTextToSpeech?: boolean;
  context?: string;
}

const UnifiedStoryDashboard: React.FC<UnifiedStoryDashboardProps> = ({
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
  onSaveOnly,
  allowTextToSpeech = false,
  context = "unified-story-system"
}) => {
  console.log('🎯 UnifiedStoryDashboard: Rendering with formData:', {
    id: formData.id,
    title: formData.title,
    hasAudio: !!formData.audio_url,
    aiVoiceName: formData.ai_voice_name
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Story Details Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Story Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StoryFormFields 
                  formData={formData} 
                  onInputChange={onInputChange}
                  compact={true}
                />
              </CardContent>
            </Card>

            {/* Right Column - Publication Settings and Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Publication Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Publication Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <select
                        id="published"
                        value={formData.published}
                        onChange={(e) => onInputChange('published', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="N">Not Published</option>
                        <option value="Y">Published</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="google_drive_link">Google Drive Link</Label>
                      <input
                        id="google_drive_link"
                        type="url"
                        value={formData.google_drive_link}
                        onChange={(e) => onInputChange('google_drive_link', e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onSaveOnly}
                      disabled={isSaving}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Draft (Ctrl+S)'}
                    </Button>
                    
                    <Button 
                      type="submit" 
                      disabled={isSaving || isGeneratingAudio} 
                      className="w-full cozy-button"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save & Return to List'}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onCancel}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Story Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Story Content</CardTitle>
            </CardHeader>
            <CardContent>
              <SplitViewEditor
                content={formData.content}
                onChange={(content) => onInputChange('content', content)}
                placeholder="Write your story here..."
                onSave={onSaveOnly}
                category={formData.category}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          {/* Photos Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Story Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Audio Section - New Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Voice Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  AI Voice Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceSelection
                  selectedVoice={formData.ai_voice_name || 'Nova'}
                  onVoiceChange={onVoiceChange || (() => {})}
                  isRecording={isGeneratingAudio}
                  onStartRecording={onGenerateAudio}
                  onStopRecording={undefined}
                  storyContent={formData.content}
                  storyTitle={formData.title}
                />
              </CardContent>
            </Card>

            {/* Stacked Audio Controls */}
            {formData.audio_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Audio Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StackedAudioControls
                    audioUrl={formData.audio_url}
                    title={formData.title || 'Story Audio'}
                    content={formData.content}
                    author={formData.author}
                    allowTextToSpeech={allowTextToSpeech}
                    context={context}
                    aiVoiceName={formData.ai_voice_name || 'Nova'}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Audio Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AudioUploadSection
                audioUrl={formData.audio_url}
                onAudioUpload={(url) => onInputChange('audio_url', url)}
                onAudioRemove={() => onInputChange('audio_url', '')}
              />
            </CardContent>
          </Card>

          {/* Video Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Story Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StoryVideoUpload
                videoUrl={formData.video_url}
                onVideoUpload={onVideoUpload}
                onVideoRemove={onVideoRemove}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default UnifiedStoryDashboard;
