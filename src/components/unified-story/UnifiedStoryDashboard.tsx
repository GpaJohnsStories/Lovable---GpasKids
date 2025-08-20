import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Save, X, FileText, Image, Video, Volume2, Play, Square, Trash2, Headphones } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StoryFormFields from "../StoryFormFields";
import StoryVideoUpload from "../StoryVideoUpload";
import AudioUploadSection from "./AudioUploadSection";
import SplitViewEditor from "../editor/SplitViewEditor";
import CopyrightControl from "../story-form/CopyrightControl";
import StoryCodeField from "../StoryCodeField";
import type { Story } from '@/hooks/useStoryFormState';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { useVoiceTesting } from '@/hooks/useVoiceTesting';
import LoadingSpinner from "../LoadingSpinner";

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
  onNew: () => void;
  allowTextToSpeech?: boolean;
  context?: string;
  onStoryFound?: (story: Story) => void;
  fontSize?: number;
  onFontSizeChange?: (fontSize: number) => void;
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
  onNew,
  allowTextToSpeech = false,
  context = "unified-story-system",
  onStoryFound,
  fontSize = 16,
  onFontSizeChange
}) => {
  const {
    currentlyPlaying,
    loadingVoice,
    playVoice,
    stopAudio
  } = useVoiceTesting();
  const [uploading, setUploading] = useState<{
    [key: number]: boolean;
  }>({});

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

  const getAudioStatusStyle = () => {
    const audioDate = formData.audio_generated_at;
    const updateDate = formData.updated_at;

    if (!audioDate) {
      return {
        backgroundColor: '#DC2626',
        color: '#FFFF00'
      };
    }

    const audioDateTime = new Date(audioDate);
    const updateDateTime = new Date(updateDate);
    audioDateTime.setSeconds(0, 0);
    updateDateTime.setSeconds(0, 0);

    if (audioDateTime < updateDateTime) {
      return {
        backgroundColor: '#DC2626',
        color: '#FFFF00'
      };
    }

    return {
      backgroundColor: '#16a34a',
      color: 'white'
    };
  };

  const getLastUpdateStyle = () => {
    const updateDate = formData.updated_at;
    if (!updateDate) {
      return {
        backgroundColor: '#F2BA15',
        color: 'black'
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const update = new Date(updateDate);
    update.setHours(0, 0, 0, 0);

    if (update.getTime() === today.getTime()) {
      return {
        backgroundColor: '#228B22',
        color: 'white'
      };
    }

    return {
      backgroundColor: '#F2BA15',
      color: 'black'
    };
  };

  const resizeImage = (file: File, maxWidth = 800, maxHeight = 600, quality = 0.85): Promise<File> => {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = document.createElement('img');
      img.onload = () => {
        const {
          width,
          height
        } = img;
        let {
          width: newWidth,
          height: newHeight
        } = img;
        if (width > height) {
          if (newWidth > maxWidth) {
            newHeight = newHeight * maxWidth / newWidth;
            newWidth = maxWidth;
          }
        } else {
          if (newHeight > maxHeight) {
            newWidth = newWidth * maxHeight / newHeight;
            newHeight = maxHeight;
          }
        }
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob(blob => {
          const resizedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(resizedFile);
        }, file.type, quality);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handlePhotoUpload = async (file: File, photoNumber: 1 | 2 | 3) => {
    console.log('🖼️ Photo upload started for photo', photoNumber, 'with file:', file);
    if (!file) {
      console.log('❌ No file provided');
      return;
    }

    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type);
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large:', file.size);
      toast({
        title: "File Too Large",
        description: "Image size must be less than 10MB",
        variant: "destructive"
      });
      return;
    }
    console.log('✅ File validation passed, starting upload process');
    setUploading(prev => ({
      ...prev,
      [photoNumber]: true
    }));
    try {
      const {
        data: session
      } = await supabase.auth.getSession();
      console.log('📝 Current session:', session?.session?.user?.id ? 'User logged in' : 'No user');
      const {
        data: isAdmin,
        error: adminError
      } = await supabase.rpc('is_admin_safe');
      console.log('👑 Admin status check:', isAdmin, 'Error:', adminError);

      console.log('🔄 Starting image resize...');
      toast({
        title: "Processing Image",
        description: "Resizing image..."
      });
      const resizedFile = await resizeImage(file, 800, 600, 0.85);
      console.log('✅ Image resized:', {
        originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        resizedSize: (resizedFile.size / 1024 / 1024).toFixed(2) + 'MB'
      });

      const fileExt = resizedFile.name.split('.').pop();
      const fileName = `story-photos/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      console.log('📝 Generated filename:', fileName);

      console.log('☁️ Starting upload to Supabase storage...');
      const {
        data,
        error
      } = await supabase.storage.from('story-photos').upload(fileName, resizedFile);
      console.log('📤 Upload response:', {
        data,
        error
      });
      if (error) {
        console.error('❌ Upload failed:', error);
        throw error;
      }

      console.log('🔗 Getting public URL...');
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('story-photos').getPublicUrl(fileName);
      console.log('✅ Public URL generated:', publicUrl);
      onPhotoUpload(photoNumber, publicUrl);
      toast({
        title: "Photo Uploaded Successfully",
        description: `Photo resized and uploaded! Original: ${(file.size / 1024 / 1024).toFixed(1)}MB → Resized: ${(resizedFile.size / 1024 / 1024).toFixed(1)}MB`
      });
    } catch (error) {
      console.error('❌ Upload error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      console.log('🏁 Upload process completed');
      setUploading(prev => ({
        ...prev,
        [photoNumber]: false
      }));
    }
  };

  console.log('🎯 UnifiedStoryDashboard: Rendering with formData:', {
    id: formData.id,
    title: formData.title,
    content: formData.content ? `"${formData.content.substring(0, 100)}..."` : 'undefined/empty',
    contentLength: formData.content?.length || 0,
    hasAudio: !!formData.audio_url,
    aiVoiceName: formData.ai_voice_name
  });

  return <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex gap-6">
        <div className="w-[45%] space-y-4">
          <div className="bg-blue-600 border border-transparent p-4 h-16">
            <div className="flex gap-3 h-full">
              <button 
                type="button" 
                onClick={onSaveOnly}
                className="flex-1 h-full text-white font-bold rounded"
                style={{ backgroundColor: '#22c55e' }}
              >
                SAVE
              </button>
              <button 
                type="button" 
                onClick={onNew}
                className="flex-1 h-full text-white font-bold rounded"
                style={{ backgroundColor: '#FF8C42' }}
              >
                + New
              </button>
              <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 h-full text-white font-bold rounded"
                style={{ backgroundColor: '#DC143C' }}
              >
                Cancel
              </button>
            </div>
          </div>

          <Card className="border-2 relative" style={{
          borderColor: '#16a34a'
        }}>
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
              <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>1a</span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Story Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <StoryCodeField value={formData.story_code} onChange={value => onInputChange('story_code', value)} onStoryFound={onStoryFound} currentStoryId={formData.id} compact={true} />
              <StoryFormFields formData={formData} onInputChange={onInputChange} compact={true} />
            </CardContent>
          </Card>

          <Card className="border-2 relative" style={{
          borderColor: '#814d2e'
        }}>
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
              <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>2</span>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{
              color: '#814d2e'
            }}>
                <Image className="h-5 w-5" />
                Story Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <table className="w-full table-fixed border-collapse border-2" style={{
              borderColor: '#9c441a'
            }}>
                <tbody>
                  <tr>
                    <td className="p-2 border" style={{
                    borderColor: '#9c441a'
                  }}>
                      <div className="relative">
                        {formData.photo_link_1 ? <>
                            <img src={formData.photo_link_1} alt="Photo 1" className="w-full h-20 object-cover rounded" />
                            <button type="button" onClick={() => onPhotoRemove(1)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </> : <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-xs">No Photo</div>}
                      </div>
                    </td>
                    <td className="p-2 border" style={{
                    borderColor: '#9c441a'
                  }}>
                      <div className="relative">
                        {formData.photo_link_2 ? <>
                            <img src={formData.photo_link_2} alt="Photo 2" className="w-full h-20 object-cover rounded" />
                            <button type="button" onClick={() => onPhotoRemove(2)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </> : <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-xs">No Photo</div>}
                      </div>
                    </td>
                    <td className="p-2 border" style={{
                    borderColor: '#9c441a'
                  }}>
                      <div className="relative">
                        {formData.photo_link_3 ? <>
                            <img src={formData.photo_link_3} alt="Photo 3" className="w-full h-20 object-cover rounded" />
                            <button type="button" onClick={() => onPhotoRemove(3)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </> : <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-xs">No Photo</div>}
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="p-2 border" style={{
                    borderColor: '#9c441a'
                  }}>
                      <input type="file" accept="image/*" onChange={e => {
                      console.log('📁 File input change event triggered for photo 1');
                      const file = e.target.files?.[0];
                      console.log('📁 Selected file:', file ? file.name : 'No file selected');
                      if (file) {
                        console.log('📁 Starting file upload process for:', file.name);
                        handlePhotoUpload(file, 1);
                      } else {
                        console.log('❌ No file was selected');
                      }
                      e.target.value = ''; // Reset input
                    }} disabled={uploading[1]} className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                      {uploading[1] && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
                    </td>
                    <td className="p-2 border" style={{
                    borderColor: '#9c441a'
                  }}>
                      <input type="file" accept="image/*" onChange={e => {
                      console.log('📁 File input change event triggered for photo 2');
                      const file = e.target.files?.[0];
                      console.log('📁 Selected file:', file ? file.name : 'No file selected');
                      if (file) {
                        console.log('📁 Starting file upload process for:', file.name);
                        handlePhotoUpload(file, 2);
                      } else {
                        console.log('❌ No file was selected');
                      }
                      e.target.value = ''; // Reset input
                    }} disabled={uploading[2]} className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                      {uploading[2] && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
                    </td>
                    <td className="p-2 border" style={{
                    borderColor: '#9c441a'
                  }}>
                      <input type="file" accept="image/*" onChange={e => {
                      console.log('📁 File input change event triggered for photo 3');
                      const file = e.target.files?.[0];
                      console.log('📁 Selected file:', file ? file.name : 'No file selected');
                      if (file) {
                        console.log('📁 Starting file upload process for:', file.name);
                        handlePhotoUpload(file, 3);
                      } else {
                        console.log('❌ No file was selected');
                      }
                      e.target.value = ''; // Reset input
                    }} disabled={uploading[3]} className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                      {uploading[3] && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="p-2 border" style={{
                    borderColor: '#9c441a'
                  }}>
                      <input type="text" placeholder="Alt text" value={formData.photo_alt_1 || ''} onChange={e => onInputChange('photo_alt_1', e.target.value)} className="w-full text-xs p-1 border rounded" />
                    </td>
                    <td className="p-2 border" style={{
                    borderColor: '#9c441a'
                  }}>
                      <input type="text" placeholder="Alt text" value={formData.photo_alt_2 || ''} onChange={e => onInputChange('photo_alt_2', e.target.value)} className="w-full text-xs p-1 border rounded" />
                    </td>
                    <td className="p-2 border" style={{
                    borderColor: '#9c441a'
                  }}>
                      <input type="text" placeholder="Alt text" value={formData.photo_alt_3 || ''} onChange={e => onInputChange('photo_alt_3', e.target.value)} className="w-full text-xs p-1 border rounded" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

        </div>

        <div className="flex-1 space-y-4">
          <Card className="h-fit relative" style={{
          borderColor: '#F97316',
          borderWidth: '2px'
        }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{
              color: '#F97316'
            }}>
                <FileText className="h-5 w-5" />
                Story Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <table className="w-full text-xs" style={{
              border: '2px solid #9c441a'
            }}>
                <tbody>
                  <tr>
                    <td colSpan={2} className="text-center font-bold px-1 py-1" style={{
                    borderRight: '1px solid #9c441a',
                    ...getLastUpdateStyle()
                  }}>
                      Last Update
                    </td>
                    <td colSpan={2} className="text-center font-bold text-gray-700 px-1 py-1" style={{
                    borderRight: '1px solid #9c441a',
                    backgroundColor: 'rgba(22, 156, 249, 0.3)'
                  }}>
                      Original Upload
                    </td>
                    <td colSpan={2} className="text-center font-bold px-1 py-1" style={getAudioStatusStyle()}>
                      Last Audio Gen
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center font-bold px-1 py-1" style={{
                    borderRight: '1px solid #9c441a',
                    borderTop: '1px solid #9c441a',
                    ...getLastUpdateStyle()
                  }}>
                      {formatDate(formData.updated_at)}
                    </td>
                    <td className="text-center font-bold px-1 py-1" style={{
                    borderRight: '1px solid #9c441a',
                    borderTop: '1px solid #9c441a',
                    ...getLastUpdateStyle()
                  }}>
                      {formatTime(formData.updated_at)}
                    </td>
                    <td className="text-center text-gray-600 font-bold px-1 py-1" style={{
                    borderRight: '1px solid #9c441a',
                    borderTop: '1px solid #9c441a',
                    backgroundColor: 'rgba(22, 156, 249, 0.3)'
                  }}>
                      {formatDate(formData.created_at)}
                    </td>
                    <td className="text-center text-gray-600 font-bold px-1 py-1" style={{
                    borderRight: '1px solid #9c441a',
                    borderTop: '1px solid #9c441a',
                    backgroundColor: 'rgba(22, 156, 249, 0.3)'
                  }}>
                      {formatTime(formData.created_at)}
                    </td>
                    <td className="text-center font-bold px-1 py-1" style={{
                    borderRight: '1px solid #9c441a',
                    borderTop: '1px solid #9c441a',
                    ...getAudioStatusStyle()
                  }}>
                      {formatDate(formData.audio_generated_at)}
                    </td>
                    <td className="text-center font-bold px-1 py-1" style={{
                    borderTop: '1px solid #9c441a',
                    ...getAudioStatusStyle()
                  }}>
                      {formatTime(formData.audio_generated_at)}
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div className="flex gap-3">
                <div className="space-y-1 flex-1">
                  <Label className="text-xs font-bold text-gray-700">Copyright Status</Label>
                  <CopyrightControl value={formData.copyright_status || '©'} onChange={value => onInputChange('copyright_status', value)} />
                </div>
                
                <div className="space-y-1 flex-1">
                  <Label htmlFor="published" className="text-xs font-bold text-gray-700">Publication Status</Label>
                  <div className="flex items-center gap-2">
                    <Select value={formData.published} onValueChange={value => onInputChange('published', value)}>
                      <SelectTrigger className={`w-auto min-w-[140px] text-xs font-bold ${getPublishedColor(formData.published)}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white border shadow-lg">
                        <SelectItem value="N">Not Published</SelectItem>
                        <SelectItem value="Y">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-1">
                      {formData.audio_url && <div className="flex items-center justify-center w-6 h-6 rounded bg-green-100 border border-green-300">
                          <Headphones className="h-3 w-3 text-green-600" />
                        </div>}
                      {formData.video_url && <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-100 border border-blue-300">
                          <Video className="h-3 w-3 text-blue-600" />
                        </div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="google_drive_link" className="text-xs font-bold text-gray-700">Google Drive Link</Label>
                <input id="google_drive_link" type="url" value={formData.google_drive_link} onChange={e => onInputChange('google_drive_link', e.target.value)} placeholder="https://drive.google.com/..." className="w-full p-2 text-xs border rounded-md" style={{
                borderColor: '#9c441a',
                borderWidth: '2px'
              }} />
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit border-2 relative" style={{
          borderColor: '#2563eb'
        }}>
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
              <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>4</span>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{
              color: '#2563eb'
            }}>
                <Volume2 className="h-5 w-5" />
                Create AI Audio File
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="text-xs font-bold text-gray-700 mb-1 block">Choose Voice</Label>
                  <Select value={formData.ai_voice_name || 'Nova'} onValueChange={value => onVoiceChange?.(value)}>
                    <SelectTrigger className="w-full text-xs" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white border shadow-lg">
                      <SelectItem value="alloy">Buddy</SelectItem>
                      <SelectItem value="fable">Fluffy</SelectItem>
                      <SelectItem value="echo">Gpa John</SelectItem>
                      <SelectItem value="onyx">Max</SelectItem>
                      <SelectItem value="sage">Sparky</SelectItem>
                      <SelectItem value="ash">Ash</SelectItem>
                      <SelectItem value="coral">Coral</SelectItem>
                      <SelectItem value="nova">Nova</SelectItem>
                      <SelectItem value="shimmer">Shimmer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label className="text-xs font-bold text-gray-700 mb-1 block">Generate Audio</Label>
                  <button type="button" onClick={async () => {
                  try {
                    console.log('🎵 UnifiedStoryDashboard: Generate audio clicked for story:', formData.id);
                    await onGenerateAudio();
                    toast({
                      title: "Audio Generation Started",
                      description: "Your story audio is being generated. This may take a few minutes."
                    });
                  } catch (error) {
                    console.error('🎵 UnifiedStoryDashboard: Audio generation error:', error);
                    toast({
                      title: "Audio Generation Failed",
                      description: error instanceof Error ? error.message : "Failed to generate audio. Please try again.",
                      variant: "destructive"
                    });
                  }
                }} disabled={isGeneratingAudio || !formData.content?.trim() || !formData.id} className="w-full h-9 text-sm font-bold text-white bg-orange-600 border-orange-700 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md border flex items-center justify-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    {isGeneratingAudio ? 'Generating...' : formData.id ? 'Generate Audio' : 'Save Story First'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit border-2 relative" style={{
          borderColor: '#2563eb'
        }}>
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: '#FF8C42' }}>
              <span className="text-black text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>A</span>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{
              color: '#2563eb'
            }}>
                <Volume2 className="h-5 w-5" />
                Voice Previews
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <table className="w-full table-fixed border-collapse" style={{
              borderColor: '#9c441a',
              borderWidth: '2px'
            }}>
                <tbody>
                  <tr>
                    <td className="p-2 border text-center" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <div className="text-xs font-bold mb-1">Buddy</div>
                      <div className="text-xs text-gray-600 mb-2">Clear, neutral voice (Alloy)</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'alloy' ? <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div> : currentlyPlaying === 'alloy' ? <button type="button" className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1" onClick={stopAudio}>
                            <Square className="h-3 w-3" />
                            Stop
                          </button> : <button type="button" className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1" onClick={() => playVoice('alloy', formData.content, formData.title)}>
                            <Play className="h-3 w-3" />
                            Test
                          </button>}
                        <button type="button" className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => onVoiceChange?.('alloy')}>
                          Use
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border text-center" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <div className="text-xs font-bold mb-1">Gpa John</div>
                      <div className="text-xs text-gray-600 mb-2">Deep, resonant voice (Echo)</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'echo' ? <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div> : currentlyPlaying === 'echo' ? <button type="button" className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1" onClick={stopAudio}>
                            <Square className="h-3 w-3" />
                            Stop
                          </button> : <button type="button" className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1" onClick={() => playVoice('echo', formData.content, formData.title)}>
                            <Play className="h-3 w-3" />
                            Test
                          </button>}
                        <button type="button" className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => onVoiceChange?.('echo')}>
                          Use
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="p-2 border text-center" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <div className="text-xs font-bold mb-1">Fluffy</div>
                      <div className="text-xs text-gray-600 mb-2">British accent, storytelling (Fable)</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'fable' ? <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div> : currentlyPlaying === 'fable' ? <button type="button" className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1" onClick={stopAudio}>
                            <Square className="h-3 w-3" />
                            Stop
                          </button> : <button type="button" className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1" onClick={() => playVoice('fable', formData.content, formData.title)}>
                            <Play className="h-3 w-3" />
                            Test
                          </button>}
                        <button type="button" className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => onVoiceChange?.('fable')}>
                          Use
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border text-center" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <div className="text-xs font-bold mb-1">Nova</div>
                      <div className="text-xs text-gray-600 mb-2">Warm, friendly voice</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'nova' ? <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div> : currentlyPlaying === 'nova' ? <button type="button" className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1" onClick={stopAudio}>
                            <Square className="h-3 w-3" />
                            Stop
                          </button> : <button type="button" className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1" onClick={() => playVoice('nova', formData.content, formData.title)}>
                            <Play className="h-3 w-3" />
                            Test
                          </button>}
                        <button type="button" className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => onVoiceChange?.('nova')}>
                          Use
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="p-2 border text-center" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <div className="text-xs font-bold mb-1">Max</div>
                      <div className="text-xs text-gray-600 mb-2">Deep, authoritative voice (Onyx)</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'onyx' ? <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div> : currentlyPlaying === 'onyx' ? <button type="button" className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1" onClick={stopAudio}>
                            <Square className="h-3 w-3" />
                            Stop
                          </button> : <button type="button" className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1" onClick={() => playVoice('onyx', formData.content, formData.title)}>
                            <Play className="h-3 w-3" />
                            Test
                          </button>}
                        <button type="button" className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => onVoiceChange?.('onyx')}>
                          Use
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border text-center" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <div className="text-xs font-bold mb-1">Shimmer</div>
                      <div className="text-xs text-gray-600 mb-2">Soft, gentle voice</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'shimmer' ? <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div> : currentlyPlaying === 'shimmer' ? <button type="button" className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1" onClick={stopAudio}>
                            <Square className="h-3 w-3" />
                            Stop
                          </button> : <button type="button" className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1" onClick={() => playVoice('shimmer', formData.content, formData.title)}>
                            <Play className="h-3 w-3" />
                            Test
                          </button>}
                        <button type="button" className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => onVoiceChange?.('shimmer')}>
                          Use
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="p-2 border text-center" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <div className="text-xs font-bold mb-1">Ash</div>
                      <div className="text-xs text-gray-600 mb-2">Gentle and neutral, calming</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'ash' ? <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div> : currentlyPlaying === 'ash' ? <button type="button" className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1" onClick={stopAudio}>
                            <Square className="h-3 w-3" />
                            Stop
                          </button> : <button type="button" className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1" onClick={() => playVoice('ash', formData.content, formData.title)}>
                            <Play className="h-3 w-3" />
                            Test
                          </button>}
                        <button type="button" className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => onVoiceChange?.('ash')}>
                          Use
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border text-center" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <div className="text-xs font-bold mb-1">Coral</div>
                      <div className="text-xs text-gray-600 mb-2">Bright and clear, youthful tone</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'coral' ? <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div> : currentlyPlaying === 'coral' ? <button type="button" className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1" onClick={stopAudio}>
                            <Square className="h-3 w-3" />
                            Stop
                          </button> : <button type="button" className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1" onClick={() => playVoice('coral', formData.content, formData.title)}>
                            <Play className="h-3 w-3" />
                            Test
                          </button>}
                        <button type="button" className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => onVoiceChange?.('coral')}>
                          Use
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="p-2 border text-center" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <div className="text-xs font-bold mb-1">Sparky</div>
                      <div className="text-xs text-gray-600 mb-2">Warm and thoughtful, reflective (Sage)</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'sage' ? <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div> : currentlyPlaying === 'sage' ? <button type="button" className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1" onClick={stopAudio}>
                            <Square className="h-3 w-3" />
                            Stop
                          </button> : <button type="button" className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1" onClick={() => playVoice('sage', formData.content, formData.title)}>
                            <Play className="h-3 w-3" />
                            Test
                          </button>}
                        <button type="button" className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => onVoiceChange?.('sage')}>
                          Use
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border text-center" style={{
                    borderColor: '#9c441a',
                    borderWidth: '2px'
                  }}>
                      <div className="text-xs text-gray-600">Available for future voices</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="h-fit border-2 relative" style={{
          borderColor: '#9333ea'
        }}>
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: '#FF8C42' }}>
              <span className="text-black text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>B</span>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{
              color: '#9333ea'
            }}>
                <Video className="h-5 w-5" />
                Story Video
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <StoryVideoUpload videoUrl={formData.video_url} onVideoUpload={onVideoUpload} onVideoRemove={onVideoRemove} />
            </CardContent>
          </Card>

          <Card className="border-2 relative" style={{
          borderColor: '#4A7C59'
        }}>
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: '#FF8C42' }}>
              <span className="text-black text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>C</span>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{
              color: '#4A7C59'
            }}>
                <Volume2 className="h-5 w-5" />
                Audio Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <AudioUploadSection audioUrl={formData.audio_url} onAudioUpload={url => onInputChange('audio_url', url)} onAudioRemove={() => onInputChange('audio_url', '')} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-2 relative" style={{
      borderColor: '#F97316'
    }}>
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
          <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>3</span>
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{
          color: '#F97316'
        }}>
          <FileText className="h-5 w-5" />
          Story Content
        </CardTitle>
        </CardHeader>
        <CardContent>
          <SplitViewEditor content={formData.content} onChange={content => onInputChange('content', content)} placeholder="Write your story here..." onSave={onSaveOnly} category={formData.category} fontSize={fontSize} onFontSizeChange={onFontSizeChange} />
        </CardContent>
      </Card>
    </form>;
};

export default UnifiedStoryDashboard;
