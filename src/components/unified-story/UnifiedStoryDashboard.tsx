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
  onStartNew?: () => void;
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
  onStartNew,
  allowTextToSpeech = false,
  context = "unified-story-system",
  onStoryFound,
  fontSize = 16,
  onFontSizeChange
}) => {
  const { currentlyPlaying, loadingVoice, playVoice, stopAudio } = useVoiceTesting();
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});
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

  // Helper function to get audio status styling
  const getAudioStatusStyle = () => {
    const audioDate = formData.audio_generated_at;
    const updateDate = formData.updated_at;
    
    // If no audio generated, treat as outdated
    if (!audioDate) {
      return { backgroundColor: '#DC2626', color: '#FFFF00' };
    }
    
    // Create dates and truncate to minutes (ignore seconds)
    const audioDateTime = new Date(audioDate);
    const updateDateTime = new Date(updateDate);
    audioDateTime.setSeconds(0, 0); // Remove seconds and milliseconds
    updateDateTime.setSeconds(0, 0); // Remove seconds and milliseconds
    
    // If audio is older than last update, it's outdated
    if (audioDateTime < updateDateTime) {
      return { backgroundColor: '#DC2626', color: '#FFFF00' };
    }
    
    // If audio is equal to or newer than last update, it's current
    return { backgroundColor: '#16a34a', color: 'white' };
  };

  // Helper function to get last update styling
  const getLastUpdateStyle = () => {
    const updateDate = formData.updated_at;
    
    if (!updateDate) {
      return { backgroundColor: '#F2BA15', color: 'black' };
    }
    
    // Get today's date (ignoring time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get update date (ignoring time)
    const update = new Date(updateDate);
    update.setHours(0, 0, 0, 0);
    
    // If updated today, use green background with white text
    if (update.getTime() === today.getTime()) {
      return { backgroundColor: '#228B22', color: 'white' };
    }
    
    // Otherwise use gold background with black text
    return { backgroundColor: '#F2BA15', color: 'black' };
  };
  // Resize image helper function
  const resizeImage = (file: File, maxWidth = 800, maxHeight = 600, quality = 0.85): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = document.createElement('img');
      
      img.onload = () => {
        const { width, height } = img;
        let { width: newWidth, height: newHeight } = img;
        
        if (width > height) {
          if (newWidth > maxWidth) {
            newHeight = (newHeight * maxWidth) / newWidth;
            newWidth = maxWidth;
          }
        } else {
          if (newHeight > maxHeight) {
            newWidth = (newWidth * maxHeight) / newHeight;
            newHeight = maxHeight;
          }
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle photo upload
  const handlePhotoUpload = async (file: File, photoNumber: 1 | 2 | 3) => {
    console.log('🖼️ Photo upload started for photo', photoNumber, 'with file:', file);
    if (!file) {
      console.log('❌ No file provided');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type);
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB for original, will be reduced after resize)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large:', file.size);
      toast({
        title: "File Too Large",
        description: "Image size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ File validation passed, starting upload process');

    setUploading(prev => ({ ...prev, [photoNumber]: true }));

    try {
      // Check admin status first
      const { data: session } = await supabase.auth.getSession();
      console.log('📝 Current session:', session?.session?.user?.id ? 'User logged in' : 'No user');
      
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin_safe');
      console.log('👑 Admin status check:', isAdmin, 'Error:', adminError);
      
      // Resize the image to prevent cropping and reduce file size
      console.log('🔄 Starting image resize...');
      toast({
        title: "Processing Image",
        description: "Resizing image...",
      });
      const resizedFile = await resizeImage(file, 800, 600, 0.85);
      console.log('✅ Image resized:', {
        originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        resizedSize: (resizedFile.size / 1024 / 1024).toFixed(2) + 'MB'
      });
      
      // Generate unique filename
      const fileExt = resizedFile.name.split('.').pop();
      const fileName = `story-photos/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      console.log('📝 Generated filename:', fileName);

      // Upload resized file to Supabase storage
      console.log('☁️ Starting upload to Supabase storage...');
      const { data, error } = await supabase.storage
        .from('story-photos')
        .upload(fileName, resizedFile);

      console.log('📤 Upload response:', { data, error });

      if (error) {
        console.error('❌ Upload failed:', error);
        throw error;
      }

      // Get public URL
      console.log('🔗 Getting public URL...');
      const { data: { publicUrl } } = supabase.storage
        .from('story-photos')
        .getPublicUrl(fileName);

      console.log('✅ Public URL generated:', publicUrl);
      onPhotoUpload(photoNumber, publicUrl);
      toast({
        title: "Photo Uploaded Successfully",
        description: `Photo resized and uploaded! Original: ${(file.size / 1024 / 1024).toFixed(1)}MB → Resized: ${(resizedFile.size / 1024 / 1024).toFixed(1)}MB`,
      });
    } catch (error) {
      console.error('❌ Upload error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      console.log('🏁 Upload process completed');
      setUploading(prev => ({ ...prev, [photoNumber]: false }));
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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex gap-6">
        {/* Left Column - 45% width */}
        <div className="w-[45%] space-y-4">
          {/* Action Buttons Box */}
          {onStartNew && (
            <div className="p-2 border-[3px] border-[#16a34a] bg-green-50 rounded-lg">
              <div className="flex gap-1">
                <button 
                  type="button" 
                  onClick={onStartNew}
                  className="flex-1 text-xs h-8 text-white bg-blue-600 border-blue-700 hover:bg-blue-700 rounded-md border flex items-center justify-center gap-1"
                >
                  <FileText className="h-3 w-3" />
                  Start New
                </button>
                
                <button 
                  type="button" 
                  onClick={onSaveOnly}
                  disabled={isSaving || isGeneratingAudio}
                  className="flex-1 text-xs h-8 text-white bg-green-600 border-green-700 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md border flex items-center justify-center gap-1"
                >
                  <Save className="h-3 w-3" />
                  Save
                </button>
                
                <button 
                  type="button" 
                  onClick={onCancel}
                  className="flex-1 text-xs h-8 text-white bg-red-600 border-red-700 hover:bg-red-700 rounded-md border flex items-center justify-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Exit
                </button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-700 font-medium">Reminder: Save, THEN Record</p>
              </div>
            </div>
          )}
          
          {/* Story Details Card */}
          <Card className="border-2" style={{ borderColor: '#16a34a' }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Story Details
                  {formData.category === 'BioText' && (
                    <span className="text-sm text-gray-600 ml-2 flex items-center gap-2">
                      & Biography Information
                      <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                        1B
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    1A
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <StoryCodeField
              value={formData.story_code}
              onChange={(value) => onInputChange('story_code', value)}
              onStoryFound={onStoryFound}
              currentStoryId={formData.id}
              compact={true}
            />
              <StoryFormFields
                formData={formData} 
                onInputChange={onInputChange}
                compact={true}
              />
            </CardContent>
          </Card>

          {/* Story Photos Section */}
          <Card className="border-2" style={{ borderColor: '#814d2e' }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-2xl font-semibold" style={{ color: '#814d2e' }}>
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Story Photos
                </div>
                <span className="bg-orange-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  2
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <table className="w-full table-fixed border-collapse border-2" style={{ borderColor: '#9c441a' }}>
                <tbody>
                  {/* Photo Display Row */}
                  <tr>
                    <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                      <div className="relative">
                        {formData.photo_link_1 ? (
                          <>
                            <img src={formData.photo_link_1} alt="Photo 1" className="w-full h-20 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => onPhotoRemove(1)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-xs">No Photo</div>
                        )}
                      </div>
                    </td>
                    <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                      <div className="relative">
                        {formData.photo_link_2 ? (
                          <>
                            <img src={formData.photo_link_2} alt="Photo 2" className="w-full h-20 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => onPhotoRemove(2)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-xs">No Photo</div>
                        )}
                      </div>
                    </td>
                    <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                      <div className="relative">
                        {formData.photo_link_3 ? (
                          <>
                            <img src={formData.photo_link_3} alt="Photo 3" className="w-full h-20 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => onPhotoRemove(3)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-xs">No Photo</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* File Input Row */}
                  <tr>
                    <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
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
                        }}
                        disabled={uploading[1]}
                        className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" 
                      />
                      {uploading[1] && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
                    </td>
                    <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
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
                        }}
                        disabled={uploading[2]}
                        className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" 
                      />
                      {uploading[2] && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
                    </td>
                    <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
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
                        }}
                        disabled={uploading[3]}
                        className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" 
                      />
                      {uploading[3] && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
                    </td>
                  </tr>
                  
                  {/* Alt Text Row */}
                  <tr>
                    <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                      <input 
                        type="text" 
                        placeholder="Alt text" 
                        value={formData.photo_alt_1 || ''} 
                        onChange={(e) => onInputChange('photo_alt_1', e.target.value)}
                        className="w-full text-xs p-1 border rounded"
                      />
                    </td>
                    <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                      <input 
                        type="text" 
                        placeholder="Alt text" 
                        value={formData.photo_alt_2 || ''} 
                        onChange={(e) => onInputChange('photo_alt_2', e.target.value)}
                        className="w-full text-xs p-1 border rounded"
                      />
                    </td>
                    <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
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

        </div>

        {/* Settings & Actions Column - Uses remaining space */}
        <div className="flex-1 space-y-4">
          {/* Settings Card with side-by-side Copyright and Publication */}
          <Card className="h-fit" style={{ borderColor: '#F97316', borderWidth: '2px' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{ color: '#F97316' }}>
                <FileText className="h-5 w-5" />
                Story Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Timestamp Information Table */}
              <table className="w-full text-xs" style={{ border: '2px solid #9c441a' }}>
                <tbody>
                  <tr>
                    <td colSpan={2} className="text-center font-bold px-1 py-1" style={{ borderRight: '1px solid #9c441a', ...getLastUpdateStyle() }}>
                      Last Update
                    </td>
                    <td colSpan={2} className="text-center font-bold text-gray-700 px-1 py-1" style={{ borderRight: '1px solid #9c441a', backgroundColor: 'rgba(22, 156, 249, 0.3)' }}>
                      Original Upload
                    </td>
                    <td colSpan={2} className="text-center font-bold px-1 py-1" style={getAudioStatusStyle()}>
                      Last Audio Gen
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center font-bold px-1 py-1" style={{ borderRight: '1px solid #9c441a', borderTop: '1px solid #9c441a', ...getLastUpdateStyle() }}>
                      {formatDate(formData.updated_at)}
                    </td>
                    <td className="text-center font-bold px-1 py-1" style={{ borderRight: '1px solid #9c441a', borderTop: '1px solid #9c441a', ...getLastUpdateStyle() }}>
                      {formatTime(formData.updated_at)}
                    </td>
                    <td className="text-center text-gray-600 font-bold px-1 py-1" style={{ borderRight: '1px solid #9c441a', borderTop: '1px solid #9c441a', backgroundColor: 'rgba(22, 156, 249, 0.3)' }}>
                      {formatDate(formData.created_at)}
                    </td>
                    <td className="text-center text-gray-600 font-bold px-1 py-1" style={{ borderRight: '1px solid #9c441a', borderTop: '1px solid #9c441a', backgroundColor: 'rgba(22, 156, 249, 0.3)' }}>
                      {formatTime(formData.created_at)}
                    </td>
                    <td className="text-center font-bold px-1 py-1" style={{ borderRight: '1px solid #9c441a', borderTop: '1px solid #9c441a', ...getAudioStatusStyle() }}>
                      {formatDate(formData.audio_generated_at)}
                    </td>
                    <td className="text-center font-bold px-1 py-1" style={{ borderTop: '1px solid #9c441a', ...getAudioStatusStyle() }}>
                      {formatTime(formData.audio_generated_at)}
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Copyright Status and Publication Status with Media Icons */}
              <div className="flex gap-3">
                {/* Copyright Status - Now on left */}
                <div className="space-y-1 flex-1">
                  <Label className="text-xs font-bold text-gray-700">Copyright Status</Label>
                  <CopyrightControl
                    value={formData.copyright_status || '©'}
                    onChange={(value) => onInputChange('copyright_status', value)}
                  />
                </div>
                
                {/* Publication Status with Media Icons - Now on right */}
                <div className="space-y-1 flex-1">
                  <Label htmlFor="published" className="text-xs font-bold text-gray-700">Publication Status</Label>
                  <div className="flex items-center gap-2">
                    <Select value={formData.published} onValueChange={(value) => onInputChange('published', value)}>
                      <SelectTrigger className={`w-auto min-w-[140px] text-xs font-bold ${getPublishedColor(formData.published)}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white border shadow-lg">
                        <SelectItem value="N">Not Published</SelectItem>
                        <SelectItem value="Y">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Media Icons */}
                    <div className="flex items-center gap-1">
                      {formData.audio_url && (
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-green-100 border border-green-300">
                          <Headphones className="h-3 w-3 text-green-600" />
                        </div>
                      )}
                      {formData.video_url && (
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-100 border border-blue-300">
                          <Video className="h-3 w-3 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
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
                  className="w-full p-2 text-xs border rounded-md"
                  style={{ borderColor: '#9c441a', borderWidth: '2px' }}
                />
              </div>

            </CardContent>
          </Card>

          {/* AI Voice Generation */}
          <Card className="h-fit border-2" style={{ borderColor: '#2563eb' }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-2xl font-semibold" style={{ color: '#2563eb' }}>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Create AI Voice File
                </div>
                <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  4
                </span>
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
                    <SelectTrigger className="w-full text-xs" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white border shadow-lg">
                      <SelectItem value="Alloy">Alloy - Clear, neutral voice</SelectItem>
                      <SelectItem value="Echo">Echo - Deep, resonant voice</SelectItem>
                      <SelectItem value="Fable">Fable - British accent, storytelling</SelectItem>
                      <SelectItem value="Nova">Nova - Warm, friendly voice</SelectItem>
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
                    onClick={async () => {
                      try {
                        console.log('🎵 UnifiedStoryDashboard: Generate audio clicked for story:', formData.id);
                        await onGenerateAudio();
                        toast({
                          title: "Audio Generation Started",
                          description: "Your story audio is being generated. This may take a few minutes.",
                        });
                      } catch (error) {
                        console.error('🎵 UnifiedStoryDashboard: Audio generation error:', error);
                        toast({
                          title: "Audio Generation Failed",
                          description: error instanceof Error ? error.message : "Failed to generate audio. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                    disabled={isGeneratingAudio || !formData.content?.trim() || !formData.id}
                    className="w-full h-9 text-sm font-bold text-white bg-orange-600 border-orange-700 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md border flex items-center justify-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    {isGeneratingAudio ? 'Generating...' : formData.id ? 'Generate Audio' : 'Save Story First'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Selection - Simple Table */}
          <Card className="h-fit border-2" style={{ borderColor: '#2563eb' }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{ color: '#2563eb' }}>
                <Volume2 className="h-5 w-5" />
                Voice Previews
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <table className="w-full table-fixed border-collapse" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                <tbody>
                  {/* Top Row - First 3 Voices */}
                  <tr>
                    <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                      <div className="text-xs font-bold mb-1">Alloy</div>
                      <div className="text-xs text-gray-600 mb-2">Clear, neutral voice</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'alloy' ? (
                          <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div>
                        ) : currentlyPlaying === 'alloy' ? (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                            onClick={stopAudio}
                          >
                            <Square className="h-3 w-3" />
                            Stop
                          </button>
                        ) : (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                            onClick={() => playVoice('alloy', formData.content, formData.title)}
                          >
                            <Play className="h-3 w-3" />
                            Test
                          </button>
                        )}
                        <button 
                          type="button"
                          className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => onVoiceChange?.('Alloy')}
                        >
                          Use
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                      <div className="text-xs font-bold mb-1">Echo</div>
                      <div className="text-xs text-gray-600 mb-2">Deep, resonant voice</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'echo' ? (
                          <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div>
                        ) : currentlyPlaying === 'echo' ? (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                            onClick={stopAudio}
                          >
                            <Square className="h-3 w-3" />
                            Stop
                          </button>
                        ) : (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                            onClick={() => playVoice('echo', formData.content, formData.title)}
                          >
                            <Play className="h-3 w-3" />
                            Test
                          </button>
                        )}
                        <button 
                          type="button"
                          className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => onVoiceChange?.('Echo')}
                        >
                          Use
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                      <div className="text-xs font-bold mb-1">Fable</div>
                      <div className="text-xs text-gray-600 mb-2">British accent, storytelling</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'fable' ? (
                          <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div>
                        ) : currentlyPlaying === 'fable' ? (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                            onClick={stopAudio}
                          >
                            <Square className="h-3 w-3" />
                            Stop
                          </button>
                        ) : (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                            onClick={() => playVoice('fable', formData.content, formData.title)}
                          >
                            <Play className="h-3 w-3" />
                            Test
                          </button>
                        )}
                        <button 
                          type="button"
                          className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => onVoiceChange?.('Fable')}
                        >
                          Use
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Bottom Row - Next 3 Voices */}
                  <tr>
                    <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                      <div className="text-xs font-bold mb-1">Nova</div>
                      <div className="text-xs text-gray-600 mb-2">Warm, friendly voice</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'nova' ? (
                          <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div>
                        ) : currentlyPlaying === 'nova' ? (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                            onClick={stopAudio}
                          >
                            <Square className="h-3 w-3" />
                            Stop
                          </button>
                        ) : (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                            onClick={() => playVoice('nova', formData.content, formData.title)}
                          >
                            <Play className="h-3 w-3" />
                            Test
                          </button>
                        )}
                        <button 
                          type="button"
                          className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => onVoiceChange?.('Nova')}
                        >
                          Use
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                      <div className="text-xs font-bold mb-1">Onyx</div>
                      <div className="text-xs text-gray-600 mb-2">Deep, authoritative voice</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'onyx' ? (
                          <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div>
                        ) : currentlyPlaying === 'onyx' ? (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                            onClick={stopAudio}
                          >
                            <Square className="h-3 w-3" />
                            Stop
                          </button>
                        ) : (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                            onClick={() => playVoice('onyx', formData.content, formData.title)}
                          >
                            <Play className="h-3 w-3" />
                            Test
                          </button>
                        )}
                        <button 
                          type="button"
                          className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => onVoiceChange?.('Onyx')}
                        >
                          Use
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                      <div className="text-xs font-bold mb-1">Shimmer</div>
                      <div className="text-xs text-gray-600 mb-2">Soft, gentle voice</div>
                      <div className="flex gap-1 justify-center">
                        {loadingVoice === 'shimmer' ? (
                          <div className="flex items-center gap-1 px-2 py-1 text-xs">
                            <LoadingSpinner />
                            <span>Testing...</span>
                          </div>
                        ) : currentlyPlaying === 'shimmer' ? (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                            onClick={stopAudio}
                          >
                            <Square className="h-3 w-3" />
                            Stop
                          </button>
                        ) : (
                          <button 
                            type="button"
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                            onClick={() => playVoice('shimmer', formData.content, formData.title)}
                          >
                            <Play className="h-3 w-3" />
                            Test
                          </button>
                        )}
                        <button 
                          type="button"
                          className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => onVoiceChange?.('Shimmer')}
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

          {/* Optional Uploads Section */}
          <Card className="h-fit border-2" style={{ borderColor: '#6b7280' }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-xl font-semibold" style={{ color: '#6b7280' }}>
                <span>Optional</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-4">
              {/* Audio Upload */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: '#4A7C59' }}>
                  <Volume2 className="h-4 w-4" />
                  Audio Upload - Add or Replace
                </h4>
                <AudioUploadSection
                  audioUrl={formData.audio_url}
                  onAudioUpload={(url) => onInputChange('audio_url', url)}
                  onAudioRemove={() => onInputChange('audio_url', '')}
                />
              </div>
              
              {/* Video Upload */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: '#9333ea' }}>
                  <Video className="h-4 w-4" />
                  Video Upload - Add or Replace
                </h4>
                <StoryVideoUpload
                  videoUrl={formData.video_url}
                  onVideoUpload={onVideoUpload}
                  onVideoRemove={onVideoRemove}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Story Editor */}
      <Card className="border-2" style={{ borderColor: '#F97316' }}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl font-semibold" style={{ color: '#F97316' }}>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Story Content
            </div>
            <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
              3
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SplitViewEditor
            content={formData.content}
            onChange={(content) => onInputChange('content', content)}
            placeholder="Write your story here..."
            onSave={onSaveOnly}
            category={formData.category}
            fontSize={fontSize}
            onFontSizeChange={onFontSizeChange}
          />
        </CardContent>
      </Card>
    </form>
  );
};

export default UnifiedStoryDashboard;
