import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { YesNoButtons } from "@/components/ui/YesNoButtons";
import { WordLimitedTextarea } from "@/components/ui/word-limited-textarea";
import { CharacterLimitedTextarea } from "@/components/ui/character-limited-textarea";
import { AuthorCombobox } from "@/components/AuthorCombobox";
import { useStoryFormState } from '@/hooks/useStoryFormState';
import { useStoryFormActions } from '@/hooks/useStoryFormActions';
import { useVoiceTesting } from '@/hooks/useVoiceTesting';
import { getVoiceCharacter } from '@/utils/characterVoices';
import SecureAdminRoute from '@/components/admin/SecureAdminRoute';
import StoryVideoUpload from '@/components/StoryVideoUpload';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { StoryCodeDialog } from '@/components/StoryCodeDialog';
import SplitViewEditor from '@/components/editor/SplitViewEditor';
import ConditionalEditorStyles from '@/components/rich-text-editor/ConditionalEditorStyles';
import SuperTextStoryStatus from '@/components/SuperTextStoryStatus';
import LastUpdatesGrid from '@/components/LastUpdatesGrid';
import { useAdminSession } from '@/hooks/useAdminSession';
import StoryPhotoUpload from '@/components/StoryPhotoUpload';
import { AudioButton } from '@/components/AudioButton';
import { SuperAV } from '@/components/SuperAV';
import { supabase } from '@/integrations/supabase/client';
import './SuperText.css';
interface Story {
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
  video_duration_seconds?: number;
  created_at?: string;
  updated_at?: string;
  audio_generated_at?: string;
  publication_status_code?: number;
  color_preset_id?: string;
  site?: "KIDS" | "FAITH" | "SHOP" | "ADMIN";
}
const SuperText: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [saveAction, setSaveAction] = React.useState<'save-and-clear' | 'save-only' | 'cancel-all'>('save-and-clear');
  const [storyCode, setStoryCode] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [copyrightStatus, setCopyrightStatus] = React.useState('');
  const [publicationStatusCode, setPublicationStatusCode] = React.useState(5);
  const [lookupResult, setLookupResult] = React.useState<Story | null>(null);
  const [lookupStatus, setLookupStatus] = React.useState<'idle' | 'found' | 'not-found'>('idle');
  const [showLookupDialog, setShowLookupDialog] = React.useState(false);
  const [showSuperAV, setShowSuperAV] = React.useState(false);
  const [colorPresetId, setColorPresetId] = React.useState<string>('');
  const [siteCode, setSiteCode] = React.useState<string>('');
  

  // Refs for section scrolling
  const audioSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const textEditorSectionRef = useRef<HTMLDivElement>(null);

  // Refs for tab cycling
  const storyCodeRef = useRef<HTMLInputElement>(null);
  const loadTextBtnRef = useRef<HTMLButtonElement>(null);
  const {
    formData,
    isLoadingStory,
    isGeneratingAudio,
    isUploadingAudio,
    refetchStory,
    populateFormWithStory,
    handleInputChange,
    handlePhotoUpload,
    handlePhotoRemove,
    handleVideoUpload,
    handleVideoRemove,
    handleVoiceChange,
    handleGenerateAudio,
    handleAudioUpload,
    handleVideoFileUpload,
    error
  } = useStoryFormState(undefined, false);
  const navigate = useNavigate();
  const {
    lookupStoryByCode
  } = useStoryCodeLookup();
  const storyId = searchParams.get('id');
  const clear = searchParams.get('clear') === 'true';
  const {
    handleStoryFormSave
  } = useAdminSession();
  const {
    handleSubmit,
    handleSaveOnly,
    isSaving
  } = useStoryFormActions(storyId, refetchStory, handleStoryFormSave, updates => {
    // Update formData using handleInputChange for each field
    Object.entries(updates).forEach(([key, value]) => {
      handleInputChange(key as keyof Story, value as string);
    });
  });
  const {
    currentlyPlaying,
    loadingVoice,
    playVoice,
    stopAudio
  } = useVoiceTesting();
  useEffect(() => {
    // Initialize form with URL parameters on initial load
    const initialStoryCode = searchParams.get('story_code') || '';
    const initialCategory = searchParams.get('category') || ''; // Don't default to 'Fun'
    const initialCopyrightStatus = searchParams.get('copyright_status') || ''; // Don't default to '©'
    const initialPublicationStatusCode = Number(searchParams.get('publication_status_code')) || 5;
    setStoryCode(initialStoryCode);
    setCategory(initialCategory);
    setCopyrightStatus(initialCopyrightStatus);
    setPublicationStatusCode(initialPublicationStatusCode);

    // Set initial form values
    handleInputChange('story_code', initialStoryCode);
    handleInputChange('category', initialCategory);
    handleInputChange('copyright_status', initialCopyrightStatus);
    handleInputChange('publication_status_code', initialPublicationStatusCode.toString());

    // Auto-lookup story if story_code is provided in URL
    if (initialStoryCode.trim()) {
      console.log('🎯 SuperText: Auto-loading story from URL parameter:', initialStoryCode);
      // Create a temporary lookup function to avoid dependency issues
      const autoLookup = async () => {
        const {
          found,
          story,
          error
        } = await lookupStoryByCode(initialStoryCode);
        if (error) {
          toast.error("Error looking up story by code.");
          return;
        }
        if (!found) {
          toast.message("No story found with that code.");
          return;
        }
        if (story) {
          await populateFormWithStory(story, true);
          setLookupResult(story);
          setCategory(story.category);
          setCopyrightStatus(story.copyright_status || '©');
          setPublicationStatusCode(story.publication_status_code || 5);
          setColorPresetId(story.color_preset_id || '');
          setSiteCode(story.site || '');
          toast.success("Story data loaded successfully!");
        }
      };

      // Trigger lookup after a brief delay to ensure all state is set
      setTimeout(autoLookup, 100);
    }
  }, [searchParams, lookupStoryByCode, populateFormWithStory]);
  
  // Sync siteCode state with formData.site
  useEffect(() => {
    if (formData.site) {
      setSiteCode(formData.site);
    }
  }, [formData.site]);
  
  const clearForm = useCallback(() => {
    // Reset form fields to initial values
    handleInputChange('id', ''); // CRITICAL: Clear the ID to prevent updating existing stories
    handleInputChange('title', ''); // Clear title
    handleInputChange('author', ''); // Clear author
    handleInputChange('content', '');
    handleInputChange('tagline', '');
    handleInputChange('excerpt', '');
    handleInputChange('story_code', '');
    handleInputChange('photo_link_1', '');
    handleInputChange('photo_link_2', '');
    handleInputChange('photo_link_3', '');
    handleInputChange('photo_alt_1', '');
    handleInputChange('photo_alt_2', '');
    handleInputChange('photo_alt_3', '');
    handleInputChange('video_url', '');
    handleInputChange('ai_voice_name', 'Nova');
    handleInputChange('ai_voice_model', 'tts-1');
    handleInputChange('copyright_status', '');
    handleInputChange('publication_status_code', '5');
    
    // Clear timestamp and duration fields for LastUpdatesGrid
    handleInputChange('audio_url', '');
    handleInputChange('audio_duration_seconds', undefined);
    handleInputChange('video_duration_seconds', undefined);
    // Don't set timestamp fields - let database defaults handle them

    // Reset local state
    setStoryCode('');
    setCategory('');
    setCopyrightStatus('');
    setPublicationStatusCode(5);
    setColorPresetId('');
    setSiteCode('');

    // Clear category in form data
    handleInputChange('category', '');
    setLookupResult(null);
    setLookupStatus('idle');

    // Clear URL query parameters
    navigate('/buddys_admin/super-text', {
      replace: true
    });
    toast.success("Form cleared successfully!");
  }, [handleInputChange, navigate]);
  useEffect(() => {
    // Clear form after submit if 'clear' param is true
    if (clear) {
      clearForm();
    }
  }, [clear, clearForm]);

  // Sync local publicationStatusCode with formData when it changes
  useEffect(() => {
    if (formData.publication_status_code !== undefined) {
      setPublicationStatusCode(Number(formData.publication_status_code));
    }
  }, [formData.publication_status_code]);
  // Auto-lookup when story code reaches 7 characters
  const handleStoryCodeChange = useCallback(async (newCode: string) => {
    console.log('🔧 Story code changed:', newCode, 'Length:', newCode.length, '4th char:', newCode.charAt(3));
    setStoryCode(newCode);
    handleInputChange('story_code', newCode);
    
    // Auto-lookup when story code reaches 7 characters
    if (newCode.length === 7) {
      // Check if 4th position (index 3) is a dash
      if (newCode.charAt(3) !== '-') {
        console.log('🚫 Invalid format - 4th position is not a dash:', newCode.charAt(3));
        setLookupStatus('idle');
        setLookupResult(null);
        setShowLookupDialog(false);
        toast.error("Invalid story code format. 4th position must be a dash (e.g., ABC-123)");
        return;
      }
      
      console.log('✅ Valid format, proceeding with lookup');
      const {
        found,
        story,
        error
      } = await lookupStoryByCode(newCode);
      if (error) {
        setLookupStatus('idle');
        setLookupResult(null);
        setShowLookupDialog(false);
        toast.error("Error looking up story code");
        return;
      }
      if (found && story) {
        // Story found - set state and open dialog
        setLookupResult(story);
        setLookupStatus('found');
        setShowLookupDialog(true);
        console.log('📢 Opening dialog for found story:', story.title);
      } else {
        // Story not found - set state and open dialog
        setLookupResult(null);
        setLookupStatus('not-found');
        setShowLookupDialog(true);
        console.log('📢 Opening dialog for new story code');
      }
    } else {
      // Code is not 7 characters - reset state
      setLookupStatus('idle');
      setLookupResult(null);
      setShowLookupDialog(false);
    }
  }, [lookupStoryByCode, handleInputChange]);
  const handleStoryCodeLookup = useCallback(async () => {
    if (!storyCode.trim()) {
      toast.error("Please enter a story code to lookup.");
      return;
    }
    const {
      found,
      story,
      error
    } = await lookupStoryByCode(storyCode);
    if (error) {
      toast.error("Error looking up story by code.");
      return;
    }
    if (!found) {
      toast.message("No story found with that code.");
      return;
    }
    if (story) {
      await populateFormWithStory(story, true);
      setLookupResult(story); // Store the looked-up story

      // Sync local state with story data
      setCategory(story.category);
      setCopyrightStatus(story.copyright_status || '©');
      setPublicationStatusCode(story.publication_status_code || 5);
      setColorPresetId(story.color_preset_id || '');
      toast.success("Story data loaded successfully!");
    }
  }, [storyCode, lookupStoryByCode, populateFormWithStory]);

  // Confirmation handlers for the modal dialog
  const handleConfirmYes = useCallback(async () => {
    console.log('✅ User clicked YES');
    
    if (lookupStatus === 'found' && lookupResult) {
      // Load the found story into the form
      await populateFormWithStory(lookupResult, true);
      setCategory(lookupResult.category);
      setCopyrightStatus(lookupResult.copyright_status || '©');
      setPublicationStatusCode(lookupResult.publication_status_code || 5);
      setColorPresetId(lookupResult.color_preset_id || '');
      toast.success("Story data loaded successfully!");
    } else if (lookupStatus === 'not-found') {
      // Ready for new story - just reset status
      setLookupStatus('idle');
      console.log('📝 Ready to create new story');
    }
    
    // Close the dialog
    setShowLookupDialog(false);
  }, [lookupStatus, lookupResult, populateFormWithStory]);
  const handleConfirmNo = useCallback(() => {
    console.log('❌ User clicked NO - clearing form');
    
    // Clear the form completely
    clearForm();
    setLookupStatus('idle');
    setLookupResult(null);
    
    // Close the dialog
    setShowLookupDialog(false);
  }, [clearForm]);
  const handleSave = async (action: 'save-and-clear' | 'save-only' | 'cancel-all') => {
    // Check if text code is empty for save actions
    if ((action === 'save-and-clear' || action === 'save-only') && !formData.story_code?.trim()) {
      toast.error("Please enter a text code before saving.");
      return;
    }
    setSaveAction(action);
    setShowConfirmDialog(true);
  };
  const confirmSave = async (confirmed: boolean) => {
    setShowConfirmDialog(false);
    if (confirmed) {
      if (saveAction === 'cancel-all') {
        clearForm();
        return;
      }

      // Import validation functions
      const { validateBasicSave, validatePublishedSave } = await import('@/components/story-form/StoryFormValidation');
      
      const statusCode = Number(formData.publication_status_code);
      
      // Use appropriate validation based on publication status
      let isValid = false;
      if (statusCode === 0 || statusCode === 1) {
        isValid = validatePublishedSave(formData, colorPresetId);
      } else {
        isValid = validateBasicSave(formData);
      }
      
      if (!isValid) {
        return;
      }

      // SAFEGUARD: If story_code changed but id is still present, treat as new story
      let formDataToSave = {
        ...formData,
        color_preset_id: colorPresetId
      };
      if (formData.id && lookupResult && lookupResult.story_code !== formData.story_code) {
        console.log('🛡️ SAFEGUARD: Story code changed from', lookupResult.story_code, 'to', formData.story_code, '- treating as new story');
        formDataToSave = {
          ...formDataToSave,
          id: ''
        };
        toast.success(`Creating new story with code ${formData.story_code}`);
      }
      if (saveAction === 'save-and-clear') {
        // Create custom onSave callback that clears form after successful save
        const customOnSave = async () => {
          try {
            // Call the original handleStoryFormSave if needed (for admin navigation)
            if (handleStoryFormSave) {
              await handleStoryFormSave();
            }
            
            // Add a small delay to ensure save operation is fully complete
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Clear the form after successful save
            console.log('✅ Save completed successfully, clearing form...');
            clearForm();
          } catch (error) {
            console.error('❌ Error in save operation, not clearing form:', error);
            toast.error('Save operation failed, form not cleared');
          }
        };
        
        // Pass the custom callback to handleSubmit and wait for it to complete
        const result = await handleSubmit(formDataToSave, customOnSave);
        console.log('🔄 handleSubmit completed with result:', result);
      } else if (saveAction === 'save-only') {
        await handleSaveOnly(formDataToSave);
      }
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      handleSave('save-only');
    }
  };
  const handleVideoDurationCalculated = (duration: number) => {
    handleInputChange('video_duration_seconds', duration.toString());
  };

  // Section scrolling handlers
  const scrollToAudioSection = useCallback(() => {
    if (!formData.content?.trim()) {
      toast.message("Add your story content to generate audio");
    }
    if (audioSectionRef.current) {
      audioSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Add highlight effect
      audioSectionRef.current.style.outline = '3px solid #3b82f6';
      audioSectionRef.current.style.outlineOffset = '4px';
      setTimeout(() => {
        if (audioSectionRef.current) {
          audioSectionRef.current.style.outline = '';
          audioSectionRef.current.style.outlineOffset = '';
        }
      }, 1500);
    }
  }, [formData.content]);
  const scrollToVideoSection = useCallback(() => {
    if (videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Add highlight effect
      videoSectionRef.current.style.outline = '3px solid #8b5cf6';
      videoSectionRef.current.style.outlineOffset = '4px';
      setTimeout(() => {
        if (videoSectionRef.current) {
          videoSectionRef.current.style.outline = '';
          videoSectionRef.current.style.outlineOffset = '';
        }
      }, 1500);
    }
  }, []);
  const scrollToTextEditorSection = useCallback(() => {
    if (textEditorSectionRef.current) {
      textEditorSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Add highlight effect
      textEditorSectionRef.current.style.outline = '3px solid #22c55e';
      textEditorSectionRef.current.style.outlineOffset = '4px';
      setTimeout(() => {
        if (textEditorSectionRef.current) {
          textEditorSectionRef.current.style.outline = '';
          textEditorSectionRef.current.style.outlineOffset = '';
        }
      }, 1500);
    }
  }, []);
  return <SecureAdminRoute>
      <Helmet>
        <title>Text Edit</title>
      </Helmet>
      <ConditionalEditorStyles category={formData.category} />
      
      {/* Header with title and action buttons */}
      <div className="bg-white/80 backdrop-blur-sm py-4 px-6 border-b border-orange-200/50 sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-orange-800 mb-4">Super Text Manager</h1>
         <div className="flex gap-4 flex-wrap items-start w-full">
           <div className="flex gap-4 flex-wrap flex-1">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button onClick={() => handleSave('save-only')} disabled={isSaving || !formData.story_code?.trim()} className="supertext-orange-btn px-8 py-3 rounded-full">
                   {isSaving ? 'Saving...' : 'Save & Don\'t Clear'}
                 </Button>
               </TooltipTrigger>
               <TooltipContent side="bottom" align="center" className="bg-white border border-gray-300 shadow-lg" style={{
              fontFamily: 'Arial',
              fontSize: '21px',
              color: 'black',
              backgroundColor: 'white'
            }}>
                 Save story and keep form open for editing
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
           
           <TooltipProvider>
             <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handleSave('save-and-clear')} disabled={isSaving || !formData.story_code?.trim()} className="supertext-orange-btn px-4 py-3 rounded-full">
                    {isSaving ? 'Saving...' : 'Save & Clear'}
                  </Button>
                </TooltipTrigger>
               <TooltipContent side="bottom" align="center" className="bg-white border border-gray-300 shadow-lg" style={{
              fontFamily: 'Arial',
              fontSize: '21px',
              color: 'black',
              backgroundColor: 'white'
            }}>
                 Save story and clear form for new entry
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
           
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handleSave('cancel-all')} className="supertext-red-btn px-4 py-3 rounded-full">
                    Cancel ALL & Clear
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" className="bg-white border border-gray-300 shadow-lg" style={{
              fontFamily: 'Arial',
              fontSize: '21px',
              color: 'black',
              backgroundColor: 'white'
            }}>
                  Discard all changes and clear form
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="supertext-green-btn px-4 py-3 rounded-full">
                    Go To Top
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" className="bg-white border border-gray-300 shadow-lg" style={{
              fontFamily: 'Arial',
              fontSize: '21px',
              color: 'black',
              backgroundColor: 'white'
            }}>
                  Scroll to the top of the page
                </TooltipContent>
              </Tooltip>
             </TooltipProvider>
             
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => {
                    textEditorSectionRef.current?.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    });
                  }} className="supertext-brown-btn px-4 py-3 rounded-full">
                    Format
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" className="bg-white border border-gray-300 shadow-lg" style={{
              fontFamily: 'Arial',
              fontSize: '21px',
              color: 'black',
              backgroundColor: 'white'
            }}>
                  Jump to the text editor format menu
                </TooltipContent>
              </Tooltip>
             </TooltipProvider>
           </div>
          </div>
        </div>

        <div className="pb-6">
          {/* Second row: Publication Status dropdown and Last Updates Grid */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-4">
            {/* Publication Status Dropdown */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-4 py-2 rounded-lg border-4 border-orange-500 shadow-lg flex items-center gap-3" style={{
                backgroundColor: '#228B22',
                boxShadow: '4px 4px 0px #d97706, 8px 8px 0px #92400e'
              }}>
                <span className="font-bold whitespace-nowrap" style={{ 
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '24px',
                  color: '#FFD700',
                  textShadow: '2px 2px 0px #B8860B, 4px 4px 0px #8B6914, 6px 6px 0px #654321'
                }}>
                  Set Publication Status BEFORE Saving:
                </span>
                <Select
                  value={publicationStatusCode.toString()}
                  onValueChange={(value) => {
                    const status = Number(value);
                    setPublicationStatusCode(status);
                    handleInputChange('publication_status_code', status.toString());
                  }}
                >
                  <SelectTrigger 
                    className="w-[280px] h-10 text-base font-bold border-2" 
                    style={{ 
                      fontFamily: 'Arial, sans-serif',
                      backgroundColor: publicationStatusCode === 0 ? '#228B22' : 
                                     publicationStatusCode === 1 ? '#10b981' :
                                     publicationStatusCode === 2 ? '#FFD700' :
                                     publicationStatusCode === 3 ? '#3b82f6' :
                                     publicationStatusCode === 4 ? '#9c441a' : '#DC143C',
                      color: publicationStatusCode === 0 ? 'white' : 
                            publicationStatusCode === 1 ? 'white' :
                            publicationStatusCode === 2 ? '#228B22' :
                            publicationStatusCode === 3 ? 'white' :
                            publicationStatusCode === 4 ? 'white' : '#FFD700'
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                  <SelectItem value="0" className="text-base font-bold" style={{ backgroundColor: '#228B22', color: 'white' }}>
                    0 - Save & Pub, App & Rev
                  </SelectItem>
                  <SelectItem value="1" className="text-base font-bold" style={{ backgroundColor: '#10b981', color: 'white' }}>
                    1 - Save & Pub, App Only
                  </SelectItem>
                  <SelectItem value="2" className="text-base font-bold" style={{ backgroundColor: '#FFD700', color: '#228B22' }}>
                    2 - Save, NO PUB, No CoP
                  </SelectItem>
                  <SelectItem value="3" className="text-base font-bold" style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                    3 - Save, NO Gpa APR
                  </SelectItem>
                  <SelectItem value="4" className="text-base font-bold" style={{ backgroundColor: '#9c441a', color: 'white' }}>
                    4 - Save, Formatting
                  </SelectItem>
                  <SelectItem value="5" className="text-base font-bold" style={{ backgroundColor: '#DC143C', color: '#FFD700' }}>
                    5 - NOT SAVED
                  </SelectItem>
                </SelectContent>
              </Select>
              </div>
            </div>

            {/* Last Updates Grid - always visible */}
            <div className="w-full xl:w-auto">
              <LastUpdatesGrid story={formData} hideTitle={true} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Text Details Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-green-400 p-6 relative z-20">
                
                {/* Red Dot 1 - Required field */}
                 <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center font-bold z-30" style={{ backgroundColor: '#DC143C', color: '#FFD700' }}>1</div>
                
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold supertext-fs-24px-arial-green">Text Details</h2>
                  
                  {/* Instruction Box - inline with title */}
                  <div className="border-2 border-orange-500 rounded px-4 py-1 shadow-md flex items-center gap-3 shrink-0" style={{
                    fontSize: '18px',
                    fontFamily: 'Comic Sans MS, cursive, Arial',
                    fontWeight: 'bold',
                    backgroundColor: 'transparent',
                    height: '32px'
                  }}>
                    <span style={{ color: '#DC143C' }}>Red dots = REQUIRED</span>
                    <span style={{ color: '#999' }}>•</span>
                    <span style={{ color: '#F97316' }}>Orange dots = OPTIONAL</span>
                  </div>
                </div>
                
                
                {/* Grid Layout - full width */}
                <div className="relative">
                  {/* 7x2 Grid Layout - Extended width for C, D, F fields */}
                  <div className="grid grid-cols-[32px_1fr] auto-rows-min gap-0">
                  
                    {/* Row 1: A, Text Code + Site Code */}
                    <div className="flex items-center justify-center h-8">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center supertext-fs-21px font-bold" style={{
                        backgroundColor: '#DC143C',
                        color: '#FFD700'
                      }}>A</div>
                    </div>
                    
                    <div className="h-8 flex items-center gap-4">
                      <Input 
                        ref={storyCodeRef} 
                        type="text" 
                        placeholder="TEXT CODE" 
                        value={storyCode} 
                        onChange={e => {
                          const upperValue = e.target.value.toUpperCase();
                          handleStoryCodeChange(upperValue);
                        }} 
                        onPaste={e => {
                          const pastedText = e.clipboardData.getData('text');
                          const upperValue = pastedText.toUpperCase();
                          e.preventDefault();
                          handleStoryCodeChange(upperValue);
                        }} 
                        onBlur={e => {
                          const upperValue = e.target.value.toUpperCase();
                          if (upperValue !== e.target.value) {
                            handleStoryCodeChange(upperValue);
                          }
                        }} 
                        className="border-4 border-orange-400 focus:border-orange-500 supertext-fs-21px-arial-black py-0 h-8 leading-[21px]" 
                        style={{
                          width: '192px',
                          fontStyle: 'normal'
                        }} 
                        autoCapitalize="characters" 
                        spellCheck={false} 
                        tabIndex={1} 
                      />
                      
                      <Select 
                        value={siteCode} 
                        onValueChange={(value) => {
                          setSiteCode(value);
                          handleInputChange('site', value);
                        }}
                      >
                        <SelectTrigger 
                          className="w-[140px] h-8 border-4 border-orange-400 focus:border-orange-500"
                          style={{
                            fontSize: '21px',
                            fontFamily: 'Arial',
                            fontWeight: 'bold',
                            backgroundColor: !siteCode ? '#F97316' : 
                                          siteCode === 'SHOP' ? '#228B22' :
                                          siteCode === 'KIDS' ? '#FF8C42' :
                                          siteCode === 'FAITH' ? '#8b5cf6' :
                                          siteCode === 'ADMIN' ? '#60a5fa' : '#F97316',
                            color: 'white'
                          }}
                          tabIndex={1.5}
                        >
                          <SelectValue placeholder="Website?" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="SHOP" style={{ 
                            fontSize: '21px', 
                            fontFamily: 'Arial', 
                            fontWeight: 'bold',
                            backgroundColor: '#228B22',
                            color: 'white'
                          }}>
                            SHOP
                          </SelectItem>
                          <SelectItem value="KIDS" style={{ 
                            fontSize: '21px', 
                            fontFamily: 'Arial', 
                            fontWeight: 'bold',
                            backgroundColor: '#FF8C42',
                            color: 'white'
                          }}>
                            KIDS
                          </SelectItem>
                          <SelectItem value="FAITH" style={{ 
                            fontSize: '21px', 
                            fontFamily: 'Arial', 
                            fontWeight: 'bold',
                            backgroundColor: '#8b5cf6',
                            color: 'white'
                          }}>
                            FAITH
                          </SelectItem>
                          <SelectItem value="ADMIN" style={{ 
                            fontSize: '21px', 
                            fontFamily: 'Arial', 
                            fontWeight: 'bold',
                            backgroundColor: '#60a5fa',
                            color: 'white'
                          }}>
                            ADMIN
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={formData.category || ''} onValueChange={value => {
                        setCategory(value);
                        handleInputChange('category', value);
                      }}>
                        <SelectTrigger className="w-[192px] border-orange-400 focus:border-orange-500 [&>svg]:text-white [&>svg]:opacity-100 h-8" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold',
                          backgroundColor: '#F97316',
                          color: 'white',
                          borderColor: '#ea580c'
                      }} tabIndex={2}>
                        <SelectValue placeholder="Category" className="text-white" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }} />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="WebText" style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                          <div className="px-3 py-1 rounded w-full text-center text-white" style={{ backgroundColor: '#A0522D' }}>WebText</div>
                        </SelectItem>
                        <SelectItem value="Fun" style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                          <div className="bg-gradient-to-b from-blue-400 to-blue-600 text-white border-blue-500 px-3 py-1 rounded w-full text-center">Fun</div>
                        </SelectItem>
                        <SelectItem value="Life" style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                          <div className="bg-gradient-to-b from-green-400 to-green-600 text-white border-green-500 px-3 py-1 rounded w-full text-center">Life</div>
                        </SelectItem>
                        <SelectItem value="North Pole" style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                          <div className="bg-gradient-to-b from-red-400 to-red-600 text-white border-red-500 px-3 py-1 rounded w-full text-center">North Pole</div>
                        </SelectItem>
                        <SelectItem value="World Changers" style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                          <div className="bg-gradient-to-b from-purple-400 to-purple-600 text-white border-purple-500 px-3 py-1 rounded w-full text-center">World Changers</div>
                        </SelectItem>
                        <SelectItem value="BioText" style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                          <div className="bg-gradient-to-b from-gray-400 to-gray-600 text-white border-gray-500 px-3 py-1 rounded w-full text-center">BioText</div>
                        </SelectItem>
                        </SelectContent>
                      </Select>
  
                      <Select value={formData.copyright_status || ''} onValueChange={value => {
                        setCopyrightStatus(value);
                        handleInputChange('copyright_status', value);
                      }}>
                        <SelectTrigger className="w-[192px] text-white text-left border-2 [&>svg]:text-white [&>svg]:opacity-100 h-8" style={{
                        fontSize: '21px',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        backgroundColor: '#2563eb',
                        borderColor: '#1d4ed8'
                      }} tabIndex={3}>
                        <SelectValue placeholder="Copyright Status" className="text-white" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }} />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="©" style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                          <div className="px-3 py-1 rounded w-full text-center text-white bg-red-600">© - Full Copyright</div>
                        </SelectItem>
                        <SelectItem value="L" style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                          <div className="px-3 py-1 rounded w-full text-center text-white" style={{ backgroundColor: '#F97316' }}>L — Limited Use</div>
                        </SelectItem>
                        <SelectItem value="O" style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                          <div className="px-3 py-1 rounded w-full text-center text-white" style={{ backgroundColor: '#228B22' }}>O — Open Unlimited</div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
  
                  {/* Row 2: B, Title (spanning col 2-3) */}
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center supertext-fs-21px font-bold" style={{
                      backgroundColor: '#DC143C',
                      color: '#FFD700'
                    }}>B</div>
                  </div>

                    <div className="max-w-[700px]">
                      <CharacterLimitedTextarea
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Story Title"
                        characterLimit={120}
                        className="resize-none border-2 border-purple-400 focus:border-purple-500 w-full"
                        style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}
                        rows={1}
                        compact
                      />
                    </div>

                  {/* Row 5: D, Tagline (spanning col 2-3) */}
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center supertext-fs-21px font-bold" style={{
                      backgroundColor: '#FFA500',
                      color: '#228B22'
                    }}>D</div>
                  </div>

                    <div className="max-w-[700px]">
                      <CharacterLimitedTextarea
                        value={formData.tagline || ''}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        placeholder="Story Tagline"
                        characterLimit={120}
                        className="resize-none border-2 border-green-400 focus:border-green-500 w-full"
                        style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}
                        rows={1}
                        compact
                      />
                    </div>

                  {/* Row 6: E, Author (spanning col 2-3) */}
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center supertext-fs-21px font-bold" style={{
                      backgroundColor: '#FFA500',
                      color: '#228B22'
                    }}>E</div>
                  </div>

                    <div className="flex items-center h-10 gap-2 max-w-[700px]">
                      <span className="text-[21px] font-bold" style={{fontFamily: 'Arial, sans-serif'}}>
                        Author:
                      </span>
                      <AuthorCombobox 
                        value={formData.author || ''}
                        onValueChange={(value) => handleInputChange('author', value)}
                        placeholder=""
                        className="flex-1 border-2 border-yellow-400 hover:border-yellow-500 h-10"
                        style={{
                          fontSize: '21px',
                          fontFamily: 'Arial, sans-serif'
                        }}
                        showAddButton={true}
                      />
                    </div>

                  {/* Row 7: F, Excerpt (spanning col 2-3) */}
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center supertext-fs-21px font-bold" style={{
                      backgroundColor: '#FFA500',
                      color: '#228B22'
                    }}>F</div>
                  </div>

                    <div className="max-w-[700px]">
                      <CharacterLimitedTextarea
                        value={formData.excerpt || ''}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        placeholder="Story Excerpt"
                        characterLimit={250}
                        className="resize-none border-2 border-blue-400 focus:border-blue-500 w-full"
                        style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}
                        rows={2}
                        compact
                      />
                    </div>
                </div>
                
              </div>
            </div>

              {/* Story Photos Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-orange-400 p-6 relative">
                {/* Orange Dot 2 - Optional field */}
                 <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center font-bold z-30" style={{ backgroundColor: '#FFA500', color: '#228B22' }}>2</div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold text-orange-700" style={{
                fontSize: '21px',
                fontFamily: 'Arial',
                fontWeight: 'bold'
              }}>🖼️ Story Photos</h2>
                </div>
                
                <StoryPhotoUpload photoUrls={{
              photo_link_1: formData.photo_link_1,
              photo_link_2: formData.photo_link_2,
              photo_link_3: formData.photo_link_3,
              photo_link_4: formData.photo_link_4 || ''
            }} photoAlts={{
              photo_alt_1: formData.photo_alt_1,
              photo_alt_2: formData.photo_alt_2,
              photo_alt_3: formData.photo_alt_3,
              photo_alt_4: formData.photo_alt_4 || ''
            }} storyCode={formData.story_code} onPhotoUpload={(photoNumber, url) => {
              handleInputChange(`photo_link_${photoNumber}` as keyof Story, url);
            }} onPhotoRemove={handlePhotoRemove} onAltTextChange={(field, value) => {
              handleInputChange(field as keyof Story, value);
            }} />
              </div>

              {/* 3-Column Grid: Audio, Video, Text */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Column 1: Audio Upload */}
                <div ref={audioSectionRef} className="w-full bg-white/90 backdrop-blur-sm rounded-lg border-2 p-6 relative" style={{
              borderColor: '#8B4513'
            }}>
                  {/* Orange Dot 3A - Optional */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center supertext-fs-21px font-bold" style={{ backgroundColor: '#FFA500', color: '#228B22' }}>3A</div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-bold" style={{
                  color: '#8B4513'
                }}>🔊 Audio Upload</h2>
                  </div>
                  
                  <div className="space-y-4">
                     {/* File Upload */}
                    <div>
                      <Label className="font-semibold mb-2 block">Upload Audio File</Label>
                      <input type="file" accept="audio/*" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        await handleAudioUpload(file);
                        toast.success("Audio uploaded successfully!");
                        e.target.value = ''; // Clear input
                      } catch (error) {
                        console.error('Audio upload error:', error);
                        toast.error(error instanceof Error ? error.message : "Failed to upload audio");
                        e.target.value = ''; // Clear input even on error
                      }
                    }
                  }} disabled={isUploadingAudio || !formData.id} className="w-full rounded-md p-2 text-sm disabled:opacity-50" style={{
                    border: '2px solid #8B4513'
                  }} />
                      <p className="text-xs text-gray-500 mt-1">
                        {!formData.id ? "Save story first before uploading audio" : isUploadingAudio ? "Uploading..." : "Supported formats: MP3, WAV, M4A, AAC • Max size: 50MB"}
                      </p>
                    </div>
                    
                    {/* Google Drive Upload */}
                    <div>
                      <Label className="font-semibold mb-2 block">Or Upload from Google Drive</Label>
                      <div className="space-y-2">
                        <textarea placeholder="Google Drive Access Not Yet Coded" rows={3} className="w-full rounded-md px-3 py-2 text-sm resize-none" style={{
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      border: '2px solid #8B4513'
                    }} />
                        <Button variant="yes" className="w-full rounded-full text-sm font-medium text-white">
                          Upload
                        </Button>
                      </div>
                      
                    </div>

                    {/* Current Audio Display */}
                    {formData.audio_url && <div className="space-y-2">
                        <div className="text-sm font-semibold text-blue-700">Audio File Available - Use red SuperAV button to play</div>
                        <Button onClick={() => handleInputChange('audio_url', '')} variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400">
                          Remove Audio
                        </Button>
                      </div>}
                  </div>
                </div>

                {/* Column 2: Video Upload */}
                <div ref={videoSectionRef} className="w-full bg-white/90 backdrop-blur-sm rounded-lg border-2 border-purple-400 p-6 relative">
                  {/* Orange Dot 3B - Optional */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center supertext-fs-21px font-bold" style={{ backgroundColor: '#FFA500', color: '#228B22' }}>3B</div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-bold text-purple-700">📹 Video Upload</h2>
                  </div>
                  
                  <div className="space-y-4">
                     {/* File Upload */}
                    <div>
                      <Label className="font-semibold mb-2 block">Upload MP4 File</Label>
                      <input type="file" accept=".mp4,video/mp4" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        await handleVideoFileUpload(file);
                        toast.success("Video uploaded successfully!");
                        e.target.value = ''; // Clear input
                      } catch (error) {
                        console.error('Video upload error:', error);
                        toast.error(error instanceof Error ? error.message : "Failed to upload video");
                        e.target.value = ''; // Clear input even on error
                      }
                    }
                  }} disabled={isUploadingAudio || !formData.id} className="w-full border border-purple-400 rounded-md p-2 text-sm disabled:opacity-50" />
                      <p className="text-xs text-gray-500 mt-1">
                        {!formData.id ? "Save story first before uploading video" : isUploadingAudio ? "Uploading..." : "Only MP4 format • Max size: 100MB"}
                      </p>
                    </div>
                    
                    {/* Google Drive Upload */}
                    <div>
                      <Label className="font-semibold mb-2 block">Or Upload from Google Drive</Label>
                      <div className="space-y-2">
                        <textarea placeholder="Google Drive Access Not Yet Coded" rows={3} className="w-full border-2 border-purple-400 focus:border-purple-500 rounded-md px-3 py-2 text-sm resize-none" style={{
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word'
                    }} />
                        <Button variant="yes" className="w-full rounded-full text-sm font-medium text-white">
                          Upload
                        </Button>
                      </div>
                    </div>

                    {/* Current Video Display */}
                    {formData.video_url && <div className="space-y-2">
                        <div className="text-sm font-semibold text-purple-700">Video File Available</div>
                        <video controls className="w-full max-h-64 rounded-lg border border-purple-200">
                          <source src={formData.video_url} type="video/mp4" />
                          Your browser does not support the video element.
                        </video>
                        <Button onClick={() => handleInputChange('video_url', '')} variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400">
                          Remove Video
                        </Button>
                      </div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Status and Actions */}
            <div className="space-y-3">
              

              {/* Combined AI Voice File & Voice Previews Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-green-400 p-6 relative">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold text-green-700">Create AI Voice File</h2>
                </div>
                {formData.audio_url && <AudioButton code="AUDIO-PLAY" onClick={() => setShowSuperAV(true)} className="absolute top-2 right-2 z-0" />}
                
                <div className="space-y-4">
                  {/* Current Voice Display */}
                  <div className="supertext-fs-21px-arial-black">
                    <span className="font-semibold">Current Voice: </span>
                    <span className="text-blue-600 font-bold">{formData.ai_voice_name || 'No voice selected'}</span>
                    {formData.ai_voice_name && <span className="text-gray-500 ml-2 font-bold">
                        ({getVoiceCharacter(formData.ai_voice_name.toLowerCase())})
                      </span>}
                  </div>

                  {/* Audio Generation Button */}
                  <Button onClick={() => handleGenerateAudio()} disabled={isGeneratingAudio || !formData.id || !formData.content || !formData.ai_voice_name} className={`w-full ${isGeneratingAudio || !formData.id || !formData.content || !formData.ai_voice_name ? 'bg-gray-400 text-gray-600' : 'bg-green-600 hover:bg-green-700 text-white'} supertext-fs-21px-arial-white`}>
                    🎵 {isGeneratingAudio ? 'Generating Audio...' : !formData.id ? 'Save Story First' : !formData.content ? 'Story Content Required' : !formData.ai_voice_name ? 'Voice Selection Required' : 'Generate Audio File'}
                  </Button>

                  {/* Existing Audio File Display */}
                  {formData.audio_url && <div className="space-y-2">
                      <div className="supertext-fs-21px-arial-black font-semibold text-green-700">Audio File Ready - Use red SuperAV button above to play</div>
                    </div>}

                  {/* Voice Settings Link */}
                  <div className="supertext-fs-21px-arial-blue font-bold text-center">
                    <span>Change voice in<br />Voice Previews below:</span>
                  </div>
                </div>

                {/* Voice Previews Section - Integrated */}
                <div className="-mx-6">
                  
                  <div className="grid grid-cols-2 gap-1 supertext-fs-21px-arial-black px-6">
                    {[{
                  name: 'Buddy / Alloy',
                  desc: 'Clear, neutral voice',
                  voice: 'alloy'
                }, {
                  name: 'Echo',
                  desc: 'Deep, resonant voice',
                  voice: 'echo'
                }, {
                  name: 'Fluffy / Fable',
                  desc: 'British accent, storytelling',
                  voice: 'fable'
                }, {
                  name: 'Nova',
                  desc: 'Warm, friendly voice',
                  voice: 'nova'
                }, {
                  name: 'Max / Onyx',
                  desc: 'Deep, authoritative voice',
                  voice: 'onyx'
                }, {
                  name: 'Shimmer',
                  desc: 'Soft, gentle voice',
                  voice: 'shimmer'
                }, {
                  name: 'Gpa John / Ash',
                  desc: 'Gentle and neutral, calming',
                  voice: 'ash'
                }, {
                  name: 'Coral',
                  desc: 'Bright and clear, youthful tone',
                  voice: 'coral'
                }, {
                  name: 'Sparky / Sage',
                  desc: 'Warm and thoughtful, reflective',
                  voice: 'sage'
                }].map((voice, index) => <div key={index} className="border-2 border-green-400 rounded p-1 text-center">
                        <div className="font-bold">{voice.name}</div>
                        <div className="supertext-fs-21px-arial-black text-gray-600 mb-2">{voice.desc}</div>
                        <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="flex-1 supertext-fs-21px-arial-black" onClick={() => {
                      if (currentlyPlaying === voice.voice) {
                        stopAudio();
                      } else {
                        playVoice(voice.voice, formData.content, formData.story_code);
                      }
                    }} disabled={loadingVoice === voice.voice}>
                              {loadingVoice === voice.voice ? "..." : currentlyPlaying === voice.voice ? "⏸ Stop" : "▶ Test"}
                            </Button>
                            <Button size="sm" className="flex-1 supertext-fs-21px-arial-white bg-green-600 hover:bg-green-700" onClick={() => {
                      const capitalizedVoice = voice.voice.charAt(0).toUpperCase() + voice.voice.slice(1);
                      handleInputChange('ai_voice_name', capitalizedVoice);
                      toast.success(`Selected ${voice.name} voice`);
                    }}>
                              Use
                            </Button>
                          </div>
                      </div>)}
                  </div>
                </div>
              </div>


              {error && <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4">
                  <h3 className="font-bold text-red-700">Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>}
             </div>
           </div>
          </div>

          {/* Full Width Split Editor Section */}
          <div ref={textEditorSectionRef} className="w-full bg-white/95 backdrop-blur-sm rounded-lg border-2 border-green-400 p-4 mt-6 relative">
            {/* Red Dot 3 - Required field */}
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center font-bold z-30" style={{ backgroundColor: '#DC143C', color: '#FFD700' }}>3</div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-green-700">{lookupResult ? `Editing Story${formData.story_code ? `: ${formData.story_code}` : ''}` : `Creating New Story${formData.story_code ? `: ${formData.story_code}` : ''}`}</h2>
            </div>
            
            <SplitViewEditor 
              content={formData.content} 
              onChange={value => handleInputChange('content', value)} 
              placeholder="Enter your story content here..." 
              category={formData.category as any} 
              previewContent={formData.content}
              colorPresetId={colorPresetId}
              onColorPresetChange={(presetId) => {
                setColorPresetId(presetId);
                handleInputChange('color_preset_id', presetId);
              }}
              storyData={formData}
            />
          </div>

          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold" style={{
            fontSize: '21px',
            fontFamily: 'Arial',
            fontWeight: 'bold'
          }}>
              {saveAction === 'save-and-clear' ? 'Confirm Save & Clear' : saveAction === 'cancel-all' ? 'Confirm Cancel All & Clear' : 'Confirm Save'}
            </DialogTitle>
            {(saveAction === 'save-and-clear' || saveAction === 'save-only') && (() => {
            const pubCode = Number(formData.publication_status_code);
            const isPublic = pubCode === 0 || pubCode === 1;
            return <div style={{
              fontSize: isPublic ? '24px' : '21px',
              fontFamily: 'Arial',
              fontWeight: 'bold',
              fontStyle: isPublic ? 'italic' : 'normal',
              color: isPublic ? '#ef4444' : '#3b82f6',
              marginTop: '8px'
            }}>
                  Publication Status Code is <u>{formData.publication_status_code}</u> and will {isPublic ? <><u>IMMEDIATELY</u></> : <><u>NOT</u></>} be available to the public!
                </div>;
          })()}
            <DialogDescription className="text-sm" style={{
            fontSize: '21px',
            fontFamily: 'Arial'
          }}>
              {saveAction === 'save-and-clear' ? <>
                  Are you sure you want to <span className="text-red-600 font-semibold">SAVE</span> this story
                  <br />
                  and then <span className="text-red-600 font-semibold">CLEAR</span> the form?
                </> : saveAction === 'cancel-all' ? <>
                  Are you sure you want to <span className="text-red-600 font-semibold">CANCEL ALL EDITS</span>
                  <br />
                  and <span className="text-red-600 font-semibold">CLEAR</span> the form? All unsaved changes will be lost!
                </> : 'Are you sure you want to save this story?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            {saveAction === 'save-and-clear' || saveAction === 'cancel-all' ? <YesNoButtons onNo={() => confirmSave(false)} onYes={() => confirmSave(true)} yesLabel={saveAction === 'cancel-all' ? 'Clear Now' : 'YES'} noLabel={saveAction === 'cancel-all' ? 'Keep Editing' : 'NO'} /> : <YesNoButtons onNo={() => confirmSave(false)} onYes={() => confirmSave(true)} yesLabel="Save Only" noLabel="Cancel" />}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* SuperAV Modal */}
      {showSuperAV && formData.audio_url && <SuperAV isOpen={showSuperAV} onClose={() => setShowSuperAV(false)} title={formData.story_code || "Story Audio"} author={formData.author} voiceName={formData.ai_voice_name} audioUrl={formData.audio_url} />}
      
      {/* Story Code Lookup Modal Dialog */}
      <StoryCodeDialog
        open={showLookupDialog}
        onOpenChange={setShowLookupDialog}
        storyCode={storyCode}
        storyTitle={lookupResult?.title}
        mode={lookupStatus === 'found' ? 'found' : 'not-found'}
        onEditExisting={handleConfirmYes}
        onYes={handleConfirmYes}
        onNo={handleConfirmNo}
      />
    </SecureAdminRoute>;
};
export default SuperText;