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
import { useStoryFormState } from '@/hooks/useStoryFormState';
import { useStoryFormActions } from '@/hooks/useStoryFormActions';
import { useVoiceTesting } from '@/hooks/useVoiceTesting';
import { getVoiceCharacter } from '@/utils/characterVoices';
import SecureAdminRoute from '@/components/admin/SecureAdminRoute';
import StoryVideoUpload from '@/components/StoryVideoUpload';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import SplitViewEditor from '@/components/editor/SplitViewEditor';
import ConditionalEditorStyles from '@/components/rich-text-editor/ConditionalEditorStyles';
import SuperTextStoryStatus from '@/components/SuperTextStoryStatus';
import LastUpdatesGrid from '@/components/LastUpdatesGrid';
import { useAdminSession } from '@/hooks/useAdminSession';
import StoryPhotoUpload from '@/components/StoryPhotoUpload';
import './SuperText.css';
interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  google_drive_link: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  photo_alt_1: string;
  photo_alt_2: string;
  photo_alt_3: string;
  video_url: string;
  ai_voice_name: string;
  ai_voice_model: string;
  ai_voice_url?: string;
  copyright_status?: string;
  audio_url?: string;
  audio_duration_seconds?: number;
  video_duration_seconds?: number;
  created_at?: string;
  updated_at?: string;
  audio_generated_at?: string;
  publication_status_code?: number;
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
    refetchStory,
    populateFormWithStory,
    handleInputChange,
    handlePhotoUpload,
    handlePhotoRemove,
    handleVideoUpload,
    handleVideoRemove,
    handleVoiceChange,
    handleGenerateAudio,
    error
  } = useStoryFormState(undefined, true);
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
  } = useStoryFormActions(storyId, refetchStory, handleStoryFormSave);
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
        const { found, story, error } = await lookupStoryByCode(initialStoryCode);
        if (error) {
          toast.error("Error looking up story by code.");
          return;
        }
        if (!found) {
          toast.message("No story found with that code.");
          return;
        }
        if (story) {
          populateFormWithStory(story, true);
          setLookupResult(story);
          setCategory(story.category);
          setCopyrightStatus(story.copyright_status || '©');
          setPublicationStatusCode(story.publication_status_code || 5);
          toast.success("Story data loaded successfully!");
        }
      };
      
      // Trigger lookup after a brief delay to ensure all state is set
      setTimeout(autoLookup, 100);
    }
  }, [searchParams, lookupStoryByCode, populateFormWithStory]);

  const clearForm = useCallback(() => {
    // Reset form fields to initial values
    handleInputChange('title', '');
    handleInputChange('content', '');
    handleInputChange('tagline', '');
    handleInputChange('excerpt', '');
    handleInputChange('story_code', '');
    handleInputChange('google_drive_link', '');
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

    // Reset local state
    setStoryCode('');
    setCategory('');
    setCopyrightStatus('');
    setPublicationStatusCode(5);
    
    // Clear category in form data
    handleInputChange('category', '');
    setLookupResult(null);

    // Clear URL query parameters
    navigate('/buddys_admin/super-text', { replace: true });

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
      populateFormWithStory(story, true);
      setLookupResult(story); // Store the looked-up story

      // Sync local state with story data
      setCategory(story.category);
      setCopyrightStatus(story.copyright_status || '©');
      setPublicationStatusCode(story.publication_status_code || 5);
      toast.success("Story data loaded successfully!");
    }
  }, [storyCode, lookupStoryByCode, populateFormWithStory]);
  const handleSave = async (action: 'save-and-clear' | 'save-only' | 'cancel-all') => {
    // Check if text code is empty for save actions
    if ((action === 'save-and-clear' || action === 'save-only') && !storyCode.trim()) {
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
      if (!formData.title || !formData.content || !formData.story_code) {
        toast.error("Please fill in all required fields.");
        return;
      }
      if (saveAction === 'save-and-clear') {
        await handleSubmit(formData);
      } else if (saveAction === 'save-only') {
        await handleSaveOnly(formData);
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
  return (
    <SecureAdminRoute>
      <Helmet>
        <title>Super Text Manager</title>
      </Helmet>
      <ConditionalEditorStyles category={formData.category} />
      
      {/* Header with title and action buttons */}
      <div className="bg-white/80 backdrop-blur-sm py-4 px-6 border-b border-orange-200/50 sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-orange-800 mb-4">Super Text Manager</h1>
         <div className="flex gap-4 flex-wrap">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button onClick={() => handleSave('save-only')} disabled={isSaving || !storyCode.trim()} className="supertext-yes-btn px-8 py-3 text-lg font-semibold rounded-full">
                   {isSaving ? 'Saving...' : 'Save & Don\'t Clear'}
                 </Button>
               </TooltipTrigger>
               <TooltipContent 
                 side="bottom" 
                 align="center"
                 className="bg-white border border-gray-300 shadow-lg"
                 style={{ 
                   fontFamily: 'Arial', 
                   fontSize: '21px', 
                   color: 'black',
                   backgroundColor: 'white'
                 }}
               >
                 Save story and keep form open for editing
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
           
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button onClick={() => handleSave('save-and-clear')} disabled={isSaving || !storyCode.trim()} className="px-8 py-3 text-lg font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white border-blue-700">
                   {isSaving ? 'Saving...' : 'Save & Clear Form'}
                 </Button>
               </TooltipTrigger>
               <TooltipContent 
                 side="bottom" 
                 align="center"
                 className="bg-white border border-gray-300 shadow-lg"
                 style={{ 
                   fontFamily: 'Arial', 
                   fontSize: '21px', 
                   color: 'black',
                   backgroundColor: 'white'
                 }}
               >
                 Save story and clear form for new entry
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
           
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button onClick={() => handleSave('cancel-all')} className="supertext-no-btn px-8 py-3 text-lg font-semibold rounded-full">
                   Cancel All Edits & Clear Form
                 </Button>
               </TooltipTrigger>
               <TooltipContent 
                 side="bottom" 
                 align="center"
                 className="bg-white border border-gray-300 shadow-lg"
                 style={{ 
                   fontFamily: 'Arial', 
                   fontSize: '21px', 
                   color: 'black',
                   backgroundColor: 'white'
                 }}
               >
                 Discard all changes and clear form
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
         </div>
      </div>

      <div className="pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Text Details Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-green-400 p-6 relative lg:pr-[420px]">
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center supertext-fs-21px-arial-white font-bold">1</div>
                  <h2 className="text-xl font-bold supertext-fs-24px-arial-green">Text Details</h2>
                </div>
                
                {/* Text Status Box - positioned in top-right corner on large screens */}
                <div className="hidden lg:block absolute top-6 right-6">
                  <SuperTextStoryStatus 
                    story={lookupResult || formData} 
                    publicationStatusCode={publicationStatusCode} 
                    onStatusChange={status => {
                      setPublicationStatusCode(status);
                      handleInputChange('publication_status_code', status.toString());
                    }} 
                  />
                </div>
                
                {/* 4x3 Grid Layout with explicit positioning - aligned with blue dot above */}
                <div className="grid grid-rows-4 grid-cols-[32px_192px_auto] gap-y-2 gap-x-1">
                  {/* Column 1, Row 1: Green Dot A */}
                  <div className="row-start-1 col-start-1 place-self-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center supertext-fs-21px-arial-white font-bold" style={{ backgroundColor: '#22c55e' }}>A</div>
                  </div>
                  
                  {/* Column 1, Row 2: Green Dot B */}
                  <div className="row-start-2 col-start-1 place-self-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center supertext-fs-21px-arial-white font-bold" style={{ backgroundColor: '#22c55e' }}>B</div>
                  </div>
                  
                  {/* Column 1, Row 3: Green Dot C */}
                  <div className="row-start-3 col-start-1 place-self-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center supertext-fs-21px-arial-white font-bold" style={{ backgroundColor: '#22c55e' }}>C</div>
                  </div>

                  {/* Column 1, Row 4: Green Dot D */}
                  <div className="row-start-4 col-start-1 place-self-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center supertext-fs-21px-arial-white font-bold" style={{ backgroundColor: '#22c55e' }}>D</div>
                  </div>

                  {/* Column 2, Row 1: Text Code */}
                  <div className="row-start-1 col-start-2 self-end">
                    <Input 
                      ref={storyCodeRef}
                      type="text" 
                      placeholder="TEXT CODE" 
                      value={storyCode} 
                      onChange={e => {
                        const upperValue = e.target.value.toUpperCase();
                        setStoryCode(upperValue);
                        handleInputChange('story_code', upperValue);
                      }} 
                      onPaste={e => {
                        const pastedText = e.clipboardData.getData('text');
                        const upperValue = pastedText.toUpperCase();
                        e.preventDefault();
                        setStoryCode(upperValue);
                        handleInputChange('story_code', upperValue);
                      }} 
                      onBlur={e => {
                        const upperValue = e.target.value.toUpperCase();
                        if (upperValue !== e.target.value) {
                          setStoryCode(upperValue);
                          handleInputChange('story_code', upperValue);
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Tab' && e.shiftKey) {
                          e.preventDefault();
                          loadTextBtnRef.current?.focus();
                        }
                      }}
                      className="border-4 border-orange-400 focus:border-orange-500 supertext-fs-21px-arial-black" 
                      style={{
                        width: '192px',
                        fontStyle: 'normal'
                      }}
                      autoCapitalize="characters" 
                      spellCheck={false} 
                      tabIndex={1} 
                    />
                  </div>

                  {/* Column 2, Row 2: Category Dropdown */}
                  <div className="row-start-2 col-start-2 self-end">
                    <Select value={formData.category || ''} onValueChange={value => {
                      setCategory(value);
                      handleInputChange('category', value);
                    }}>
                      <SelectTrigger className="w-[192px] border-orange-400 focus:border-orange-500 [&>svg]:text-white [&>svg]:opacity-100" style={{
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
                        <SelectItem value="WebText" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}>
                          <div className="px-3 py-1 rounded w-full text-center text-white" style={{
                            backgroundColor: '#A0522D'
                          }}>
                            WebText
                          </div>
                        </SelectItem>
                        <SelectItem value="Fun" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}>
                          <div className="bg-gradient-to-b from-blue-400 to-blue-600 text-white border-blue-500 px-3 py-1 rounded w-full text-center">
                            Fun
                          </div>
                        </SelectItem>
                        <SelectItem value="Life" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}>
                          <div className="bg-gradient-to-b from-green-400 to-green-600 text-white border-green-500 px-3 py-1 rounded w-full text-center">
                            Life
                          </div>
                        </SelectItem>
                        <SelectItem value="North Pole" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}>
                          <div className="bg-gradient-to-b from-red-400 to-red-600 text-white border-red-500 px-3 py-1 rounded w-full text-center">
                            North Pole
                          </div>
                        </SelectItem>
                        <SelectItem value="World Changers" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}>
                          <div className="bg-gradient-to-b from-purple-400 to-purple-600 text-white border-purple-500 px-3 py-1 rounded w-full text-center">
                            World Changers
                          </div>
                        </SelectItem>
                        <SelectItem value="BioText" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}>
                          <div className="bg-gradient-to-b from-gray-400 to-gray-600 text-white border-gray-500 px-3 py-1 rounded w-full text-center">
                            BioText
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Column 2, Row 3: Copyright Status */}
                  <div className="row-start-3 col-start-2 self-end">
                    <Select value={formData.copyright_status || ''} onValueChange={value => {
                      setCopyrightStatus(value);
                      handleInputChange('copyright_status', value);
                    }}>
                      <SelectTrigger className="w-[192px] text-white text-left border-2 [&>svg]:text-white [&>svg]:opacity-100" style={{
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
                        <SelectItem value="©" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}>
                          <div className="px-3 py-1 rounded w-full text-center text-white bg-red-600">
                            © - Full Copyright
                          </div>
                        </SelectItem>
                        <SelectItem value="L" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}>
                          <div className="px-3 py-1 rounded w-full text-center text-white" style={{
                            backgroundColor: '#F97316'
                          }}>
                            L — Limited Use
                          </div>
                        </SelectItem>
                        <SelectItem value="O" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold'
                        }}>
                          <div className="px-3 py-1 rounded w-full text-center text-white" style={{
                            backgroundColor: '#228B22'
                          }}>
                            O — Open Unlimited
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Column 2, Row 4: Load Text Button */}
                  <div className="row-start-4 col-start-2 flex flex-col justify-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            ref={loadTextBtnRef}
                            onClick={handleStoryCodeLookup} 
                            disabled={isLoadingStory}
                            className="supertext-text-btn flex items-center justify-start px-2 py-1 w-[192px] rounded-full" 
                            style={{
                              fontSize: '21px',
                              fontFamily: 'Arial',
                              fontWeight: 'bold',
                              color: 'white',
                              lineHeight: '1',
                              textAlign: 'left'
                            }} 
                            onKeyDown={e => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault();
                                storyCodeRef.current?.focus();
                              }
                            }}
                            tabIndex={4}
                          >
                            Load Text
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="bottom" 
                          align="center"
                          className="bg-white border border-gray-300 shadow-lg"
                          style={{ 
                            fontFamily: 'Arial', 
                            fontSize: '21px', 
                            color: 'black',
                            backgroundColor: 'white'
                          }}
                        >
                          Load existing text using the code above
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Column 3, Row 1: Add/Edit Text Button */}
                  <div className="row-start-1 col-start-3 justify-self-start self-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={scrollToTextEditorSection} 
                            className="supertext-text-btn px-6 py-2 rounded-full"
                             style={{
                               fontSize: '21px',
                               fontFamily: 'Arial',
                               fontWeight: 'bold'
                             }}
                            tabIndex={-1}
                          >
                            Add/Edit Text
                          </Button>
                        </TooltipTrigger>
                         <TooltipContent 
                           side="bottom" 
                           align="center"
                           className="bg-white border border-gray-300 shadow-lg"
                           style={{ 
                             fontFamily: 'Arial', 
                             fontSize: '21px', 
                             color: 'black',
                             backgroundColor: 'white'
                           }}
                         >
                           Add/Edit Text Content
                         </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Column 3, Row 2: Add Audio File Button */}
                  <div className="row-start-2 col-start-3 justify-self-start self-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={scrollToAudioSection} 
                            className="supertext-audio-btn px-6 py-2 rounded-full"
                             style={{
                               fontSize: '21px',
                               fontFamily: 'Arial',
                               fontWeight: 'bold'
                             }}
                            tabIndex={-1}
                          >
                            Add Audio File
                          </Button>
                        </TooltipTrigger>
                         <TooltipContent 
                           side="bottom" 
                           align="center"
                           className="bg-white border border-gray-300 shadow-lg"
                           style={{ 
                             fontFamily: 'Arial', 
                             fontSize: '21px', 
                             color: 'black',
                             backgroundColor: 'white'
                           }}
                         >
                           Add or Generate Audio
                         </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Column 3, Row 3: Add Video File Button */}
                  <div className="row-start-3 col-start-3 justify-self-start self-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={scrollToVideoSection} 
                            className="supertext-video-btn px-6 py-2 rounded-full"
                             style={{
                               fontSize: '21px',
                               fontFamily: 'Arial',
                               fontWeight: 'bold'
                             }}
                            tabIndex={-1}
                          >
                            Add Video File
                          </Button>
                        </TooltipTrigger>
                         <TooltipContent 
                           side="bottom" 
                           align="center"
                           className="bg-white border border-gray-300 shadow-lg"
                           style={{ 
                             fontFamily: 'Arial', 
                             fontSize: '21px', 
                             color: 'black',
                             backgroundColor: 'white'
                           }}
                         >
                           Add Video Content
                         </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded border-2 border-orange-400 mt-4" style={{
                  fontSize: '21px',
                  fontFamily: 'Arial',
                  fontWeight: 'bold'
                }}>
                  <Label className="text-gray-600 font-medium" style={{
                    fontSize: '21px',
                    fontFamily: 'Arial',
                    fontWeight: 'bold'
                  }}></Label>
                  <p className="text-gray-500 mt-1" style={{
                    fontSize: '21px',
                    fontFamily: 'Arial',
                    fontWeight: 'bold'
                  }}>
                    {formData.id ? `Story loaded: ${formData.title || 'Untitled'}` : 'Enter Text Code, Category & Copyright, then Click Lookup'}
                  </p>
                </div>
              </div>

              {/* Story Photos Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-orange-400 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <h2 className="text-xl font-bold text-orange-700" style={{
                  fontSize: '21px',
                  fontFamily: 'Arial',
                  fontWeight: 'bold'
                }}>🖼️ Story Photos</h2>
                </div>
                
                <StoryPhotoUpload
                  photoUrls={{
                    photo_link_1: formData.photo_link_1,
                    photo_link_2: formData.photo_link_2,
                    photo_link_3: formData.photo_link_3
                  }}
                  photoAlts={{
                    photo_alt_1: formData.photo_alt_1,
                    photo_alt_2: formData.photo_alt_2,
                    photo_alt_3: formData.photo_alt_3
                  }}
                  onPhotoUpload={(photoNumber, url) => {
                    handleInputChange(`photo_link_${photoNumber}` as keyof Story, url);
                  }}
                  onPhotoRemove={(photoNumber) => {
                    handleInputChange(`photo_link_${photoNumber}` as keyof Story, '');
                    handleInputChange(`photo_alt_${photoNumber}` as keyof Story, '');
                  }}
                  onAltTextChange={(field, value) => {
                    handleInputChange(field as keyof Story, value);
                  }}
                />
              </div>

              {/* 3-Column Grid: Video, Audio, Google Drive */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Column 1: Story Video */}
                <div ref={videoSectionRef} className="w-full bg-white/90 backdrop-blur-sm rounded-lg border-2 border-purple-400 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
                    <h2 className="text-xl font-bold text-purple-700">📹 Story Video</h2>
                  </div>
                  
                  <StoryVideoUpload videoUrl={formData.video_url} onVideoUpload={handleVideoUpload} onVideoRemove={handleVideoRemove} onDurationCalculated={handleVideoDurationCalculated} />
                </div>

                {/* Column 2: Audio Upload */}
                <div ref={audioSectionRef} className="w-full bg-white/90 backdrop-blur-sm rounded-lg border-2 border-blue-400 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">C</div>
                    <h2 className="text-xl font-bold text-blue-700">🔊 Audio Upload</h2>
                  </div>
                  
                  <div className="mb-4">
                    <Label className="font-semibold">Choose Voice</Label>
                    <Select value={formData.ai_voice_name} onValueChange={value => handleInputChange('ai_voice_name', value)}>
                      <SelectTrigger className="w-full border-orange-400">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nova">Nova</SelectItem>
                        <SelectItem value="Alloy">Alloy</SelectItem>
                        <SelectItem value="Echo">Echo</SelectItem>
                        <SelectItem value="Fable">Fable</SelectItem>
                        <SelectItem value="Onyx">Onyx</SelectItem>
                        <SelectItem value="Shimmer">Shimmer</SelectItem>
                        <SelectItem value="Sage">Sage</SelectItem>
                        <SelectItem value="Ash">Ash</SelectItem>
                        <SelectItem value="Coral">Coral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                   <TooltipProvider>
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <Button onClick={() => handleGenerateAudio()} disabled={isGeneratingAudio || !formData.content} className="w-full bg-gray-400 text-gray-600">
                           🔊 {isGeneratingAudio ? 'Generating...' : 'Story Required'}
                         </Button>
                       </TooltipTrigger>
                       <TooltipContent 
                         side="bottom" 
                         align="center"
                         className="bg-white border border-gray-300 shadow-lg"
                         style={{ 
                           fontFamily: 'Arial', 
                           fontSize: '21px', 
                           color: 'black',
                           backgroundColor: 'white'
                         }}
                       >
                         Generate AI audio from story content
                       </TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                </div>

                 {/* Column 3: Google Drive Upload */}
                 <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-6 relative">
                   {/* Orange Dot D in top left corner */}
                   <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center supertext-fs-21px-arial-white font-bold">D</div>
                   <h2 className="text-xl font-bold text-orange-700 mb-4">Upload Text From Google Drive</h2>
                  <div className="space-y-3">
                    <Input type="text" placeholder="Paste Google Drive Share Code here" value={formData.google_drive_link} onChange={e => handleInputChange('google_drive_link', e.target.value)} className="border-orange-400 focus:border-orange-500" />
                     <TooltipProvider>
                       <Tooltip>
                         <TooltipTrigger asChild>
                           <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                             Upload
                           </Button>
                         </TooltipTrigger>
                         <TooltipContent 
                           side="bottom" 
                           align="center"
                           className="bg-white border border-gray-300 shadow-lg"
                           style={{ 
                             fontFamily: 'Arial', 
                             fontSize: '21px', 
                             color: 'black',
                             backgroundColor: 'white'
                           }}
                         >
                           Import text from Google Drive
                         </TooltipContent>
                       </Tooltip>
                     </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Status and Actions */}
            <div className="space-y-6">
              {/* Last Updates Section */}
              <div className="flex flex-col items-center">
                <LastUpdatesGrid story={lookupResult || formData} hideTitle={true} />
              </div>
              
              {/* Text Status Section - Hidden on large screens since it's now in Text Details box */}
              <div className="lg:hidden">
                <SuperTextStoryStatus story={lookupResult || formData} publicationStatusCode={publicationStatusCode} onStatusChange={status => {
                  setPublicationStatusCode(status);
                  handleInputChange('publication_status_code', status.toString());
                }} />
              </div>

              {/* Create AI Voice File Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-green-400 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">🎵</div>
                  <h2 className="text-xl font-bold text-green-700">🎵 Create AI Voice File</h2>
                </div>
                
                <div className="space-y-4">
                  {/* Current Voice Display */}
                  <div className="text-sm">
                    <span className="font-semibold">Current Voice: </span>
                    <span className="text-blue-600">{formData.ai_voice_name || 'No voice selected'}</span>
                    {formData.ai_voice_name && (
                      <span className="text-gray-500 ml-2">
                        ({getVoiceCharacter(formData.ai_voice_name.toLowerCase())})
                      </span>
                    )}
                  </div>

                  {/* Audio Generation Button */}
                  <Button 
                    onClick={() => handleGenerateAudio()} 
                    disabled={isGeneratingAudio || !formData.content || !formData.ai_voice_name} 
                    className={`w-full ${isGeneratingAudio || !formData.content || !formData.ai_voice_name 
                      ? 'bg-gray-400 text-gray-600' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    🎵 {isGeneratingAudio 
                      ? 'Generating Audio...' 
                      : !formData.content 
                        ? 'Story Content Required' 
                        : !formData.ai_voice_name
                          ? 'Voice Selection Required'
                          : 'Generate Audio File'
                    }
                  </Button>

                  {/* Existing Audio File Display */}
                  {formData.ai_voice_url && (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-green-700">Existing Audio File:</div>
                      <audio controls className="w-full">
                        <source src={formData.ai_voice_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {/* Voice Settings Link */}
                  <div className="text-xs text-gray-500 text-center">
                    <span>Change voice in </span>
                    <button 
                      onClick={scrollToAudioSection}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Audio Upload section
                    </button>
                    <span> or </span>
                    <button 
                      onClick={() => {
                        const voiceSection = document.querySelector('[data-voice-previews]') || 
                                           document.querySelector('h2:contains("Voice Previews")');
                        if (voiceSection) {
                          voiceSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Voice Previews below
                    </button>
                  </div>
                </div>
              </div>

              {/* Voice Previews Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-orange-400 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                  <h2 className="text-xl font-bold text-blue-700">🔊 Voice Previews</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[{
                  name: 'Buddy / Alloy',
                  desc: 'Clear, neutral voice',
                  voice: 'alloy'
                }, {
                  name: 'Gpa John / Echo',
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
                  name: 'Ash',
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
                }].map((voice, index) => <div key={index} className="border rounded p-2 text-center">
                      <div className="font-bold">{voice.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{voice.desc}</div>
                      <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 text-xs"
                            onClick={() => {
                              if (currentlyPlaying === voice.voice) {
                                stopAudio();
                              } else {
                                playVoice(voice.voice, formData.content, formData.title);
                              }
                            }}
                            disabled={loadingVoice === voice.voice}
                          >
                            {loadingVoice === voice.voice ? "..." : currentlyPlaying === voice.voice ? "⏸ Stop" : "▶ Test"}
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              const capitalizedVoice = voice.voice.charAt(0).toUpperCase() + voice.voice.slice(1);
                              handleInputChange('ai_voice_name', capitalizedVoice);
                              toast.success(`Selected ${voice.name} voice`);
                            }}
                          >
                            Use
                          </Button>
                        </div>
                    </div>)}
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
          <div ref={textEditorSectionRef} className="w-full bg-white/95 backdrop-blur-sm rounded-lg border-2 border-green-400 p-4 mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-green-700">📝 {lookupResult ? `Editing Story${formData.story_code ? `: ${formData.story_code}` : ''}` : `Creating New Story${formData.story_code ? `: ${formData.story_code}` : ''}`}</h2>
            </div>
            
            <SplitViewEditor content={formData.content} onChange={value => handleInputChange('content', value)} placeholder="Enter your story content here..." category={formData.category as any} previewContent={formData.content} />
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
    </SecureAdminRoute>
  );
};
export default SuperText;