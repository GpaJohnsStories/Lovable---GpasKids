import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X, FileText, Image, Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StoryFormFields from "../StoryFormFields";
import StoryPhotoUpload from "../StoryPhotoUpload";
import StoryVideoUpload from "../StoryVideoUpload";
import VoiceSelection from "../story-form/VoiceSelection";
import AudioUploadSection from "./AudioUploadSection";
import { StackedAudioControls } from "./StackedAudioControls";
import SplitViewEditor from "../editor/SplitViewEditor";

interface UnifiedStoryData {
  id?: string;
  title: string;
  author: string;
  content: string;
  excerpt: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText";
  subcategory: string;
  age_group: string;
  reading_time: number;
  photo_one_url?: string;
  photo_two_url?: string;
  photo_three_url?: string;
  video_url?: string;
  audio_url?: string;
  ai_voice_name?: string;
  copyright_status: string;
  submitted_at?: string;
  approved_at?: string;
  view_count?: number;
  story_status: string;
  approval_status: string;
  notes?: string;
  version?: number;
  personal_id?: string;
  story_code: string;
  tagline: string;
  published: string;
}

interface UnifiedStoryDashboardProps {
  formData: UnifiedStoryData;
  onInputChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSaveOnly?: () => void;
  onCancel?: () => void;
  onPhotoUpload?: (photoNumber: number, url: string) => void;
  onPhotoRemove?: (photoNumber: number) => void;
  onVideoUpload?: (url: string) => void;
  onVideoRemove?: () => void;
  onGenerateAudio?: () => void;
  onVoiceChange?: (voice: string) => void;
  isGeneratingAudio?: boolean;
  context?: string;
}

const UnifiedStoryDashboard: React.FC<UnifiedStoryDashboardProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onSaveOnly,
  onCancel,
  onPhotoUpload,
  onPhotoRemove,
  onVideoUpload,
  onVideoRemove,
  onGenerateAudio,
  onVoiceChange,
  isGeneratingAudio = false,
  context = 'create'
}) => {
  console.log('🎯 UnifiedStoryDashboard: Rendering with formData:', {
    id: formData.id,
    title: formData.title,
    hasAudio: !!formData.audio_url,
    aiVoiceName: formData.ai_voice_name
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Two Column Layout */}
        <div className="flex gap-6">
          {/* Left Column - Story Details - 45% width */}
          <div className="w-[45%] space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Story Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StoryFormFields 
                  formData={{
                    title: formData.title,
                    author: formData.author,
                    category: formData.category,
                    tagline: formData.tagline,
                    excerpt: formData.excerpt,
                    story_code: formData.story_code || '',
                    published: formData.published
                  }} 
                  onInputChange={onInputChange}
                  compact={true}
                />
              </CardContent>
            </Card>

            {/* Story Photos Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Image className="h-4 w-4" />
                  Story Photos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <StoryPhotoUpload
                  photoUrls={{
                    photo_link_1: formData.photo_one_url || '',
                    photo_link_2: formData.photo_two_url || '',
                    photo_link_3: formData.photo_three_url || ''
                  }}
                  photoAlts={{
                    photo_alt_1: '',
                    photo_alt_2: '',
                    photo_alt_3: ''
                  }}
                  onPhotoUpload={(photoNumber: 1 | 2 | 3, url: string) => {
                    const fieldMap = {
                      1: 'photo_one_url',
                      2: 'photo_two_url',
                      3: 'photo_three_url'
                    };
                    onInputChange?.(fieldMap[photoNumber], url);
                  }}
                  onPhotoRemove={(photoNumber: 1 | 2 | 3) => {
                    const fieldMap = {
                      1: 'photo_one_url',
                      2: 'photo_two_url',
                      3: 'photo_three_url'
                    };
                    onInputChange?.(fieldMap[photoNumber], '');
                  }}
                  onAltTextChange={(field: string, value: string) => {
                    // Handle alt text changes if needed
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Voice & Media - 55% width */}
          <div className="w-[55%] space-y-4">
            {/* Voice Previews Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Volume2 className="h-4 w-4" />
                  Voice Previews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-center block">MALE</Label>
                    <div className="space-y-1">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="w-full h-6 text-xs font-bold"
                        onClick={() => onVoiceChange?.('Tate')}
                      >
                        Tate
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="w-full h-6 text-xs font-bold"
                        onClick={() => onVoiceChange?.('Jeremy')}
                      >
                        Jeremy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-center block">FEMALE</Label>
                    <div className="space-y-1">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="w-full h-6 text-xs font-bold"
                        onClick={() => onVoiceChange?.('Nova')}
                      >
                        Nova
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="w-full h-6 text-xs font-bold"
                        onClick={() => onVoiceChange?.('Luma')}
                      >
                        Luma
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-center block">CHILD</Label>
                    <div className="space-y-1">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="w-full h-6 text-xs font-bold"
                        onClick={() => onVoiceChange?.('Kelly')}
                      >
                        Kelly
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="w-full h-6 text-xs font-bold"
                        onClick={() => onVoiceChange?.('Matthew')}
                      >
                        Matthew
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Selected Voice</Label>
                    <Select value={formData.ai_voice_name || 'Nova'} onValueChange={(value) => onVoiceChange?.(value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nova">Nova (Female)</SelectItem>
                        <SelectItem value="Luma">Luma (Female)</SelectItem>
                        <SelectItem value="Tate">Tate (Male)</SelectItem>
                        <SelectItem value="Jeremy">Jeremy (Male)</SelectItem>
                        <SelectItem value="Kelly">Kelly (Child)</SelectItem>
                        <SelectItem value="Matthew">Matthew (Child)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="button"
                    onClick={onGenerateAudio}
                    disabled={!formData.content || isGeneratingAudio}
                    size="sm"
                    className="w-full"
                  >
                    {isGeneratingAudio ? 'Generating Audio...' : 'Generate AI Audio'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Audio Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Volume2 className="h-4 w-4" />
                  Audio Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StackedAudioControls
                  audioUrl={formData.audio_url}
                  title={formData.title || 'Story Audio'}
                  content={formData.content}
                  author={formData.author}
                  allowTextToSpeech={true}
                  context={context}
                  aiVoiceName={formData.ai_voice_name || 'Nova'}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Audio Upload */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Volume2 className="h-4 w-4" />
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
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Volume2 className="h-4 w-4" />
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
          </div>
        </div>

        {/* Full Width Story Content Editor Below Both Columns */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Story Content
              </CardTitle>
              <div className="flex gap-2">
                {onSaveOnly && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={onSaveOnly}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Draft
                  </Button>
                )}
                <Button type="submit" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  {context === 'edit' ? 'Update Story' : 'Submit Story'}
                </Button>
                {onCancel && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={onCancel}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
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
      </div>
    </form>
  );
};

export default UnifiedStoryDashboard;