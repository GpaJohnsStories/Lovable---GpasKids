import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SecureAdminRoute from '@/components/admin/SecureAdminRoute';
import SuperTextStoryStatus from '@/components/SuperTextStoryStatus';
import SplitViewEditor from '@/components/editor/SplitViewEditor';
import './SuperText.css';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Image, Trash2, Volume2, Play, Square, Video, Headphones } from "lucide-react";
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { useStorySave } from '@/hooks/useStorySave';
import { extractHeaderTokens } from "@/utils/headerTokens";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useVoiceTesting } from '@/hooks/useVoiceTesting';
import LoadingSpinner from '@/components/LoadingSpinner';
import StoryVideoUpload from "@/components/StoryVideoUpload";

const SuperText: React.FC = () => {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [storyCode, setStoryCode] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [foundStoryTitle, setFoundStoryTitle] = React.useState('');
  const [foundStory, setFoundStory] = React.useState<any>(null);
  const [noStoryFound, setNoStoryFound] = React.useState(false);
  const [showInvalidCode, setShowInvalidCode] = React.useState(false);
  const [isUpdatingText, setIsUpdatingText] = React.useState(false);
  const [isAddingText, setIsAddingText] = React.useState(false);
  const [thirdCondition, setThirdCondtion] = React.useState(false); // Placeholder for future condition
  
  // Photo state management
  const [photoLinks, setPhotoLinks] = React.useState<{[key: number]: string}>({
    1: '',
    2: '',
    3: ''
  });
  const [photoAlts, setPhotoAlts] = React.useState<{[key: number]: string}>({
    1: '',
    2: '',
    3: ''
  });
  const [uploading, setUploading] = React.useState<{[key: number]: boolean}>({});
  
  // Voice and media state management
  const [selectedVoice, setSelectedVoice] = React.useState<string>('Nova');
  const [isGeneratingAudio, setIsGeneratingAudio] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState<string>('');
  const [audioUrl, setAudioUrl] = React.useState<string>('');
  
  // Story content state for editor
  const [storyContent, setStoryContent] = React.useState<string>('');
  const [fontSize, setFontSize] = React.useState<number>(21);
  const [previewContent, setPreviewContent] = React.useState<string | null>(null);
  
  // Google Drive import state
  const [googleDriveShareCode, setGoogleDriveShareCode] = React.useState<string>('');
  const [isImportingFromDrive, setIsImportingFromDrive] = React.useState(false);
  
  const { lookupStoryByCode } = useStoryCodeLookup();
  const { saveStory, isSaving } = useStorySave();
  const {
    currentlyPlaying,
    loadingVoice,
    playVoice,
    stopAudio
  } = useVoiceTesting();
  
  const allowedCategories = ["Fun", "Life", "North Pole", "World Changers", "WebText", "BioText"];

  // Check if verification should be allowed
  const canVerify = storyCode.trim() && category;

  // Image resize function
  const resizeImage = (file: File, maxWidth = 800, maxHeight = 600, quality = 0.85): Promise<File> => {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = document.createElement('img');
      img.onload = () => {
        const { width, height } = img;
        let { width: newWidth, height: newHeight } = img;
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

  // Handle photo upload
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
    setUploading(prev => ({ ...prev, [photoNumber]: true }));
    
    try {
      const { data: session } = await supabase.auth.getSession();
      console.log('📝 Current session:', session?.session?.user?.id ? 'User logged in' : 'No user');
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin_safe');
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
      const { data, error } = await supabase.storage.from('story-photos').upload(fileName, resizedFile);
      console.log('📤 Upload response:', { data, error });
      
      if (error) {
        console.error('❌ Upload failed:', error);
        throw error;
      }

      console.log('🔗 Getting public URL...');
      const { data: { publicUrl } } = supabase.storage.from('story-photos').getPublicUrl(fileName);
      console.log('✅ Public URL generated:', publicUrl);
      
      setPhotoLinks(prev => ({ ...prev, [photoNumber]: publicUrl }));
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
      setUploading(prev => ({ ...prev, [photoNumber]: false }));
    }
  };

  // Handle photo remove
  const handlePhotoRemove = (photoNumber: 1 | 2 | 3) => {
    setPhotoLinks(prev => ({ ...prev, [photoNumber]: '' }));
    setPhotoAlts(prev => ({ ...prev, [photoNumber]: '' }));
  };

  // Validate story code format: aaa-bbb (7 chars, dash at position 4)
  const isValidStoryCode = (code: string) => {
    return code.length === 7 && code.charAt(3) === '-' && /^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}$/.test(code);
  };

  // Handle input blur to show invalid code message
  const handleStoryCodeBlur = () => {
    if (storyCode.trim() && !isValidStoryCode(storyCode.trim())) {
      setShowInvalidCode(true);
      setFoundStory(null);
      setFoundStoryTitle('');
      setNoStoryFound(false);
    } else {
      setShowInvalidCode(false);
    }
  };

  // Handle input change
  const handleStoryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value.toUpperCase(); // Convert to uppercase
    setStoryCode(newCode);
    setShowInvalidCode(false); // Clear invalid message when typing
    setIsUpdatingText(false); // Reset updating state when code changes
    setIsAddingText(false); // Reset adding state when code changes
  };

  // Debounced lookup function
  const debouncedLookup = useCallback(async (code: string) => {
    console.log('🔧 Debounced lookup called with:', code);
    
    if (!code.trim() || code.trim().length < 3) {
      setFoundStoryTitle('');
      setFoundStory(null);
      setNoStoryFound(false);
      return;
    }

    // Only proceed with lookup if verification conditions are met
    if (!canVerify) {
      console.log('🔧 Verification not allowed - clearing results');
      setFoundStoryTitle('');
      setFoundStory(null);
      setNoStoryFound(false);
      return;
    }

    const result = await lookupStoryByCode(code.trim(), true);
    console.log('🔧 Lookup result:', result);
    
    if (result.found && result.story) {
      setFoundStoryTitle(result.story.title);
      setFoundStory(result.story);
      setNoStoryFound(false);
    } else if (!result.error) {
      setFoundStoryTitle('');
      setFoundStory(null);
      setNoStoryFound(true);
    }
  }, [lookupStoryByCode, canVerify]);

  // Debounce timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (canVerify && storyCode.trim() && isValidStoryCode(storyCode.trim())) {
        debouncedLookup(storyCode);
      } else {
        // Clear results if can't verify or code is not valid format
        setFoundStoryTitle('');
        setFoundStory(null);
        setNoStoryFound(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [storyCode, canVerify, debouncedLookup]);

  const handleSaveAndClear = async () => {
    // Check if we're in editing mode
    if (!isUpdatingText && !isAddingText) {
      toast({
        title: "No Content to Save",
        description: "Please choose 'Update existing text' or 'Add new text' first",
        variant: "destructive"
      });
      return;
    }

    // Validate story code and category for new stories
    if (!isValidStoryCode(storyCode)) {
      toast({
        title: "Invalid Story Code",
        description: "Please enter a valid story code (format: ABC-123)",
        variant: "destructive"
      });
      return;
    }

    if (isAddingText && !category) {
      toast({
        title: "Category Required",
        description: "Please select a category for the new story",
        variant: "destructive"
      });
      return;
    }

    // Extract tokens from content for validation and data
    const { tokens, contentWithoutTokens } = extractHeaderTokens(storyContent);
    
    // Validate title token exists
    if (!tokens.title) {
      toast({
        title: "Title Required",
        description: "Please add a TITLE token to your story content",
        variant: "destructive"
      });
      return;
    }

    // Build story payload
    const storyPayload = {
      ...(foundStory?.id && { id: foundStory.id }), // Include ID for updates
      story_code: storyCode,
      category: category as "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText",
      title: tokens.title || '',
      tagline: tokens.tagline || '',
      author: tokens.author || '',
      excerpt: tokens.excerpt || '',
      content: storyContent,
      photo_link_1: photoLinks[1] || '',
      photo_link_2: photoLinks[2] || '',
      photo_link_3: photoLinks[3] || '',
      photo_alt_1: photoAlts[1] || '',
      photo_alt_2: photoAlts[2] || '',
      photo_alt_3: photoAlts[3] || '',
      video_url: videoUrl,
      audio_url: audioUrl,
      ai_voice_name: selectedVoice,
      ai_voice_model: 'tts-1',
      published: foundStory?.published || 'N',
      google_drive_link: foundStory?.google_drive_link || ''
    };

    console.log('🚀 Saving story payload:', storyPayload);

    try {
      const success = await saveStory(storyPayload, async () => {
        console.log('✅ Save successful, fetching updated story for verification');
        
        // Clear preview first for visual effect
        setPreviewContent('');
        
        // Small delay then fetch and show saved content
        setTimeout(async () => {
          const result = await lookupStoryByCode(storyCode, true);
          if (result.found && result.story) {
            setPreviewContent(result.story.content);
            console.log('🔍 Preview updated with saved content');
            
            // Show confirmation dialog after preview is updated
            setShowConfirmDialog(true);
          }
        }, 200);
      });
      
      if (!success) {
        console.log('❌ Save failed');
      }
    } catch (error) {
      console.error('💥 Error during save:', error);
    }
  };

  const handleConfirmYes = () => {
    // Clear all form data
    setStoryCode('');
    setCategory('');
    setFoundStory(null);
    setFoundStoryTitle('');
    setNoStoryFound(false);
    setStoryContent('');
    setPreviewContent(null);
    setPhotoLinks({ 1: '', 2: '', 3: '' });
    setPhotoAlts({ 1: '', 2: '', 3: '' });
    setVideoUrl('');
    setAudioUrl('');
    setGoogleDriveShareCode('');
    setIsUpdatingText(false);
    setIsAddingText(false);
    
    // Close dialog
    setShowConfirmDialog(false);
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    toast({
      title: "Form Cleared",
      description: "Ready for new content creation"
    });
  };

  const handleConfirmNo = () => {
    setShowConfirmDialog(false);
    // Keep current scroll position
  };

  // Google Drive import handler
  const handleGoogleDriveUpload = async () => {
    console.log('🔧 Google Drive upload clicked');
    
    // Validate Step 1: Story Code and Category must be filled
    if (!storyCode.trim() || !category) {
      toast({
        title: "ERROR",
        description: "Must Complete Step 1 first, then enter the Google Drive Share Code, and then click on Submit.",
        variant: "destructive",
      });
      // Clear form
      setStoryCode('');
      setCategory('');
      setFoundStory(null);
      setFoundStoryTitle('');
      setNoStoryFound(false);
      setStoryContent('');
      setPreviewContent(null);
      setPhotoLinks({ 1: '', 2: '', 3: '' });
      setPhotoAlts({ 1: '', 2: '', 3: '' });
      setVideoUrl('');
      setAudioUrl('');
      setGoogleDriveShareCode('');
      setIsUpdatingText(false);
      setIsAddingText(false);
      return;
    }

    // Validate Google Drive share code is present
    if (!googleDriveShareCode.trim()) {
      toast({
        title: "Missing Share Code",
        description: "Enter the Google Drive Share Code first, then click on Submit.",
        variant: "destructive",
      });
      // DO NOT clear form
      return;
    }

    setIsImportingFromDrive(true);
    
    try {
      console.log('📥 Importing from Google Drive:', googleDriveShareCode);
      const { data, error } = await supabase.functions.invoke('import-google-drive-text', {
        body: { googleDriveShareCode: googleDriveShareCode.trim() }
      });

      if (error) {
        console.error('❌ Error calling function:', error);
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to import text');
      }

      console.log('✅ Successfully imported text, length:', data.textContent?.length);
      
      // Set the imported content as story content
      setStoryContent(data.textContent);
      setIsAddingText(true); // Enable the editor
      
      // Clear Google Drive input after successful import
      setGoogleDriveShareCode('');
      
      toast({
        title: "Import Successful",
        description: "Google Drive text has been loaded into the editor.",
        variant: "default",
      });

    } catch (error) {
      console.error('💥 Google Drive import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'Failed to import from Google Drive',
        variant: "destructive",
      });
    } finally {
      setIsImportingFromDrive(false);
    }
  };

  // Handle text action (Update/Add) decisions
  const handleTextActionYes = () => {
    if (foundStory) {
      console.log('Update text confirmed for story:', foundStory.title);
      
      // Populate all form fields with existing story data
      setCategory(foundStory.category || '');
      
      // Populate photo links
      setPhotoLinks({
        1: foundStory.photo_link_1 || '',
        2: foundStory.photo_link_2 || '',
        3: foundStory.photo_link_3 || ''
      });
      
      // Populate photo alt texts
      setPhotoAlts({
        1: foundStory.photo_alt_1 || '',
        2: foundStory.photo_alt_2 || '',
        3: foundStory.photo_alt_3 || ''
      });
      
      // Populate video and audio URLs
      setVideoUrl(foundStory.video_url || '');
      setAudioUrl(foundStory.audio_url || '');
      setSelectedVoice(foundStory.ai_voice_name || 'Nova');
      
      // Populate story content for editor
      setStoryContent(foundStory.content || '');
      
      setIsUpdatingText(true);
      console.log('Form populated with existing story data:', {
        category: foundStory.category,
        photos: {
          photo_link_1: foundStory.photo_link_1,
          photo_link_2: foundStory.photo_link_2,
          photo_link_3: foundStory.photo_link_3
        },
        photo_alts: {
          photo_alt_1: foundStory.photo_alt_1,
          photo_alt_2: foundStory.photo_alt_2,
          photo_alt_3: foundStory.photo_alt_3
        }
      });
      
      // TODO: Implement update functionality
    } else {
      // For new stories, require category selection first
      if (!category) {
        toast({
          title: "Category Required",
          description: "Please select a category before proceeding with the new story.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Add new text confirmed for code:', storyCode);
      
      // Insert story tokens at the beginning of content
      const tokensText = `{{TITLE}}{{/TITLE}}
{{TAGLINE}}{{/TAGLINE}}
{{AUTHOR}}{{/AUTHOR}}
{{EXCERPT}}{{/EXCERPT}}

`;
      
      setStoryContent(tokensText);
      setIsAddingText(true);
      
      console.log('New story editor ready with tokens for category:', category);
      // TODO: Implement add functionality
    }
  };

  const handleTextActionNo = () => {
    if (foundStory) {
      console.log('Update text declined for story:', foundStory.title);
    } else {
      console.log('Add new text declined for code:', storyCode);
    }
    // Clear the form for both update and add cases
    setStoryCode('');
    setCategory('');
    setFoundStoryTitle('');
    setFoundStory(null);
    setNoStoryFound(false);
    setShowInvalidCode(false);
    setIsUpdatingText(false);
    setIsAddingText(false);
    // Clear photo state
    setPhotoLinks({ 1: '', 2: '', 3: '' });
    setPhotoAlts({ 1: '', 2: '', 3: '' });
    setUploading({});
    // Clear content state
    setStoryContent('');
  };

  return (
    <SecureAdminRoute>
      <Helmet>
        <title>Super Text Manager - Admin</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pb-8 -mt-[30px]">
        {/* Title */}
        <h1 className="text-3xl font-bold text-amber-800 mb-6 pl-2">
          Super Text Manager
        </h1>

        {/* Action Buttons Bar - Full Width Top */}
        <div className="w-full mb-6">
          <div className="flex justify-center items-center gap-6">
            <button
              onClick={handleSaveAndClear}
              className="w-80 h-16 px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 flex items-center justify-center"
              style={{
                backgroundColor: '#228B22', // Forest Green
                color: '#FFD700', // Golden Yellow
                borderColor: '#1F7A1F', // Darker green for border
                boxShadow: '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)';
              }}
            >
              Save & Clear Form
            </button>
            
            <button
              onClick={() => {
                // Clear all form fields and reset state
                setStoryCode('');
                setCategory('');
                setFoundStoryTitle('');
                setFoundStory(null);
                setNoStoryFound(false);
                setShowInvalidCode(false);
                setIsUpdatingText(false);
                setIsAddingText(false);
                // Clear photo state
                setPhotoLinks({ 1: '', 2: '', 3: '' });
                setPhotoAlts({ 1: '', 2: '', 3: '' });
                setUploading({});
                // Clear content state
                setStoryContent('');
                console.log('All edits cancelled and form cleared');
              }}
              className="w-80 h-16 px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 flex items-center justify-center"
              style={{
                backgroundColor: '#dc2626', // Red Primary
                color: '#ffffff', // Bold White
                borderColor: '#b91c1c', // Darker red for border
                boxShadow: '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)';
              }}
            >
              <span className="text-center leading-tight">Cancel All Edits<br />& Clear Form</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout: Two Columns */}
        <div className="block overflow-x-auto pt-4 pl-4">
          <div className="flex items-start justify-center gap-6 w-full max-w-7xl mx-auto">
            {/* Left Side: Story Details */}
            <div className="flex-1">
              <Card className="bg-white border-4 h-fit relative" style={{ borderColor: '#22c55e' }}>
                {/* Blue dot with "1" in top left corner */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                  1
                </div>
                
                {/* Text Action Indicator in top right corner INSIDE the box */}
                {isUpdatingText ? (
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      className="px-4 py-2 rounded-full font-bold text-lg border-2"
                      style={{
                        backgroundColor: '#228B22', // Green
                        color: '#ffffff', // White text
                        borderColor: '#1F7A1F', // Darker green border
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      Updating Text
                    </div>
                  </div>
                ) : isAddingText ? (
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      className="px-4 py-2 rounded-full font-bold text-lg border-2"
                      style={{
                        backgroundColor: '#228B22', // Green
                        color: '#ffffff', // White text
                        borderColor: '#1F7A1F', // Darker green border
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      Adding New Text
                    </div>
                  </div>
                ) : canVerify && isValidStoryCode(storyCode.trim()) && (foundStory || noStoryFound) ? (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="flex flex-col items-end gap-2">
                      {/* Main Action Message Pill */}
                      <div
                        className="px-4 py-2 rounded-full font-bold text-lg border-2"
                        style={{
                          backgroundColor: foundStory ? '#dc2626' : '#228B22', // Red if update, Green if add
                          color: '#FFD700', // Golden Yellow text
                          borderColor: foundStory ? '#b91c1c' : '#1F7A1F', // Darker border
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}
                      >
                        {foundStory ? 'Update This Text?' : 'Add New Text?'}
                      </div>
                      
                      {/* Yes/No Buttons - No on left, Yes on right */}
                      <div className="flex gap-2">
                        {/* No Button (left) */}
                        <button
                          onClick={handleTextActionNo}
                          className="px-4 py-2 rounded-full font-bold text-lg border-2 hover:scale-105 transition-transform"
                          style={{
                            backgroundColor: '#dc2626', // Red
                            color: '#ffffff', // White text
                            borderColor: '#b91c1c',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                          }}
                        >
                          No
                        </button>
                        
                        {/* Yes Button (right) */}
                        <button
                          onClick={handleTextActionYes}
                          className="px-4 py-2 rounded-full font-bold text-lg border-2 hover:scale-105 transition-transform"
                          style={{
                            backgroundColor: '#228B22', // Green
                            color: '#ffffff', // White text
                            borderColor: '#1F7A1F',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                          }}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
                
                {/* Invalid Code Entered Message */}
                {showInvalidCode && (
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      className="px-4 py-2 rounded-full font-bold text-lg border-2"
                      style={{
                        backgroundColor: '#dc2626', // Red
                        color: '#FFD700', // Golden Yellow text
                        borderColor: '#b91c1c', // Darker red border
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      Invalid Code Entered
                    </div>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle 
                    className="flex items-center gap-2 font-bold" 
                    style={{
                      color: '#22c55e',
                      fontSize: '24px',
                      lineHeight: '1.2',
                      fontWeight: '700'
                    }}
                  >
                    <FileText className="h-5 w-5" style={{ color: '#22c55e' }} />
                    <span style={{ color: '#22c55e' }}>Story Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="story-code" className="font-bold text-xl text-orange-accent block">
                          Current or New<br />Unique Code:
                        </Label>
                        <div className="w-1/2">
                           <Input
                             id="story-code"
                             value={storyCode}
                             onChange={handleStoryCodeChange}
                             onBlur={handleStoryCodeBlur}
                             placeholder="Code"
                             className="w-full px-3 py-2 text-base border rounded-md border-orange-accent border-2"
                             style={{ fontFamily: 'Arial, sans-serif', fontSize: '21px', fontWeight: 'bold', color: '#000000' }}
                             autoComplete="off"
                             disabled={isUpdatingText || isAddingText}
                           />
                        </div>
                      </div>
                      
                    <div className="flex items-end gap-4">
                      <div className="w-1/2">
                         <Select value={category} onValueChange={setCategory} disabled={isUpdatingText || isAddingText}>
                           <SelectTrigger className="w-full border-2 font-bold text-xl" style={{ borderColor: '#8B4513', color: '#FF8C00' }}>
                             <SelectValue placeholder="Category" />
                           </SelectTrigger>
                        <SelectContent className="bg-white z-[100]">
                          <SelectItem value="Fun">Fun</SelectItem>
                          <SelectItem value="Life">Life</SelectItem>
                          <SelectItem value="North Pole">North Pole</SelectItem>
                          <SelectItem value="World Changers">World Changers</SelectItem>
                          <SelectItem value="WebText">WebText</SelectItem>
                          <SelectItem value="BioText">BioText</SelectItem>
                        </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Audio and Video Icons */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded bg-gray-100 border border-gray-300">
                          <Headphones className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 rounded bg-gray-100 border border-gray-300">
                          <Video className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                    </div>

                      {/* Story Title Display Box - Moved below category/icons */}
                      {canVerify && foundStoryTitle && (
                        <div className="w-full mt-4">
                          <div className="w-full p-4 border-2 rounded-md bg-blue-50" style={{ borderColor: '#22c55e' }}>
                            <div className="text-sm font-bold text-gray-600 mb-2">Found Story Title:</div>
                            <div className="font-bold text-lg" style={{ color: '#22c55e', fontSize: '21px' }}>
                              {foundStoryTitle}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* No Story Found Message - Moved below category/icons */}
                      {canVerify && noStoryFound && storyCode.trim().length >= 3 && (
                        <div className="w-full mt-4">
                          <div className="w-full p-4 border-2 rounded-md bg-gray-50" style={{ borderColor: '#6b7280' }}>
                            <div className="text-sm font-bold text-gray-600 mb-2">Lookup Result:</div>
                            <div className="font-bold text-lg text-gray-600" style={{ fontSize: '21px' }}>
                              No story found for this code
                            </div>
                          </div>
                        </div>
                      )}
                </CardContent>
              </Card>
              
              {/* Story Photos Box */}
              <Card className="bg-white border-4 h-fit relative mt-6" style={{ borderColor: '#814d2e' }}>
                {/* Blue dot with "2" in top left corner */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
                  <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>2</span>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{ color: '#814d2e' }}>
                    <Image className="h-5 w-5" />
                    Story Photos
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-3">
                  <table className="w-full table-fixed border-collapse border-2" style={{ borderColor: '#9c441a' }}>
                    <tbody>
                      <tr>
                        <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                          <div className="relative">
                            {photoLinks[1] ? (
                              <>
                                <img src={photoLinks[1]} alt="Photo 1" className="w-full h-20 object-cover rounded" />
                                <button 
                                  type="button" 
                                  onClick={() => handlePhotoRemove(1)} 
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
                            {photoLinks[2] ? (
                              <>
                                <img src={photoLinks[2]} alt="Photo 2" className="w-full h-20 object-cover rounded" />
                                <button 
                                  type="button" 
                                  onClick={() => handlePhotoRemove(2)} 
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
                            {photoLinks[3] ? (
                              <>
                                <img src={photoLinks[3]} alt="Photo 3" className="w-full h-20 object-cover rounded" />
                                <button 
                                  type="button" 
                                  onClick={() => handlePhotoRemove(3)} 
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
                      
                      <tr>
                        <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                          <input 
                            type="text" 
                            placeholder="Alt text" 
                            value={photoAlts[1] || ''} 
                            onChange={(e) => setPhotoAlts(prev => ({ ...prev, 1: e.target.value }))} 
                            className="w-full text-xs p-1 border rounded" 
                          />
                        </td>
                        <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                          <input 
                            type="text" 
                            placeholder="Alt text" 
                            value={photoAlts[2] || ''} 
                            onChange={(e) => setPhotoAlts(prev => ({ ...prev, 2: e.target.value }))} 
                            className="w-full text-xs p-1 border rounded" 
                          />
                        </td>
                        <td className="p-2 border" style={{ borderColor: '#9c441a' }}>
                          <input 
                            type="text" 
                            placeholder="Alt text" 
                            value={photoAlts[3] || ''} 
                            onChange={(e) => setPhotoAlts(prev => ({ ...prev, 3: e.target.value }))} 
                            className="w-full text-xs p-1 border rounded" 
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              
              {/* Story Video Box */}
              <Card className="bg-white border-4 h-fit relative mt-6" style={{ borderColor: '#9333ea' }}>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: '#FF8C42' }}>
                  <span className="text-black text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>B</span>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{ color: '#9333ea' }}>
                    <Video className="h-5 w-5" />
                    Story Video
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <StoryVideoUpload 
                    videoUrl={videoUrl} 
                    onVideoUpload={setVideoUrl} 
                    onVideoRemove={() => setVideoUrl('')} 
                  />
                </CardContent>
              </Card>
              
              {/* Audio Upload Box */}
              <Card className="bg-white border-4 h-fit relative mt-6" style={{ borderColor: '#4A7C59' }}>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: '#FF8C42' }}>
                  <span className="text-black text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>C</span>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{ color: '#4A7C59' }}>
                    <Volume2 className="h-5 w-5" />
                    Audio Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Audio upload functionality will be added back here.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Side: Story Status */}
            <div className="flex-1">
              <SuperTextStoryStatus story={foundStory} />
              
              {/* Create AI Audio File Box */}
              <Card className="h-fit border-2 relative mt-6" style={{ borderColor: '#2563eb' }}>
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
                  <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>4</span>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{ color: '#2563eb' }}>
                    <Volume2 className="h-5 w-5" />
                    Create AI Audio File
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Label className="text-xs font-bold text-gray-700 mb-1 block">Choose Voice</Label>
                      <Select value={selectedVoice || 'Nova'} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="w-full text-xs" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
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
                      <button 
                        type="button"
                        onClick={async () => {
                          try {
                            console.log('🎵 SuperText: Generate audio clicked');
                            setIsGeneratingAudio(true);
                            // TODO: Implement audio generation
                            toast({
                              title: "Audio Generation",
                              description: "Audio generation functionality to be implemented"
                            });
                          } catch (error) {
                            console.error('🎵 SuperText: Audio generation error:', error);
                            toast({
                              title: "Audio Generation Failed",
                              description: error instanceof Error ? error.message : "Failed to generate audio. Please try again.",
                              variant: "destructive"
                            });
                          } finally {
                            setIsGeneratingAudio(false);
                          }
                        }}
                        disabled={isGeneratingAudio || !foundStory?.content?.trim()}
                        className="w-full h-9 text-sm font-bold text-white bg-orange-600 border-orange-700 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md border flex items-center justify-center gap-2"
                      >
                        <Volume2 className="h-4 w-4" />
                        {isGeneratingAudio ? 'Generating...' : foundStory?.id ? 'Generate Audio' : 'Story Required'}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voice Previews Box */}
              <Card className="h-fit border-2 relative mt-6" style={{ borderColor: '#2563eb' }}>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: '#FF8C42' }}>
                  <span className="text-black text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>A</span>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{ color: '#2563eb' }}>
                    <Volume2 className="h-5 w-5" />
                    Voice Previews
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <table className="w-full table-fixed border-collapse" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                    <tbody>
                      <tr>
                        <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                          <div className="text-xs font-bold mb-1">Buddy</div>
                          <div className="text-xs text-gray-600 mb-2">Clear, neutral voice (Alloy)</div>
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
                                onClick={() => playVoice('alloy', foundStory?.content || 'Hello, I am Buddy. This is a voice preview test.', 'Voice Preview')}
                              >
                                <Play className="h-3 w-3" />
                                Test
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" 
                              onClick={() => setSelectedVoice('alloy')}
                            >
                              Use
                            </button>
                          </div>
                        </td>
                        <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                          <div className="text-xs font-bold mb-1">Gpa John</div>
                          <div className="text-xs text-gray-600 mb-2">Deep, resonant voice (Echo)</div>
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
                                onClick={() => playVoice('echo', foundStory?.content || 'Hello, I am Gpa John. This is a voice preview test.', 'Voice Preview')}
                              >
                                <Play className="h-3 w-3" />
                                Test
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" 
                              onClick={() => setSelectedVoice('echo')}
                            >
                              Use
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                          <div className="text-xs font-bold mb-1">Fluffy</div>
                          <div className="text-xs text-gray-600 mb-2">British accent, storytelling (Fable)</div>
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
                                onClick={() => playVoice('fable', foundStory?.content || 'Hello, I am Fluffy. This is a voice preview test.', 'Voice Preview')}
                              >
                                <Play className="h-3 w-3" />
                                Test
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" 
                              onClick={() => setSelectedVoice('fable')}
                            >
                              Use
                            </button>
                          </div>
                        </td>
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
                                onClick={() => playVoice('nova', foundStory?.content || 'Hello, I am Nova. This is a voice preview test.', 'Voice Preview')}
                              >
                                <Play className="h-3 w-3" />
                                Test
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" 
                              onClick={() => setSelectedVoice('nova')}
                            >
                              Use
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                          <div className="text-xs font-bold mb-1">Max</div>
                          <div className="text-xs text-gray-600 mb-2">Deep, authoritative voice (Onyx)</div>
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
                                onClick={() => playVoice('onyx', foundStory?.content || 'Hello, I am Max. This is a voice preview test.', 'Voice Preview')}
                              >
                                <Play className="h-3 w-3" />
                                Test
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" 
                              onClick={() => setSelectedVoice('onyx')}
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
                                onClick={() => playVoice('shimmer', foundStory?.content || 'Hello, I am Shimmer. This is a voice preview test.', 'Voice Preview')}
                              >
                                <Play className="h-3 w-3" />
                                Test
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" 
                              onClick={() => setSelectedVoice('shimmer')}
                            >
                              Use
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                          <div className="text-xs font-bold mb-1">Ash</div>
                          <div className="text-xs text-gray-600 mb-2">Gentle and neutral, calming</div>
                          <div className="flex gap-1 justify-center">
                            {loadingVoice === 'ash' ? (
                              <div className="flex items-center gap-1 px-2 py-1 text-xs">
                                <LoadingSpinner />
                                <span>Testing...</span>
                              </div>
                            ) : currentlyPlaying === 'ash' ? (
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
                                onClick={() => playVoice('ash', foundStory?.content || 'Hello, I am Ash. This is a voice preview test.', 'Voice Preview')}
                              >
                                <Play className="h-3 w-3" />
                                Test
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" 
                              onClick={() => setSelectedVoice('ash')}
                            >
                              Use
                            </button>
                          </div>
                        </td>
                        <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                          <div className="text-xs font-bold mb-1">Coral</div>
                          <div className="text-xs text-gray-600 mb-2">Bright and clear, youthful tone</div>
                          <div className="flex gap-1 justify-center">
                            {loadingVoice === 'coral' ? (
                              <div className="flex items-center gap-1 px-2 py-1 text-xs">
                                <LoadingSpinner />
                                <span>Testing...</span>
                              </div>
                            ) : currentlyPlaying === 'coral' ? (
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
                                onClick={() => playVoice('coral', foundStory?.content || 'Hello, I am Coral. This is a voice preview test.', 'Voice Preview')}
                              >
                                <Play className="h-3 w-3" />
                                Test
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" 
                              onClick={() => setSelectedVoice('coral')}
                            >
                              Use
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                          <div className="text-xs font-bold mb-1">Sparky</div>
                          <div className="text-xs text-gray-600 mb-2">Warm and thoughtful, reflective (Sage)</div>
                          <div className="flex gap-1 justify-center">
                            {loadingVoice === 'sage' ? (
                              <div className="flex items-center gap-1 px-2 py-1 text-xs">
                                <LoadingSpinner />
                                <span>Testing...</span>
                              </div>
                            ) : currentlyPlaying === 'sage' ? (
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
                                onClick={() => playVoice('sage', foundStory?.content || 'Hello, I am Sparky. This is a voice preview test.', 'Voice Preview')}
                              >
                                <Play className="h-3 w-3" />
                                Test
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" 
                              onClick={() => setSelectedVoice('sage')}
                            >
                              Use
                            </button>
                          </div>
                        </td>
                        <td className="p-2 border text-center" style={{ borderColor: '#9c441a', borderWidth: '2px' }}>
                          <div className="text-xs text-gray-600">Available for future voices</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* Google Drive Upload Box */}
              <Card className="h-fit relative mt-6" style={{
                borderColor: '#A0522D',
                borderWidth: '4px'
              }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold" style={{
                    color: '#A0522D'
                  }}>
                    Upload Text From Google Drive
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={googleDriveShareCode}
                      onChange={(e) => setGoogleDriveShareCode(e.target.value)}
                      placeholder="Paste Google Drive Share Code here" 
                      className="w-full p-3 text-base border rounded-md font-sans" 
                      style={{
                        borderColor: '#A0522D',
                        borderWidth: '2px',
                        fontSize: '16px'
                      }} 
                    />
                    <button 
                      onClick={handleGoogleDriveUpload}
                      disabled={isImportingFromDrive}
                      className="w-full py-2 px-4 rounded-md font-bold text-base transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      style={{
                        backgroundColor: '#A0522D',
                        color: 'white',
                        border: '2px solid #8B4513',
                        fontSize: '16px'
                      }}
                    >
                      {isImportingFromDrive ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Story Formatting Section - Full Width */}
      {(isUpdatingText || isAddingText) && (
        <div className="w-full mt-8">
          <Card className="bg-white border-4" style={{ borderColor: '#22c55e' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-amber-800 flex items-center gap-3">
                <FileText className="h-6 w-6" />
                {isUpdatingText ? `Editing: ${foundStoryTitle}` : `Creating New Story: ${storyCode}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SplitViewEditor
                content={storyContent}
                onChange={setStoryContent}
                placeholder={isUpdatingText 
                  ? "Edit your story content here..." 
                  : "Start writing your new story..."
                }
                category={category as "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText" | "STORY"}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                previewContent={previewContent}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-center" style={{ color: '#dc2626' }}>
              Confirm Save & Clear
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-center font-bold" style={{ color: '#000000' }}>
              Are you <span style={{ color: '#dc2626' }}>SURE</span> you want to <span style={{ color: '#dc2626' }}>SAVE</span> this file and <span style={{ color: '#dc2626' }}>CLEAR</span> this page for new text?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center gap-4 mt-6">
            <AlertDialogCancel 
              onClick={handleConfirmNo}
              className="supertext-no-btn rounded-full px-8 py-3 text-lg font-bold border-2"
            >
              NO
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmYes}
              className="supertext-yes-btn rounded-full px-8 py-3 text-lg font-bold border-2"
            >
              YES
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SecureAdminRoute>
  );
};

export default SuperText;