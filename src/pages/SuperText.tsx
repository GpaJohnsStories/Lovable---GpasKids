import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useStoryFormState } from '@/hooks/useStoryFormState';
import { useStoryFormActions } from '@/hooks/useStoryFormActions';
import SecureAdminRoute from '@/components/admin/SecureAdminRoute';
import StoryVideoUpload from '@/components/StoryVideoUpload';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';

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
  const { lookupStoryByCode } = useStoryCodeLookup();

  const storyId = searchParams.get('id');
  const clear = searchParams.get('clear') === 'true';

  const { handleSubmit, handleSaveOnly, isSaving } = useStoryFormActions(
    storyId,
    refetchStory,
    clear ? () => navigate('/admin') : undefined
  );

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
  }, [searchParams, handleInputChange]);

  useEffect(() => {
    // Clear form after submit if 'clear' param is true
    if (clear) {
      // Reset form fields to initial values
      handleInputChange('title', '');
      handleInputChange('content', '');
      handleInputChange('tagline', '');
      handleInputChange('excerpt', '');
      handleInputChange('google_drive_link', '');
      handleInputChange('photo_link_1', '');
      handleInputChange('photo_link_2', '');
      handleInputChange('photo_link_3', '');
      handleInputChange('video_url', '');
      handleInputChange('ai_voice_name', 'Nova');
      handleInputChange('ai_voice_model', 'tts-1');
      handleInputChange('copyright_status', '©');
      handleInputChange('publication_status_code', '5');

      // Reset local state
      setStoryCode('');
      setCategory('');
      setCopyrightStatus('©');
      setPublicationStatusCode(5);
    }
  }, [clear, handleInputChange]);

  const handleStoryCodeLookup = useCallback(async () => {
    if (!storyCode.trim()) {
      toast.error("Please enter a story code to lookup.");
      return;
    }

    const { found, story, error } = await lookupStoryByCode(storyCode);

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
      toast.success("Story data loaded successfully!");
    }
  }, [storyCode, lookupStoryByCode, populateFormWithStory]);

  const handleSave = async (action: 'save-and-clear' | 'save-only') => {
    setSaveAction(action);
    setShowConfirmDialog(true);
  };

  const confirmSave = async (confirmed: boolean) => {
    setShowConfirmDialog(false);

    if (confirmed) {
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

  return (
    <SecureAdminRoute>
      <Helmet>
        <title>Super Text Editor - Story Management</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Super Text Editor</h1>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Story Code"
                value={storyCode}
                onKeyDown={handleKeyDown}
                onChange={(e) => setStoryCode(e.target.value)}
                className="max-w-[150px]"
              />
              <Button onClick={handleStoryCodeLookup} disabled={isLoadingStory}>
                {isLoadingStory ? 'Looking Up...' : 'Lookup Code'}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Story Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        type="text"
                        id="title"
                        placeholder="Story Title"
                        value={formData.title}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        type="text"
                        id="author"
                        placeholder="Author Name"
                        value={formData.author}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="story_code">Story Code</Label>
                      <Input
                        type="text"
                        id="story_code"
                        placeholder="Unique Story Code"
                        value={formData.story_code}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => handleInputChange('story_code', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        type="text"
                        id="tagline"
                        placeholder="Short Tagline"
                        value={formData.tagline}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Input
                      type="text"
                      id="excerpt"
                      placeholder="Brief Excerpt"
                      value={formData.excerpt}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Story Content"
                      value={formData.content}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Media & Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={(value) => {
                        setCategory(value);
                        handleInputChange('category', value);
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fun">Fun</SelectItem>
                          <SelectItem value="Life">Life</SelectItem>
                          <SelectItem value="North Pole">North Pole</SelectItem>
                          <SelectItem value="World Changers">World Changers</SelectItem>
                          <SelectItem value="WebText">WebText</SelectItem>
                          <SelectItem value="BioText">BioText</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="publication_status_code">Publication Status</Label>
                      <Select value={publicationStatusCode.toString()} onValueChange={(value) => {
                        setPublicationStatusCode(Number(value));
                        handleInputChange('publication_status_code', value);
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Published</SelectItem>
                          <SelectItem value="2">Draft</SelectItem>
                          <SelectItem value="3">Scheduled</SelectItem>
                          <SelectItem value="4">Archived</SelectItem>
                          <SelectItem value="5">Unspecified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ai_voice_name">AI Voice Name</Label>
                      <Input
                        type="text"
                        id="ai_voice_name"
                        placeholder="AI Voice Name"
                        value={formData.ai_voice_name}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => handleInputChange('ai_voice_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ai_voice_model">AI Voice Model</Label>
                      <Input
                        type="text"
                        id="ai_voice_model"
                        placeholder="AI Voice Model"
                        value={formData.ai_voice_model}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => handleInputChange('ai_voice_model', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="google_drive_link">Google Drive Link</Label>
                    <Input
                      type="url"
                      id="google_drive_link"
                      placeholder="Link to Google Drive document"
                      value={formData.google_drive_link}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => handleInputChange('google_drive_link', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="copyright_status">Copyright Status</Label>
                    <Select value={copyrightStatus} onValueChange={(value) => {
                      setCopyrightStatus(value);
                      handleInputChange('copyright_status', value);
                    }}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="©">©</SelectItem>
                        <SelectItem value="®">®</SelectItem>
                        <SelectItem value="™">™</SelectItem>
                        <SelectItem value="L">License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Photo Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Photo Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="photo_link_1">Photo Link 1</Label>
                    <Input
                      type="url"
                      id="photo_link_1"
                      placeholder="Photo URL 1"
                      value={formData.photo_link_1}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => handleInputChange('photo_link_1', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="photo_link_2">Photo Link 2</Label>
                    <Input
                      type="url"
                      id="photo_link_2"
                      placeholder="Photo URL 2"
                      value={formData.photo_link_2}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => handleInputChange('photo_link_2', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="photo_link_3">Photo Link 3</Label>
                    <Input
                      type="url"
                      id="photo_link_3"
                      placeholder="Photo URL 3"
                      value={formData.photo_link_3}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => handleInputChange('photo_link_3', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Video Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Video Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <StoryVideoUpload
                    videoUrl={formData.video_url}
                    onVideoUpload={handleVideoUpload}
                    onVideoRemove={handleVideoRemove}
                    onDurationCalculated={handleVideoDurationCalculated}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audio Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleGenerateAudio} disabled={isGeneratingAudio || !formData.id}>
                    {isGeneratingAudio
                      ? 'Generating Audio...'
                      : (formData.audio_url ? 'Regenerate Audio' : 'Generate Audio')}
                  </Button>
                  {formData.audio_url && (
                    <audio controls src={formData.audio_url} className="mt-4">
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="xl:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="default"
                    onClick={() => handleSave('save-and-clear')}
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? 'Saving...' : 'Save & Clear'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleSave('save-only')}
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? 'Saving...' : 'Save Only'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => confirmSave(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save</DialogTitle>
            <DialogDescription>
              Are you sure you want to save this story?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => confirmSave(false)}>Cancel</Button>
            <Button variant="default" onClick={() => confirmSave(true)}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SecureAdminRoute>
  );
};

export default SuperText;
