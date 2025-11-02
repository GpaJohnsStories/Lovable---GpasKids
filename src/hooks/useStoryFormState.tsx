import { useState, useEffect, useCallback } from 'react';
import { useStoryData } from '@/hooks/useStoryData';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Helper function to extract storage key from public URL
const extractStorageKeyFromPublicUrl = (publicUrl: string): string | null => {
  if (!publicUrl) return null;
  
  try {
    // Handle both old format (story-photos/...) and new format (story-photos/stories/...)
    const baseUrl = 'https://hlywucxwpzbqmzssmwpj.supabase.co/storage/v1/object/public/story-photos/';
    
    if (!publicUrl.startsWith(baseUrl)) {
      console.log('❌ URL does not match expected format:', publicUrl);
      return null;
    }
    
    // Extract the path after the base URL, remove any query parameters
    const path = publicUrl.replace(baseUrl, '').split('?')[0];
    return path;
  } catch (error) {
    console.error('❌ Error extracting storage key:', error);
    return null;
  }
};


export interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText" | "Admin";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  photo_link_4: string;
  photo_alt_1: string;
  photo_alt_2: string;
  photo_alt_3: string;
  photo_alt_4: string;
  video_url: string;
  ai_voice_name: string;
  ai_voice_model: string;
  copyright_status?: string;
  audio_url?: string;
  audio_duration_seconds?: number;
  audio_segments?: number;
  video_duration_seconds?: number;
  created_at?: string;
  updated_at?: string;
  audio_generated_at?: string;
  publication_status_code?: number;
  color_preset_id?: string;
  site?: "KIDS" | "FAITH" | "SHOP" | "ADMIN";
}

const initialFormData: Story = {
  title: '',
  author: '',
  category: 'Fun',
  content: '',
  tagline: '',
  excerpt: '',
  story_code: '',
  photo_link_1: '',
  photo_link_2: '',
  photo_link_3: '',
  photo_link_4: '',
  photo_alt_1: '',
  photo_alt_2: '',
  photo_alt_3: '',
  photo_alt_4: '',
  video_url: '',
  ai_voice_name: 'Nova',
  ai_voice_model: 'tts-1',
  copyright_status: '©',
  publication_status_code: 5
};

export const useStoryFormState = (storyId?: string, skipDataFetch = false) => {
  const [formData, setFormData] = useState<Story>(initialFormData);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState<string | undefined>(storyId);
  const { story, isLoading: isLoadingStory, refetch: refetchStory, error } = useStoryData(skipDataFetch ? undefined : currentStoryId);

  const populateFormWithStory = useCallback(async (storyData: Story, fromCodeLookup = false) => {
    console.log('🎯 useStoryFormState: Populating form with story data:', storyData, 'fromCodeLookup:', fromCodeLookup);
    
    // First set the initial form data
    setFormData({
      ...storyData,
      ai_voice_name: storyData.ai_voice_name || 'Nova',
      ai_voice_model: storyData.ai_voice_model || 'tts-1',
      copyright_status: storyData.copyright_status === 'S' ? 'L' : (storyData.copyright_status || '©')
    });
    
    // If this is from a code lookup, update the current story ID so refetchStory works
    if (fromCodeLookup && storyData.id) {
      setCurrentStoryId(storyData.id);
    }

    // Migrate photos to deterministic paths if needed
    if (fromCodeLookup && storyData.story_code) {
      await migratePhotosToNewFormat(storyData);
    }
  }, []);

  // Helper function to migrate photos to the new deterministic format
  const migratePhotosToNewFormat = async (storyData: Story) => {
    if (!storyData.story_code) return;
    
    const baseStorageUrl = 'https://hlywucxwpzbqmzssmwpj.supabase.co/storage/v1/object/public/story-photos/';
    const updates: Record<string, string> = {};
    let migrationCount = 0;

    for (let i = 1; i <= 3; i++) {
      const photoUrl = storyData[`photo_link_${i}` as keyof Story] as string;
      if (!photoUrl) continue;

      const expectedPath = `stories/${storyData.story_code}/photo-${i}.webp`;
      const expectedUrl = `${baseStorageUrl}${expectedPath}`;

      // Check if photo needs migration (exists but doesn't match new format)
      if (photoUrl.startsWith(baseStorageUrl) && !photoUrl.includes(expectedPath)) {
        console.log(`📸 Migrating photo ${i} from old to new format...`);
        
        try {
          const oldKey = extractStorageKeyFromPublicUrl(photoUrl);
          if (oldKey) {
            // Try to copy within bucket first
            const { error: copyError } = await supabase.storage
              .from('story-photos')
              .copy(oldKey, expectedPath);

            if (!copyError) {
              // Success - update with new URL and cache busting
              const newUrl = `${expectedUrl}?v=${Date.now()}`;
              updates[`photo_link_${i}`] = newUrl;
              migrationCount++;
              console.log(`✅ Photo ${i} migrated successfully via copy`);
            } else {
              console.log(`⚠️ Copy failed for photo ${i}, trying fetch/upload method:`, copyError);
              // Fallback to fetch/upload method
              await migratePhotoViaFetchUpload(photoUrl, expectedPath, i, updates);
              migrationCount++;
            }
          }
        } catch (error) {
          console.error(`❌ Failed to migrate photo ${i}:`, error);
          toast.error(`Failed to migrate photo ${i}`);
        }
      } else if (!photoUrl.startsWith(baseStorageUrl)) {
        // External URL - fetch and upload
        console.log(`📸 Migrating external photo ${i} to new format...`);
        try {
          await migratePhotoViaFetchUpload(photoUrl, expectedPath, i, updates);
          migrationCount++;
        } catch (error) {
          console.error(`❌ Failed to migrate external photo ${i}:`, error);
          toast.error(`Failed to migrate external photo ${i}`);
        }
      }
    }

    // Apply updates to form data if any migrations occurred
    if (Object.keys(updates).length > 0) {
      console.log(`🔄 Applying photo migrations (${migrationCount} photos):`, updates);
      
      // Convert updates to proper Story partial
      const storyUpdates: Partial<Story> = {};
      Object.entries(updates).forEach(([key, value]) => {
        (storyUpdates as any)[key] = value;
      });
      
      setFormData(prev => ({ ...prev, ...storyUpdates }));
      toast.success(`Migrated ${migrationCount} photo(s) to new deterministic format`);
    }
  };

  // Helper function to migrate photo via fetch/upload
  const migratePhotoViaFetchUpload = async (sourceUrl: string, targetPath: string, photoNumber: number, updates: Record<string, string>) => {
    // Fetch the image
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Convert to WebP and resize if needed
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
    
    // Set canvas size (max 800x600 to keep file sizes reasonable)
    const maxWidth = 800;
    const maxHeight = 600;
    let { width, height } = img;
    
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to WebP
    const webpBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(resolve as BlobCallback, 'image/webp', 0.8);
    });
    
    if (!webpBlob) {
      throw new Error('Failed to convert image to WebP');
    }
    
    // Create File object
    const webpFile = new File([webpBlob], `photo-${photoNumber}.webp`, { type: 'image/webp' });
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('story-photos')
      .upload(targetPath, webpFile, {
        contentType: 'image/webp',
        upsert: true
      });
    
    if (uploadError) {
      throw new Error(`Failed to upload converted image: ${uploadError.message}`);
    }
    
    // Get public URL with cache busting
    const baseStorageUrl = 'https://hlywucxwpzbqmzssmwpj.supabase.co/storage/v1/object/public/story-photos/';
    const newUrl = `${baseStorageUrl}${targetPath}?v=${Date.now()}`;
    updates[`photo_link_${photoNumber}`] = newUrl;
    
    console.log(`✅ Photo ${photoNumber} migrated successfully via fetch/upload`);
    
    // Clean up
    URL.revokeObjectURL(img.src);
  };

  console.log('🎯 useStoryFormState: Hook called with storyId:', storyId);
  console.log('🎯 useStoryFormState: Story data:', story);
  console.log('🎯 useStoryFormState: Loading state:', isLoadingStory);

  // Load story data into form when it's fetched
  useEffect(() => {
    if (story) {
      console.log('🎯 useStoryFormState: Loading story data into form:', story);
      
      setFormData({
        ...story,
        photo_link_4: (story as any).photo_link_4 || '',
        photo_alt_4: (story as any).photo_alt_4 || '',
        ai_voice_name: story.ai_voice_name || 'Nova',
        ai_voice_model: story.ai_voice_model || 'tts-1',
        copyright_status: story.copyright_status === 'S' ? 'L' : (story.copyright_status || '©')
      });
    } else if (!storyId) {
      console.log('🎯 useStoryFormState: No storyId provided, using initial form data');
      setFormData(initialFormData);
    }
  }, [story, storyId]);

  const handleInputChange = (field: keyof Story, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (photoNumber: 1 | 2 | 3 | 4, url: string) => {
    handleInputChange(`photo_link_${photoNumber}` as keyof Story, url);
  };

  const handlePhotoRemove = async (photoNumber: 1 | 2 | 3 | 4) => {
    const photoUrl = formData[`photo_link_${photoNumber}` as keyof Story] as string;
    
    // If there's a photo URL, try to delete it from storage
    if (photoUrl) {
      try {
        const storageKey = extractStorageKeyFromPublicUrl(photoUrl);
        if (storageKey) {
          console.log('🗑️ Deleting photo from storage:', storageKey);
          const { error } = await supabase.storage
            .from('story-photos')
            .remove([storageKey]);
          
          // Treat 404 as success (file already missing)
          if (error && !error.message.includes('not found')) {
            console.error('❌ Error deleting photo:', error);
            throw new Error(`Failed to delete photo: ${error.message}`);
          }
          
          console.log('✅ Photo deleted successfully from storage');
        }
      } catch (error) {
        console.error('❌ Error in photo deletion:', error);
        // Don't throw here - we still want to remove from form even if storage delete fails
      }
    }
    
    // Clear from form data
    handleInputChange(`photo_link_${photoNumber}` as keyof Story, '');
    handleInputChange(`photo_alt_${photoNumber}` as keyof Story, '');
  };

  const handleVideoUpload = (url: string) => {
    handleInputChange('video_url', url);
  };

  const handleVideoRemove = () => {
    handleInputChange('video_url', '');
  };

  const handleVoiceChange = (voice: string) => {
    handleInputChange('ai_voice_name', voice);
  };

  const handleGenerateAudio = async () => {
    console.log('🎯 useStoryFormState: Starting audio generation for story:', formData.id);
    
    if (!formData.id) {
      throw new Error('Story must be saved before generating audio. Please save your story first.');
    }
    
    if (!formData.content?.trim()) {
      throw new Error('Story content is required to generate audio.');
    }
    
    setIsGeneratingAudio(true);
    
    try {
      // First ensure the voice selection is saved to the database
      const { error: updateError } = await supabase
        .from('stories')
        .update({
          ai_voice_name: formData.ai_voice_name || 'Nova',
          ai_voice_model: formData.ai_voice_model || 'tts-1'
        })
        .eq('id', formData.id);

      if (updateError) {
        console.error('🎯 useStoryFormState: Error updating voice settings:', updateError);
        throw new Error(`Failed to update voice settings: ${updateError.message}`);
      }

      console.log('🎯 useStoryFormState: Calling generate-story-audio with:', {
        storyId: formData.id,
        voiceName: formData.ai_voice_name || 'Nova'
      });

      const { data, error } = await supabase.functions.invoke('generate-story-audio', {
        body: { 
          storyId: formData.id,
          voiceName: formData.ai_voice_name || 'Nova'
        }
      });

      if (error) {
        console.error('🎯 useStoryFormState: Edge function error:', error);
        throw new Error(`Audio generation failed: ${error.message}`);
      }

      console.log('🎯 useStoryFormState: Audio generation response:', data);
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      // Optimistically update formData with new audio timestamp
      const now = new Date().toISOString();
      setFormData(prev => ({
        ...prev,
        audio_generated_at: now,
        // If the response includes audio URL, update it too
        ...(data?.audioUrl && { audio_url: data.audioUrl })
      }));
      console.log('=== AUDIO GENERATION SUCCESSFUL - OPTIMISTIC UPDATE APPLIED ===');
      
      // Refresh the story data to get the updated audio URL and other metadata
      if (refetchStory) {
        await refetchStory();
        console.log('=== AUDIO REFETCH COMPLETED - TIMESTAMP SHOULD BE UPDATED ===');
      }
      
    } catch (error) {
      console.error('🎯 useStoryFormState: Error generating audio:', error);
      throw error;
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleAudioUpload = async (file: File): Promise<boolean> => {
    console.log('🎯 useStoryFormState: Starting audio upload for story:', formData.id);
    
    if (!formData.id) {
      throw new Error('Story must be saved before uploading audio. Please save your story first.');
    }

    // Validate file type and size
    const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/aac'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload an audio file (MP3, WAV, M4A, or AAC).');
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('Audio file must be smaller than 50MB.');
    }

    // Check if audio exists and get confirmation if needed
    if (formData.audio_url) {
      const confirmed = window.confirm(
        'An audio recording already exists for this story. Do you want to replace it with the uploaded file?'
      );
      if (!confirmed) {
        return false; // User cancelled
      }
    }

    setIsUploadingAudio(true);
    
    try {
      // Create storage path using story code: {STORY_CODE}.mp3
      const audioFileName = `${formData.story_code}.mp3`;
      
      // Upload to story-audio bucket with upsert to replace existing
      const { error: uploadError } = await supabase.storage
        .from('story-audio')
        .upload(audioFileName, file, {
          contentType: file.type,
          upsert: true // This will overwrite existing file
        });

      if (uploadError) {
        console.error('🎯 useStoryFormState: Error uploading audio:', uploadError);
        throw new Error(`Failed to upload audio: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('story-audio')
        .getPublicUrl(audioFileName);

      // Calculate duration (rough estimate based on file size)
      const estimatedDuration = Math.ceil(file.size / 16000); // ~16KB per second for compressed audio

      console.log('🎯 useStoryFormState: Audio uploaded successfully, updating database');

      // Update story record with audio information
      const { error: updateError } = await supabase
        .from('stories')
        .update({
          audio_url: publicUrl,
          audio_generated_at: new Date().toISOString(), // Track when audio was last updated
          audio_duration_seconds: estimatedDuration,
          audio_segments: 1 // Uploaded files are single segment
        })
        .eq('id', formData.id);

      if (updateError) {
        console.error('🎯 useStoryFormState: Error updating story with audio info:', updateError);
        throw new Error(`Failed to update story: ${updateError.message}`);
      }

      // Update form data optimistically
      setFormData(prev => ({
        ...prev,
        audio_url: publicUrl,
        audio_generated_at: new Date().toISOString(),
        audio_duration_seconds: estimatedDuration,
        audio_segments: 1
      }));

      console.log('=== AUDIO UPLOAD SUCCESSFUL - OPTIMISTIC UPDATE APPLIED ===');
      
      // Refresh the story data to get the updated audio URL and metadata
      if (refetchStory) {
        await refetchStory();
        console.log('=== AUDIO REFETCH COMPLETED - DATA SHOULD BE UPDATED ===');
      }

      return true; // Upload successful
      
    } catch (error) {
      console.error('🎯 useStoryFormState: Error uploading audio:', error);
      throw error;
    } finally {
      setIsUploadingAudio(false);
    }
  };

  // Function to update form data externally
  const updateFormData = (updates: Partial<Story>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    isLoadingStory,
    isGeneratingAudio,
    isUploadingAudio,
    refetchStory,
    populateFormWithStory,
    handleInputChange,
    updateFormData,
    handlePhotoUpload,
    handlePhotoRemove,
    handleVideoUpload,
    handleVideoRemove,
    handleVoiceChange,
    handleGenerateAudio,
    handleAudioUpload,
    handleVideoFileUpload: async (file: File): Promise<boolean> => {
      console.log('🎥 useStoryFormState: Starting video upload for story:', formData.id);
      
      if (!formData.id) {
        throw new Error('Story must be saved before uploading video. Please save your story first.');
      }

      // Validate file type and size
      const allowedTypes = ['video/mp4'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload an MP4 video file.');
      }

      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        throw new Error('Video file must be smaller than 100MB.');
      }

      // Check if video exists and get confirmation if needed
      if (formData.video_url) {
        const confirmed = window.confirm(
          'A video already exists for this story. Do you want to replace it with the uploaded file?'
        );
        if (!confirmed) {
          return false; // User cancelled
        }
      }

      setIsUploadingAudio(true); // Reuse loading state
      
      try {
        // Create storage path using story code: {STORY_CODE}.mp4
        const videoFileName = `${formData.story_code}.mp4`;
        
        // Upload to story-videos bucket with upsert to replace existing
        const { error: uploadError } = await supabase.storage
          .from('story-videos')
          .upload(videoFileName, file, {
            contentType: file.type,
            upsert: true // This will overwrite existing file
          });

        if (uploadError) {
          console.error('🎥 useStoryFormState: Error uploading video:', uploadError);
          throw new Error(`Failed to upload video: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('story-videos')
          .getPublicUrl(videoFileName);

        // Calculate duration (rough estimate based on file size - will need proper duration calculation)
        const estimatedDuration = Math.ceil(file.size / 1000000) * 10; // Rough estimate

        console.log('🎥 useStoryFormState: Video uploaded successfully, updating database');

        // Update story record with video information
        const { error: updateError } = await supabase
          .from('stories')
          .update({
            video_url: publicUrl,
            video_duration_seconds: estimatedDuration
          })
          .eq('id', formData.id);

        if (updateError) {
          console.error('🎥 useStoryFormState: Error updating story with video info:', updateError);
          throw new Error(`Failed to update story: ${updateError.message}`);
        }

        // Update form data optimistically
        setFormData(prev => ({
          ...prev,
          video_url: publicUrl,
          video_duration_seconds: estimatedDuration
        }));

        console.log('=== VIDEO UPLOAD SUCCESSFUL - OPTIMISTIC UPDATE APPLIED ===');
        
        // Refresh the story data to get the updated video URL and metadata
        if (refetchStory) {
          await refetchStory();
          console.log('=== VIDEO REFETCH COMPLETED - DATA SHOULD BE UPDATED ===');
        }

        return true; // Upload successful
        
      } catch (error) {
        console.error('🎥 useStoryFormState: Error uploading video:', error);
        throw error;
      } finally {
        setIsUploadingAudio(false); // Reuse loading state
      }
    },
    error
  };
};

