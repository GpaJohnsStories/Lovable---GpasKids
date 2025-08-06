import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, X, FileText, Image, Video, Volume2, Play, Square } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StoryFormFields from "../StoryFormFields";
import StoryVideoUpload from "../StoryVideoUpload";
import AudioUploadSection from "./AudioUploadSection";
import SplitViewEditor from "../editor/SplitViewEditor";
import CopyrightControl from "../story-form/CopyrightControl";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateSampleTextForVoice, getCachedSampleText } from "@/utils/textUtils";
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
  hideStoryCodeField?: boolean;
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
  context = "unified-story-system",
  hideStoryCodeField = false
}) => {
  // Voice testing state
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Generate and cache sample text from story content
  useEffect(() => {
    generateSampleTextForVoice(formData.content, 200);
  }, [formData.content]);

  const playVoice = async (voiceId: string) => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        setCurrentlyPlaying(null);
      }

      setLoadingVoice(voiceId);
      console.log(`🎵 Testing voice: ${voiceId}`);

      const textToSpeak = getCachedSampleText();
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: textToSpeak,
          voice: voiceId.toLowerCase(),
          speed: 0.5  // 50% speed for testing
        }
      });

      if (error) {
        console.error('Voice generation error:', error);
        toast({
          title: "Voice Test Failed",
          description: error.message || "Failed to generate voice preview",
          variant: "destructive",
        });
        return;
      }

      if (!data?.audioContent) {
        console.error('No audio content returned');
        toast({
          title: "Voice Test Failed",
          description: "No audio content was generated",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Voice generated successfully');

      // Convert base64 to audio blob and play
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        console.error('Audio playback error');
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Playback Error",
          description: "Failed to play the generated audio",
          variant: "destructive",
        });
      };

      await audio.play();
      setCurrentAudio(audio);
      setCurrentlyPlaying(voiceId);

      toast({
        title: "Voice Preview",
        description: `Playing preview with ${voiceId} voice`,
      });

    } catch (error) {
      console.error('Voice test error:', error);
      toast({
        title: "Voice Test Error",
        description: "An unexpected error occurred while testing the voice",
        variant: "destructive",
      });
    } finally {
      setLoadingVoice(null);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentlyPlaying(null);
      setCurrentAudio(null);
    }
  };
  const getPublishedColor = (publishedStatus: string) => {
    switch (publishedStatus) {
      case 'Y':
        return 'text-white bg-green-600 border-green-700';
      case 'N':
        return 'text-white bg-red-600 border-red-700';
      default:
        return 'text-white bg-red-600 border-red-700';
    }
  };
  console.log('🎯 UnifiedStoryDashboard: Rendering with formData:', {
    id: formData.id,
    title: formData.title,
    hasAudio: !!formData.audio_url,
    aiVoiceName: formData.ai_voice_name
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex gap-6">
        {/* Story Details Card - 45% width */}
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
                formData={formData} 
                onInputChange={onInputChange}
                compact={true}
                context={context}
                hideStoryCodeField={hideStoryCodeField}
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
              <table className="w-full table-fixed border-collapse">
                <tbody>
                  {/* Photo Display Row */}
                  <tr>
                    <td className="p-2 border">
                      {formData.photo_link_1 ? (
                        <img src={formData.photo_link_1} alt="Photo 1" className="w-full h-20 object-cover rounded" />
                      ) : (
                        <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-xs">No Photo</div>
                      )}
                    </td>
                    <td className="p-2 border">
                      {formData.photo_link_2 ? (
                        <img src={formData.photo_link_2} alt="Photo 2" className="w-full h-20 object-cover rounded" />
                      ) : (
                        <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-xs">No Photo</div>
                      )}
                    </td>
                    <td className="p-2 border">
                      {formData.photo_link_3 ? (
                        <img src={formData.photo_link_3} alt="Photo 3" className="w-full h-20 object-cover rounded" />
                      ) : (
                        <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-xs">No Photo</div>
                      )}
                    </td>
                  </tr>
                  
                  {/* File Input Row */}
                  <tr>
                    <td className="p-2 border">
                      <input type="file" accept="image/*" className="w-full text-xs" />
                    </td>
                    <td className="p-2 border">
                      <input type="file" accept="image/*" className="w-full text-xs" />
                    </td>
                    <td className="p-2 border">
                      <input type="file" accept="image/*" className="w-full text-xs" />
                    </td>
                  </tr>
                  
                  {/* Alt Text Row */}
                  <tr>
                    <td className="p-2 border">
                      <input 
                        type="text" 
                        placeholder="Alt text" 
                        value={formData.photo_alt_1 || ''} 
                        onChange={(e) => onInputChange('photo_alt_1', e.target.value)}
                        className="w-full text-xs p-1 border rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <input 
                        type="text" 
                        placeholder="Alt text" 
                        value={formData.photo_alt_2 || ''} 
                        onChange={(e) => onInputChange('photo_alt_2', e.target.value)}
                        className="w-full text-xs p-1 border rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <input 
                        type="text" 
                        placeholder="Alt text" 
                        value={formData.photo_alt_3 || ''} 
                        onChange={(e) => onInputChange('photo_alt_3', e.target.value)}
                        className="w-full text-xs p-1 border rounded"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Audio Upload - Condensed */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Volume2 className="h-4 w-4" />
                Audio Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <AudioUploadSection
                audioUrl={formData.audio_url}
                onAudioUpload={(url) => onInputChange('audio_url', url)}
                onAudioRemove={() => onInputChange('audio_url', '')}
              />
            </CardContent>
          </Card>
        </div>

        {/* Settings & Actions Column - Uses remaining space */}
        <div className="flex-1 space-y-4">
          {/* Settings Card with side-by-side Copyright and Publication */}
          <Card className="h-fit">
            <CardContent className="space-y-3 pt-6">
              {/* Copyright Status and Publication Status side-by-side (switched positions) */}
              <div className="flex gap-3">
                {/* Copyright Status - Now on left */}
                <div className="space-y-1 flex-1">
                  <Label className="text-xs font-bold text-gray-700">Copyright Status</Label>
                  <CopyrightControl
                    value={formData.copyright_status || '©'}
                    onChange={(value) => onInputChange('copyright_status', value)}
                  />
                </div>
                
                {/* Publication Status - Now on right */}
                <div className="space-y-1 flex-1">
                  <Label htmlFor="published" className="text-xs font-bold text-gray-700">Publication Status</Label>
                  <Select value={formData.published} onValueChange={(value) => onInputChange('published', value)}>
                    <SelectTrigger className={`w-auto min-w-[140px] text-xs font-bold ${getPublishedColor(formData.published)}`}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white border shadow-lg">
                      <SelectItem value="N">Not Published</SelectItem>
                      <SelectItem value="Y">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Google Drive Link */}
              <div className="space-y-1">
                <Label htmlFor="google_drive_link" className="text-xs font-bold text-gray-700">Google Drive Link</Label>
                <input
                  id="google_drive_link"
                  type="url"
                  value={formData.google_drive_link}
                  onChange={(e) => onInputChange('google_drive_link', e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full p-2 text-xs border border-gray-300 rounded-md"
                />
              </div>

              {/* Save and Cancel Buttons */}
              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={isSaving || isGeneratingAudio} 
                  className="flex-1 text-xs h-8 text-white bg-green-600 border-green-700 hover:bg-green-700 rounded-md border flex items-center justify-center gap-1"
                >
                  <Save className="h-3 w-3" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                
                <button 
                  type="button" 
                  onClick={onCancel}
                  className="flex-1 text-xs h-8 text-white bg-red-600 border-red-700 hover:bg-red-700 rounded-md border flex items-center justify-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Voice Selection - Simple Table */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Volume2 className="h-4 w-4" />
                Voice Previews
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <table className="w-full table-fixed border-collapse">
                <tbody>
                  {/* Top Row - First 3 Voices */}
                  <tr>
                    <td className="p-2 border text-center">
                      <div className="text-xs font-bold mb-1">Nova</div>
                      <div className="text-xs text-gray-600 mb-2">Warm, friendly voice</div>
                       <div className="flex gap-1 justify-center">
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
                            onClick={() => currentlyPlaying === 'nova' ? stopAudio() : playVoice('nova')}
                            disabled={loadingVoice === 'nova'}
                          >
                           {loadingVoice === 'nova' ? (
                             <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                           ) : currentlyPlaying === 'nova' ? (
                             <Square className="h-3 w-3" />
                           ) : (
                             <Play className="h-3 w-3" />
                           )}
                           {loadingVoice === 'nova' ? 'Loading...' : currentlyPlaying === 'nova' ? 'Stop' : 'Test'}
                         </button>
                         <button 
                           type="button"
                           className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                           onClick={() => {
                             onVoiceChange?.('Nova');
                             onGenerateAudio?.();
                           }}
                         >
                           Use
                         </button>
                       </div>
                    </td>
                    <td className="p-2 border text-center">
                      <div className="text-xs font-bold mb-1">Alloy</div>
                      <div className="text-xs text-gray-600 mb-2">Clear, neutral voice</div>
                       <div className="flex gap-1 justify-center">
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
                            onClick={() => currentlyPlaying === 'alloy' ? stopAudio() : playVoice('alloy')}
                            disabled={loadingVoice === 'alloy'}
                          >
                           {loadingVoice === 'alloy' ? (
                             <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                           ) : currentlyPlaying === 'alloy' ? (
                             <Square className="h-3 w-3" />
                           ) : (
                             <Play className="h-3 w-3" />
                           )}
                           {loadingVoice === 'alloy' ? 'Loading...' : currentlyPlaying === 'alloy' ? 'Stop' : 'Test'}
                         </button>
                         <button 
                           type="button"
                           className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                           onClick={() => {
                             onVoiceChange?.('Alloy');
                             onGenerateAudio?.();
                           }}
                         >
                           Use
                         </button>
                       </div>
                    </td>
                    <td className="p-2 border text-center">
                      <div className="text-xs font-bold mb-1">Echo</div>
                      <div className="text-xs text-gray-600 mb-2">Deep, resonant voice</div>
                       <div className="flex gap-1 justify-center">
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
                            onClick={() => currentlyPlaying === 'echo' ? stopAudio() : playVoice('echo')}
                            disabled={loadingVoice === 'echo'}
                          >
                           {loadingVoice === 'echo' ? (
                             <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                           ) : currentlyPlaying === 'echo' ? (
                             <Square className="h-3 w-3" />
                           ) : (
                             <Play className="h-3 w-3" />
                           )}
                           {loadingVoice === 'echo' ? 'Loading...' : currentlyPlaying === 'echo' ? 'Stop' : 'Test'}
                         </button>
                         <button 
                           type="button"
                           className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                           onClick={() => {
                             onVoiceChange?.('Echo');
                             onGenerateAudio?.();
                           }}
                         >
                           Use
                         </button>
                       </div>
                    </td>
                  </tr>
                  
                  {/* Bottom Row - Next 3 Voices */}
                  <tr>
                    <td className="p-2 border text-center">
                      <div className="text-xs font-bold mb-1">Fable</div>
                      <div className="text-xs text-gray-600 mb-2">British accent, storytelling</div>
                       <div className="flex gap-1 justify-center">
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
                            onClick={() => currentlyPlaying === 'fable' ? stopAudio() : playVoice('fable')}
                            disabled={loadingVoice === 'fable'}
                          >
                           {loadingVoice === 'fable' ? (
                             <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                           ) : currentlyPlaying === 'fable' ? (
                             <Square className="h-3 w-3" />
                           ) : (
                             <Play className="h-3 w-3" />
                           )}
                           {loadingVoice === 'fable' ? 'Loading...' : currentlyPlaying === 'fable' ? 'Stop' : 'Test'}
                         </button>
                         <button 
                           type="button"
                           className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                           onClick={() => {
                             onVoiceChange?.('Fable');
                             onGenerateAudio?.();
                           }}
                         >
                           Use
                         </button>
                       </div>
                    </td>
                    <td className="p-2 border text-center">
                      <div className="text-xs font-bold mb-1">Onyx</div>
                      <div className="text-xs text-gray-600 mb-2">Deep, authoritative voice</div>
                       <div className="flex gap-1 justify-center">
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
                            onClick={() => currentlyPlaying === 'onyx' ? stopAudio() : playVoice('onyx')}
                            disabled={loadingVoice === 'onyx'}
                          >
                           {loadingVoice === 'onyx' ? (
                             <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                           ) : currentlyPlaying === 'onyx' ? (
                             <Square className="h-3 w-3" />
                           ) : (
                             <Play className="h-3 w-3" />
                           )}
                           {loadingVoice === 'onyx' ? 'Loading...' : currentlyPlaying === 'onyx' ? 'Stop' : 'Test'}
                         </button>
                         <button 
                           type="button"
                           className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                           onClick={() => {
                             onVoiceChange?.('Onyx');
                             onGenerateAudio?.();
                           }}
                         >
                           Use
                         </button>
                       </div>
                    </td>
                    <td className="p-2 border text-center">
                      <div className="text-xs font-bold mb-1">Shimmer</div>
                      <div className="text-xs text-gray-600 mb-2">Soft, gentle voice</div>
                       <div className="flex gap-1 justify-center">
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
                            onClick={() => currentlyPlaying === 'shimmer' ? stopAudio() : playVoice('shimmer')}
                            disabled={loadingVoice === 'shimmer'}
                          >
                           {loadingVoice === 'shimmer' ? (
                             <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                           ) : currentlyPlaying === 'shimmer' ? (
                             <Square className="h-3 w-3" />
                           ) : (
                             <Play className="h-3 w-3" />
                           )}
                           {loadingVoice === 'shimmer' ? 'Loading...' : currentlyPlaying === 'shimmer' ? 'Stop' : 'Test'}
                         </button>
                         <button 
                           type="button"
                           className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                           onClick={() => {
                             onVoiceChange?.('Shimmer');
                             onGenerateAudio?.();
                           }}
                         >
                           Use
                         </button>
                       </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* AI Voice Generation */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Volume2 className="h-4 w-4" />
                AI Voice & Audio Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex gap-3 items-end">
                {/* Choose Voice */}
                <div className="flex-1">
                  <Label className="text-xs font-bold text-gray-700 mb-1 block">Choose Voice</Label>
                  <Select 
                    value={formData.ai_voice_name || 'Nova'} 
                    onValueChange={(value) => onVoiceChange?.(value)}
                  >
                    <SelectTrigger className="w-full text-xs">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white border shadow-lg">
                      <SelectItem value="Nova">Nova - Warm, friendly voice</SelectItem>
                      <SelectItem value="Alloy">Alloy - Clear, neutral voice</SelectItem>
                      <SelectItem value="Echo">Echo - Deep, resonant voice</SelectItem>
                      <SelectItem value="Fable">Fable - British accent, storytelling</SelectItem>
                      <SelectItem value="Onyx">Onyx - Deep, authoritative voice</SelectItem>
                      <SelectItem value="Shimmer">Shimmer - Soft, gentle voice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Audio Button */}
                <div className="flex-1">
                  <Label className="text-xs font-bold text-gray-700 mb-1 block">Generate Audio</Label>
                  <button
                    type="button"
                    onClick={onGenerateAudio}
                    disabled={isGeneratingAudio || !formData.content?.trim()}
                    className="w-full h-9 text-sm font-bold text-white bg-orange-600 border-orange-700 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md border flex items-center justify-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    {isGeneratingAudio ? 'Generating...' : 'Generate Audio'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Video - Added to Content tab */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Video className="h-4 w-4" />
                Story Video
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <StoryVideoUpload
                videoUrl={formData.video_url}
                onVideoUpload={onVideoUpload}
                onVideoRemove={onVideoRemove}
              />
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
    </form>
  );
};

export default UnifiedStoryDashboard;
