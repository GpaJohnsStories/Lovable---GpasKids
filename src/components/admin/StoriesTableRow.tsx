import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Trash2, ThumbsUp, ThumbsDown, BookOpen, Calendar, Check, X, Volume2, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

import { useState } from "react";
import AuthorLink from "@/components/AuthorLink";
// import WebTextDeploymentDialog from "./WebTextDeploymentDialog";
import { getCategoryShortName } from "@/utils/categoryUtils";

interface Story {
  id: string;
  story_code: string;
  title: string;
  tagline?: string;
  author: string;
  category: string;
  published: string;
  read_count: number;
  thumbs_up_count?: number;
  thumbs_down_count?: number;
  ok_count?: number;
  reading_time_minutes?: number;
  created_at: string;
  updated_at: string;
  photo_link_1?: string;
  photo_link_2?: string;
  photo_link_3?: string;
  content?: string;
  excerpt?: string;
  video_url?: string;
  audio_url?: string;
  audio_generated_at?: string;
  audio_segments?: number;
  audio_duration_seconds?: number;
  ai_voice_name?: string;
  ai_voice_model?: string;
  copyright_status?: string;
}

interface StoriesTableRowProps {
  story: Story;
  showActions: boolean;
  showPublishedColumn?: boolean;
  onEdit: (story: Story) => void;
  onDelete: (id: string) => void;
  onStatusChange?: () => void;
  hideAuthor?: boolean;
  onEditBio?: (authorName: string) => void;
}

const StoriesTableRow = ({ 
  story, 
  showActions, 
  showPublishedColumn = true, 
  onEdit, 
  onDelete,
  onStatusChange,
  hideAuthor = false,
  onEditBio
}: StoriesTableRowProps) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editedDate, setEditedDate] = useState('');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(story.ai_voice_name || 'Nova');
  const [showDeployDialog, setShowDeployDialog] = useState(false);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Fun":
        return "bg-gradient-to-b from-blue-400 to-blue-600 border-blue-700 shadow-[0_6px_12px_rgba(37,99,235,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "Life":
        return "bg-gradient-to-b from-green-400 to-green-600 border-green-700 shadow-[0_6px_12px_rgba(34,197,94,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "North Pole":
        return "bg-gradient-to-b from-red-400 to-red-600 border-red-700 shadow-[0_6px_12px_rgba(239,68,68,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "World Changers":
        return "bg-gradient-to-b from-amber-400 to-amber-600 border-amber-700 shadow-[0_6px_12px_rgba(245,158,11,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-amber-900";
      case "WebText":
        return "bg-gradient-to-b from-purple-400 to-purple-600 border-purple-700 shadow-[0_6px_12px_rgba(147,51,234,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      default:
        return "bg-gradient-to-b from-gray-400 to-gray-600 border-gray-700 shadow-[0_6px_12px_rgba(75,85,99,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
    }
  };

  const getFirstAvailablePhoto = () => {
    return story.photo_link_1 || story.photo_link_2 || story.photo_link_3;
  };

  const hasVideo = story.video_url && story.video_url.trim() !== '';
  const videoIndicator = hasVideo ? '🎥' : '';

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleTogglePublished = async () => {
    const newStatus = story.published === 'Y' ? 'N' : 'Y';
    
    const { error } = await supabase
      .from('stories')
      .update({ published: newStatus })
      .eq('id', story.id);

    if (error) {
      toast.error("Error updating story status");
      console.error(error);
    } else {
      toast.success(`Story ${newStatus === 'Y' ? 'published' : 'unpublished'} successfully`);
      if (onStatusChange) {
        onStatusChange();
      }
    }
  };

  const handleEditDate = () => {
    // Convert the stored UTC date to local datetime-local format
    const utcDate = new Date(story.updated_at);
    
    // Format for datetime-local input (YYYY-MM-DDTHH:mm)
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    console.log('Original UTC date:', story.updated_at);
    console.log('Formatted for input:', formattedDate);
    
    setEditedDate(formattedDate);
    setIsEditingDate(true);
  };

  const handleSaveDate = async () => {
    if (!editedDate) {
      toast.error("Please enter a valid date");
      return;
    }

    try {
      // Create a proper Date object from the datetime-local input
      const inputDate = new Date(editedDate);
      
      // Check if the date is valid
      if (isNaN(inputDate.getTime())) {
        toast.error("Invalid date format");
        return;
      }

      console.log('User entered:', editedDate);
      console.log('Parsed date:', inputDate);
      console.log('ISO string to store:', inputDate.toISOString());

      const { error } = await supabase
        .from('stories')
        .update({ updated_at: inputDate.toISOString() })
        .eq('id', story.id);

      if (error) {
        toast.error("Error updating date");
        console.error(error);
      } else {
        toast.success("Updated date saved successfully");
        setIsEditingDate(false);
        if (onStatusChange) {
          onStatusChange();
        }
      }
    } catch (error) {
      console.error('Date parsing error:', error);
      toast.error("Invalid date format");
    }
  };

  const handleCancelDateEdit = () => {
    setIsEditingDate(false);
    setEditedDate('');
  };

  const handleVoiceChange = async (newVoice: string) => {
    setSelectedVoice(newVoice);
    
    // Update the story record with the selected voice
    const { error } = await supabase
      .from('stories')
      .update({ 
        ai_voice_name: newVoice,
        ai_voice_model: 'tts-1'
      } as any)
      .eq('id', story.id);

    if (error) {
      toast.error("Error updating voice selection");
      console.error(error);
    } else {
      toast.success(`Voice updated to ${newVoice}`);
      if (onStatusChange) {
        onStatusChange();
      }
    }
  };

  const handleCopyrightStatusChange = async (newStatus: string) => {
    const { error } = await supabase
      .from('stories')
      .update({ copyright_status: newStatus })
      .eq('id', story.id);

    if (error) {
      toast.error("Error updating copyright status");
      console.error(error);
    } else {
      const statusText = newStatus === '©' ? 'Full Copyright' : 
                        newStatus === 'O' ? 'Open, No Copyright' : 
                        'Limited Sharing, Gpa John\'s Copyright';
      toast.success(`Copyright status updated to ${statusText}`);
      if (onStatusChange) {
        onStatusChange();
      }
    }
  };

  // Determine audio status based on timestamps
  const getAudioStatus = () => {
    if (!story.audio_url || !story.audio_generated_at) {
      return 'none'; // No audio generated yet
    }
    
    const storyUpdated = new Date(story.updated_at);
    const audioGenerated = new Date(story.audio_generated_at);
    
    if (storyUpdated > audioGenerated) {
      return 'outdated'; // Story updated after audio was generated
    }
    
    return 'current'; // Audio is up to date
  };

  const audioStatus = getAudioStatus();

  const getAudioButtonClasses = () => {
    switch (audioStatus) {
      case 'none':
        return '!bg-gradient-to-b !from-red-400 !to-red-600 !text-white !border-red-700'; // Red for no audio
      case 'outdated':
        return '!bg-gradient-to-b !from-yellow-400 !to-yellow-600 !text-white !border-yellow-700'; // Yellow for outdated
      case 'current':
        return '!bg-gradient-to-b !from-green-400 !to-green-600 !text-white !border-green-700'; // Green for current
      default:
        return '!bg-gradient-to-b !from-red-400 !to-red-600 !text-white !border-red-700';
    }
  };

  const getAudioButtonTitle = () => {
    switch (audioStatus) {
      case 'none':
        return 'Generate audio';
      case 'outdated':
        return 'Story updated - regenerate audio';
      case 'current':
        return 'Audio up to date - regenerate if needed';
      default:
        return 'Generate audio';
    }
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    
    try {
      toast.loading(`Generating audio for "${story.title}" with ${selectedVoice} voice...`, {
        id: `audio-${story.id}`,
        duration: 60000, // Show for up to 1 minute
      });

      console.log('🎵 Calling generate-story-audio function with storyId:', story.id);
      const { data, error } = await supabase.functions.invoke('generate-story-audio', {
        body: { storyId: story.id }
      });
      console.log('🎵 Function response:', { data, error });

      if (error) {
        console.error('❌ Audio generation error:', error);
        toast.error(`Failed to generate audio: ${error.message}`, {
          id: `audio-${story.id}`,
        });
        return;
      }

      if (data?.success) {
        toast.success(data.message || `Audio generated for "${story.title}"!`, {
          id: `audio-${story.id}`,
        });
        
        // Refresh the data to show updated audio status
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        toast.error(data?.error || 'Failed to generate audio', {
          id: `audio-${story.id}`,
        });
      }
    } catch (error) {
      console.error('❌ Audio generation error:', error);
      toast.error('Failed to generate audio', {
        id: `audio-${story.id}`,
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const firstPhoto = getFirstAvailablePhoto();

  return (
    <TableRow>
      <TableCell className="p-1 text-left" style={{ width: '80px', minWidth: '80px', maxWidth: '80px', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <span className="text-xs font-bold">{story.story_code}</span>
      </TableCell>
      <TableCell className="p-1" style={{ width: '280px', minWidth: '280px', maxWidth: '280px', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <div className="flex items-center space-x-2">
          {firstPhoto && (
            <div className="flex-shrink-0">
              <img 
                src={firstPhoto} 
                alt={`${story.title} thumbnail`}
                className="w-10 h-10 object-cover rounded border border-gray-400"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Link to={`/story/${story.id}`} onClick={scrollToTop}>
              <div className="font-bold text-black hover:text-orange-600 transition-colors cursor-pointer text-sm truncate">
                {story.title}
              </div>
            </Link>
            {story.tagline && (
              <div className="text-xs italic text-amber-700 truncate" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {hasVideo && story.tagline.toUpperCase().includes('VIDEO') ? (
                  <>🎥 {story.tagline}</>
                ) : (
                  story.tagline
                )}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      {!hideAuthor && (
        <TableCell className="p-1 text-center" style={{ width: '100px', minWidth: '100px', maxWidth: '100px', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs">{story.author}</span>
            {onEditBio && (
              <div 
                className="inline-flex items-center h-auto py-1 px-2 text-xs border-2 border-amber-300 bg-white text-amber-700 hover:bg-amber-50 rounded-md cursor-pointer transition-colors font-bold shadow-sm hover:shadow-md"
                onClick={() => onEditBio(story.author)}
                title={`${showActions ? 'Edit' : 'View'} ${story.author}'s biography`}
              >
                Bio
              </div>
            )}
          </div>
        </TableCell>
      )}
      <TableCell className="p-1 text-center" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
        <div className="flex justify-center">
          <Badge className={`${getCategoryBadgeColor(story.category)} text-xs rounded-none w-full text-center flex items-center justify-center`}>
            {getCategoryShortName(story.category)}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="p-1 text-center" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <div className="flex justify-center">
          {showActions ? (
            <Select 
              value={story.copyright_status || '©'} 
              onValueChange={handleCopyrightStatusChange}
            >
              <SelectTrigger className={`w-full h-8 text-xs text-white font-bold border ${
                (story.copyright_status || '©') === '©' ? 'bg-red-500 hover:bg-red-600 border-red-600' :
                (story.copyright_status || '©') === 'O' ? 'bg-green-500 hover:bg-green-600 border-green-600' :
                'bg-yellow-500 hover:bg-yellow-600 border-yellow-600'
              }`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white border shadow-lg">
                <SelectItem value="©" className="text-xs text-red-600 font-bold">© Full Copyright</SelectItem>
                <SelectItem value="O" className="text-xs text-green-600 font-bold">O Open, No Copyright</SelectItem>
                <SelectItem value="S" className="text-xs text-yellow-600 font-bold">S Limited Sharing</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`text-xs font-bold px-2 py-1 rounded text-white cursor-help ${
                    (story.copyright_status || '©') === '©' ? 'bg-red-500' :
                    (story.copyright_status || '©') === 'O' ? 'bg-green-500' :
                    'bg-yellow-500'
                  }`}>
                    {story.copyright_status || '©'}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-300 shadow-lg p-2 z-50">
                  <div className="text-xs font-medium text-gray-800">
                    {(story.copyright_status || '©') === '©' && (
                      <span className="text-red-600 font-bold">© Full Copyright - All rights reserved</span>
                    )}
                    {(story.copyright_status || '©') === 'O' && (
                      <span className="text-green-600 font-bold">O Open, No Copyright - Free to share</span>
                    )}
                    {(story.copyright_status || '©') === 'S' && (
                      <span className="text-yellow-600 font-bold">S Limited Sharing - Gpa John's Copyright</span>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
      <TableCell className="p-1 text-center" style={{ width: '100px', minWidth: '100px', maxWidth: '100px', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <div className="space-y-1">
          {/* Votes - First position */}
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-1 text-green-600">
              <ThumbsUp className="h-3 w-3 font-bold" />
              <span className="text-xs font-bold">{story.thumbs_up_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-600">
              <span className="text-xs font-bold">👌</span>
              <span className="text-xs font-bold">{story.ok_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-red-600">
              <ThumbsDown className="h-3 w-3 font-bold" />
              <span className="text-xs font-bold">{story.thumbs_down_count || 0}</span>
            </div>
          </div>
          {/* Readers - Second position */}
          <div className="text-xs text-blue-600 font-bold text-center">
            {story.read_count} Readers
          </div>
          {/* Time - Third position (using database value) */}
          <div className="text-xs text-black font-bold">
            About {story.reading_time_minutes || 1} Min
          </div>
        </div>
      </TableCell>
      <TableCell className="p-1 text-center" style={{ width: '80px', minWidth: '80px', maxWidth: '80px', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <div className="flex flex-col items-center space-y-1">
          {showActions ? (
            <>
              {isEditingDate ? (
                <div className="flex items-center space-x-1">
                  <input
                    type="datetime-local"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                    className="text-xs border rounded px-1 py-1 w-full"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  />
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      onClick={handleSaveDate}
                      className="bg-green-600 hover:bg-green-700 text-white p-1 h-6 w-6"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCancelDateEdit}
                      className="bg-red-600 hover:bg-red-700 text-white p-1 h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xs">{format(new Date(story.updated_at), "MMM d, yy")}</span>
                    <Button
                      size="sm"
                      onClick={handleEditDate}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1 h-6 w-6"
                    >
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-1">
                    {story.category === 'WebText' ? (
                      <Button
                        size="sm"
                        className={story.published === 'Y' 
                          ? 'bg-gradient-to-b from-blue-500 to-blue-700 border-blue-800 text-white px-2 py-1 text-xs font-bold hover:bg-gradient-to-b hover:from-blue-600 hover:to-blue-800 cursor-pointer h-6 w-16 rounded-full flex items-center justify-center gap-1' 
                          : 'bg-gradient-to-b from-red-400 to-red-600 border-red-700 text-white px-2 py-1 text-xs font-bold hover:bg-gradient-to-b hover:from-red-500 hover:to-red-700 cursor-pointer h-6 w-16 rounded-full flex items-center justify-center gap-1'
                        }
                        onClick={() => setShowDeployDialog(true)}
                        title="Deploy this WebText to web page"
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                      >
                        <Globe className="h-3 w-3" />
                        <span className="text-xs font-bold">WT</span>
                      </Button>
                    ) : (
                      showPublishedColumn && (
                        <Button
                          size="sm"
                          onClick={handleTogglePublished}
                          className={story.published === 'Y' 
                            ? 'bg-gradient-to-b from-green-400 to-green-600 border-green-700 text-white px-2 py-1 text-xs font-bold hover:bg-gradient-to-b hover:from-green-500 hover:to-green-700 cursor-pointer h-6 w-12 rounded-full' 
                            : 'bg-gradient-to-b from-red-400 to-red-600 border-red-700 text-white px-2 py-1 text-xs font-bold hover:bg-gradient-to-b hover:from-red-500 hover:to-red-700 cursor-pointer h-6 w-12 rounded-full'
                          }
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          Pub
                        </Button>
                      )
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="text-xs">{format(new Date(story.updated_at), "MMM d, yy")}</span>
          )}
        </div>
      </TableCell>
      {showActions && (
        <TableCell className="p-1" style={{ width: '170px', minWidth: '170px', maxWidth: '170px' }}>
          <div className="flex flex-col space-y-1">
            <div className="flex space-x-1 items-center">
              <Button
                size="sm"
                className="!bg-gradient-to-b !from-green-400 !to-green-600 !text-white !border-green-700 !shadow-[0_6px_12px_rgba(34,197,94,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:!shadow-[0_8px_16px_rgba(34,197,94,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] h-6 w-8"
                onClick={() => onEdit(story)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                <SelectTrigger className="w-24 h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nova">Nova</SelectItem>
                  <SelectItem value="Alloy">Alloy</SelectItem>
                  <SelectItem value="Echo">Echo</SelectItem>
                  <SelectItem value="Fable">Fable</SelectItem>
                  <SelectItem value="Onyx">Onyx</SelectItem>
                  <SelectItem value="Shimmer">Shimmer</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(story.id)}
                className="h-6 w-8"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex">
              <div className="w-8"></div> {/* Space for edit button */}
              <div className="w-1"></div> {/* Space for gap */}
              <div className="w-24 flex justify-center"> {/* Align with voice dropdown width */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        className={`${getAudioButtonClasses()} !shadow-[0_6px_12px_rgba(147,51,234,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:!shadow-[0_8px_16px_rgba(147,51,234,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] w-24 h-6 text-xs`}
                        onClick={handleGenerateAudio}
                        disabled={isGeneratingAudio}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700 max-w-xs">
                      <div className="text-sm font-medium">
                        {getAudioButtonTitle()}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        {audioStatus === 'none' && 'Click to create audio narration'}
                        {audioStatus === 'outdated' && 'Story content has changed since audio was generated'}
                        {audioStatus === 'current' && 'Audio is synchronized with current story content'}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

export default StoriesTableRow;
