import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
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
import SecureAdminRoute from '@/components/admin/SecureAdminRoute';
import StoryVideoUpload from '@/components/StoryVideoUpload';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import SplitViewEditor from '@/components/editor/SplitViewEditor';
import ConditionalEditorStyles from '@/components/rich-text-editor/ConditionalEditorStyles';
import SuperTextStoryStatus from '@/components/SuperTextStoryStatus';
import LastUpdatesGrid from '@/components/LastUpdatesGrid';
import { useAdminSession } from '@/hooks/useAdminSession';
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
  const [copyrightStatus, setCopyrightStatus] = React.useState('©');
  const [publicationStatusCode, setPublicationStatusCode] = React.useState(5);
  const [lookupResult, setLookupResult] = React.useState<Story | null>(null);
  
  // Refs for section scrolling
  const audioSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    // Initialize form with URL parameters on initial load
    const initialStoryCode = searchParams.get('story_code') || '';
    const initialCategory = searchParams.get('category') || 'Fun';
    const initialCopyrightStatus = searchParams.get('copyright_status') || '©';
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
  }, [searchParams]); // Removed handleInputChange to prevent infinite loop

  const clearForm = useCallback(() => {
    // Reset form fields to initial values
    handleInputChange('title', '');
    handleInputChange('content', '');
    handleInputChange('tagline', '');
    handleInputChange('excerpt', '');
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
    setLookupResult(null);
    toast.success("Form cleared successfully!");
  }, [handleInputChange]);
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
  return <SecureAdminRoute>
      <Helmet>
        <title>Super Text Manager</title>
      </Helmet>
      <ConditionalEditorStyles category={formData.category} />
      
      <div className="min-h-screen" style={{
      backgroundImage: 'url("/lovable-uploads/paper-texture.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat'
    }}>
        {/* Header with title and action buttons */}
        <div className="bg-brown-100 py-4 px-6 border-b-2 border-brown-200">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-brown-800 mb-4">Super Text Manager</h1>
            <div className="flex gap-4 flex-wrap">
              <Button onClick={() => handleSave('save-only')} disabled={isSaving || !storyCode.trim()} className="supertext-yes-btn px-8 py-3 text-lg font-semibold rounded-full" title={!storyCode.trim() ? "Please enter a text code" : ""}>
                {isSaving ? 'Saving...' : 'Save & Don\'t Clear'}
              </Button>
              
              <Button onClick={() => handleSave('save-and-clear')} disabled={isSaving || !storyCode.trim()} className="px-8 py-3 text-lg font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white border-blue-700" title={!storyCode.trim() ? "Please enter a text code" : ""}>
                {isSaving ? 'Saving...' : 'Save & Clear Form'}
              </Button>
              
              <Button onClick={() => handleSave('cancel-all')} className="supertext-no-btn px-8 py-3 text-lg font-semibold rounded-full">
                Cancel All Edits & Clear Form
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Text Details Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-green-400 p-6 relative">
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <h2 className="text-xl font-bold text-green-700">Text Details

                </h2>
                </div>
                
                <div className="space-y-4">
                  {/* Row A - Story Code */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{
                    backgroundColor: '#22c55e',
                    fontSize: '21px',
                    fontFamily: 'Arial'
                  }}>A</div>
                    <div className="flex-1">
                      <Input type="text" placeholder="TEXT CODE" value={storyCode} onChange={e => {
                      const upperValue = e.target.value.toUpperCase();
                      setStoryCode(upperValue);
                      handleInputChange('story_code', upperValue);
                    }} onPaste={e => {
                      const pastedText = e.clipboardData.getData('text');
                      const upperValue = pastedText.toUpperCase();
                      e.preventDefault();
                      setStoryCode(upperValue);
                      handleInputChange('story_code', upperValue);
                    }} onBlur={e => {
                      const upperValue = e.target.value.toUpperCase();
                      if (upperValue !== e.target.value) {
                        setStoryCode(upperValue);
                        handleInputChange('story_code', upperValue);
                      }
                    }} className="border-orange-400 focus:border-orange-500" style={{
                      width: '192px',
                      fontSize: '21px',
                      fontFamily: 'Arial',
                      fontStyle: 'normal',
                      color: '#000000'
                    }} autoCapitalize="characters" spellCheck={false} />
                    </div>
                  </div>

                  {/* Row B - Category */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{
                    backgroundColor: '#22c55e',
                    fontSize: '21px',
                    fontFamily: 'Arial'
                  }}>B</div>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div>
                         <Select value={formData.category} onValueChange={value => {
                        setCategory(value);
                        handleInputChange('category', value);
                      }}>
                           <SelectTrigger className="w-full border-orange-400 focus:border-orange-500 [&>svg]:text-white [&>svg]:opacity-100" style={{
                          fontSize: '21px',
                          fontFamily: 'Arial',
                          fontWeight: 'bold',
                          backgroundColor: '#F97316',
                          color: 'white',
                          borderColor: '#ea580c'
                        }}>
                             <SelectValue placeholder="Category" />
                           </SelectTrigger>
                          <SelectContent className="bg-white">
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
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                className="p-2 bg-blue-400 text-white hover:bg-blue-500 border-blue-400" 
                                style={{
                                  fontSize: '21px',
                                  fontFamily: 'Arial',
                                  fontWeight: 'bold'
                                }}
                                onClick={scrollToAudioSection}
                              >
                                A
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Jump to Audio tools</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                className="p-2 bg-purple-400 text-white hover:bg-purple-500 border-purple-400" 
                                style={{
                                  fontSize: '21px',
                                  fontFamily: 'Arial',
                                  fontWeight: 'bold'
                                }}
                                onClick={scrollToVideoSection}
                              >
                                V
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Jump to Video tools</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  {/* Row C - Copyright */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{
                    backgroundColor: '#22c55e',
                    fontSize: '21px',
                    fontFamily: 'Arial'
                  }}>C</div>
                    <div className="flex gap-3 flex-1">
                       <Select value={formData.copyright_status || ''} onValueChange={value => {
                      setCopyrightStatus(value);
                      handleInputChange('copyright_status', value);
                    }}>
                         <SelectTrigger className="w-[320px] text-white text-left border-2 [&>svg]:text-white [&>svg]:opacity-100" style={{
                        fontSize: '21px',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        textAlign: 'left',
                        backgroundColor: !formData.copyright_status ? '#9c441a' : formData.copyright_status === '©' ? '#dc2626' : formData.copyright_status === 'L' ? '#F97316' : formData.copyright_status === 'O' ? '#228B22' : '#9c441a',
                        borderColor: !formData.copyright_status ? '#7a2f19' : formData.copyright_status === '©' ? '#b91c1c' : formData.copyright_status === 'L' ? '#ea580c' : formData.copyright_status === 'O' ? '#166534' : '#7a2f19'
                      }}>
                           <SelectValue placeholder="Copyright Status" />
                         </SelectTrigger>
                        <SelectContent className="bg-white">
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
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{
                        backgroundColor: '#22c55e',
                        fontSize: '21px',
                        fontFamily: 'Arial'
                      }}>D</div>
                        <Button onClick={handleStoryCodeLookup} disabled={isLoadingStory} variant="outline" className="text-white border-green-600 hover:bg-green-700" style={{
                        background: 'linear-gradient(to bottom, #16a34a, #15803d)',
                        fontSize: '21px',
                        fontFamily: 'Arial',
                        fontWeight: 'bold'
                      }}>
                          {isLoadingStory ? 'Loading...' : 'Load Text'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded border-2 border-orange-400" style={{
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
              </div>

              {/* Story Photos Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-orange-400 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <h2 className="text-xl font-bold text-orange-700" style={{
                  fontSize: '21px',
                  fontFamily: 'Arial',
                  fontWeight: 'bold'
                }}>🖼️ Story Photos</h2>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(index => <div key={index} className="border-2 border-orange-400 rounded p-4 text-center">
                      <div className="bg-gray-100 h-32 flex items-center justify-center mb-2 rounded">
                        <span className="text-gray-500" style={{
                      fontSize: '21px',
                      fontFamily: 'Arial',
                      fontWeight: 'bold'
                    }}>No Photo</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mb-2 text-red-600 border-red-400" style={{
                    fontSize: '21px',
                    fontFamily: 'Arial',
                    fontWeight: 'bold'
                  }}>
                        Choose File
                      </Button>
                      <span className="text-xs text-gray-500" style={{
                    fontSize: '21px',
                    fontFamily: 'Arial',
                    fontWeight: 'bold'
                  }}>N...en</span>
                      <Input placeholder="Alt text" className="mt-2 text-sm" value={(formData as any)[`photo_alt_${index}`] || ''} onChange={e => handleInputChange(`photo_alt_${index}` as keyof Story, e.target.value)} style={{
                    fontSize: '21px',
                    fontFamily: 'Arial',
                    fontWeight: 'bold'
                  }} />
                    </div>)}
                </div>
              </div>

              {/* Story Video Section */}
              <div ref={videoSectionRef} className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-purple-400 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
                  <h2 className="text-xl font-bold text-purple-700">📹 Story Video</h2>
                </div>
                
                <StoryVideoUpload videoUrl={formData.video_url} onVideoUpload={handleVideoUpload} onVideoRemove={handleVideoRemove} onDurationCalculated={handleVideoDurationCalculated} />
              </div>

              {/* Audio Upload Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-green-400 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">C</div>
                  <h2 className="text-xl font-bold text-green-700">🔊 Audio Upload</h2>
                </div>
                
                <p className="text-gray-600">Audio upload functionality will be added back here.</p>
              </div>

              {/* Google Drive Upload Section */}
              <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-6">
                <h2 className="text-xl font-bold text-orange-700 mb-4">Upload Text From Google Drive</h2>
                <div className="space-y-3">
                  <Input type="text" placeholder="Paste Google Drive Share Code here" value={formData.google_drive_link} onChange={e => handleInputChange('google_drive_link', e.target.value)} className="border-orange-400 focus:border-orange-500" />
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Upload
                  </Button>
                </div>
              </div>

              {/* Split Editor Section */}
              <div className="bg-white/95 backdrop-blur-sm rounded-lg border-2 border-green-400 p-4">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-green-700">📝 Creating New Story: {formData.story_code || 'SVS-AEW'}</h2>
                </div>
                
                <SplitViewEditor content={formData.content} onChange={value => handleInputChange('content', value)} placeholder="Enter your story content here..." category={formData.category as any} previewContent={formData.content} />
              </div>
            </div>

            {/* Right Panel - Status and Actions */}
            <div className="space-y-6">
              {/* Last Updates Section */}
              <LastUpdatesGrid story={lookupResult || formData} />
              
              {/* Text Status Section */}
              <SuperTextStoryStatus story={lookupResult || formData} publicationStatusCode={publicationStatusCode} onStatusChange={status => {
              setPublicationStatusCode(status);
              handleInputChange('publication_status_code', status.toString());
            }} />

              {/* Create AI Audio Section */}
              <div ref={audioSectionRef} className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-blue-400 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4">🔊 Create AI Audio File</h2>
                
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
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={() => handleGenerateAudio()} disabled={isGeneratingAudio || !formData.content} className="w-full bg-gray-400 text-gray-600">
                  🔊 {isGeneratingAudio ? 'Generating...' : 'Story Required'}
                </Button>
              </div>

              {/* Voice Previews Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-orange-400 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                  <h2 className="text-xl font-bold text-blue-700">🔊 Voice Previews</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[{
                  name: 'Buddy',
                  desc: 'Clear, neutral voice (Alloy)',
                  voice: 'alloy'
                }, {
                  name: 'Gpa John',
                  desc: 'Deep, resonant voice (Echo)',
                  voice: 'echo'
                }, {
                  name: 'Fluffy',
                  desc: 'British accent, storytelling (Fable)',
                  voice: 'fable'
                }, {
                  name: 'Nova',
                  desc: 'Warm, friendly voice',
                  voice: 'nova'
                }, {
                  name: 'Max',
                  desc: 'Deep, authoritative voice (Onyx)',
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
                  name: 'Sparky',
                  desc: 'Warm and thoughtful, reflective (Sage)',
                  voice: 'sage'
                }, {
                  name: '',
                  desc: 'Available for future voices',
                  voice: ''
                }].map((voice, index) => <div key={index} className="border rounded p-2 text-center">
                      <div className="font-bold">{voice.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{voice.desc}</div>
                      {voice.voice && <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            ▶ Test
                          </Button>
                          <Button size="sm" className="flex-1 text-xs bg-green-600 hover:bg-green-700">
                            Use
                          </Button>
                        </div>}
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
    </SecureAdminRoute>;
};
export default SuperText;