import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Trash2, ThumbsUp, ThumbsDown, BookOpen, Calendar, Check, X, Volume2, Globe, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, parse } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { useState } from "react";
import AuthorLink from "@/components/AuthorLink";
import PublicationStatusButton from "./PublicationStatusButton";
import ColorPresetSelector from "@/components/editor/ColorPresetSelector";
import { useQuery } from "@tanstack/react-query";
// import WebTextDeploymentDialog from "./WebTextDeploymentDialog";
import { getCategoryShortName } from "@/utils/categoryUtils";


interface Story {
  id: string;
  story_code: string;
  title: string;
  tagline?: string;
  author: string;
  category: string;
  publication_status_code: number;
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
  page_path?: string;
  color_preset_id?: string;
}

interface StoriesTableRowProps {
  story: Story;
  showActions: boolean;
  showPublishedColumn?: boolean;
  categoryFilter?: string;
  onEdit: (story: Story) => void;
  onDelete: (id: string) => void;
  onStatusChange?: () => void;
  hideAuthor?: boolean;
}

const StoriesTableRow = ({ 
  story, 
  showActions, 
  showPublishedColumn = true, 
  categoryFilter,
  onEdit, 
  onDelete,
  onStatusChange,
  hideAuthor = false
}: StoriesTableRowProps) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editedDate, setEditedDate] = useState<Date | undefined>();
  const [editedTime, setEditedTime] = useState('');
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [presetPopoverOpen, setPresetPopoverOpen] = useState(false);

  // Fetch color presets for button display
  const { data: colorPresets } = useQuery({
    queryKey: ['color-presets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('color_presets')
        .select('id, name, background_color_hex, box_border_color_hex, font_color_hex')
        .order('id');
      
      if (error) throw error;
      return data;
    }
  });

  // Get current preset details
  const currentPreset = colorPresets?.find(p => p.id === story.color_preset_id);

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
        return "bg-gradient-to-b from-amber-700 to-amber-900 border-amber-900 shadow-[0_6px_12px_rgba(129,77,46,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white" + " " + `[background:linear-gradient(to_bottom,#a0722c,#814d2e)]`;
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
    // This function is no longer used - publication status is handled by status code
    console.log('Legacy published toggle - should use publication status codes instead');
  };

  const handleEditDate = () => {
    const utcDate = new Date(story.updated_at);
    setEditedDate(utcDate);
    
    // Format time for the time picker (HH:mm AM/PM)
    const hours = utcDate.getHours();
    const minutes = utcDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const formattedTime = `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
    setEditedTime(formattedTime);
    
    setIsEditingDate(true);
  };

  const handleSaveDate = async () => {
    if (!editedDate || !editedTime) {
      toast.error("Please select both date and time");
      return;
    }

    try {
      // Parse the time string (e.g., "1:30 PM")
      const timeMatch = editedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!timeMatch) {
        toast.error("Invalid time format");
        return;
      }

      let [, hours, minutes, ampm] = timeMatch;
      let hour24 = parseInt(hours);
      
      if (ampm.toUpperCase() === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (ampm.toUpperCase() === 'AM' && hour24 === 12) {
        hour24 = 0;
      }

      // Combine date and time
      const combinedDate = new Date(editedDate);
      combinedDate.setHours(hour24, parseInt(minutes), 0, 0);

      console.log('Combined date:', combinedDate);
      console.log('ISO string to store:', combinedDate.toISOString());

      const { error } = await supabase
        .from('stories')
        .update({ updated_at: combinedDate.toISOString() })
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
      toast.error("Invalid date or time format");
    }
  };

  const handleCancelDateEdit = () => {
    setIsEditingDate(false);
    setEditedDate(undefined);
    setEditedTime('');
  };

  const getNextCopyrightStatus = (currentStatus: string): string => {
    switch (currentStatus) {
      case '©': return 'L';
      case 'L': return 'O';
      case 'O': return '©';
      default: return 'L'; // Default to L if unknown
    }
  };

  const handleCycleCopyright = () => {
    const currentStatus = story.copyright_status || '©';
    const nextStatus = getNextCopyrightStatus(currentStatus);
    handleCopyrightStatusChange(nextStatus);
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

  const handleColorPresetChange = async (presetId: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .update({ color_preset_id: presetId || null })
        .eq('id', story.id);

      if (error) throw error;
      
      toast.success('Color preset updated');
      setPresetPopoverOpen(false);
      onStatusChange?.();
    } catch (error) {
      console.error('Error updating color preset:', error);
      toast.error('Failed to update color preset');
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

  const getAudioStatusIndicator = () => {
    switch (audioStatus) {
      case 'none':
        return <span className="text-xs text-red-600">No Audio</span>;
      case 'outdated':
        return <span className="text-xs text-yellow-600">Audio Outdated</span>;
      case 'current':
        return <span className="text-xs text-green-600">Audio Current</span>;
      default:
        return <span className="text-xs text-gray-500">Unknown</span>;
    }
  };

  const firstPhoto = getFirstAvailablePhoto();

  return (
    <TableRow>
      <TableCell className="p-1 text-left admin-table-cell" style={{ width: '70px', minWidth: '70px', maxWidth: '70px' }}>
        <div className="flex flex-col items-center space-y-1">
          <PublicationStatusButton 
            storyId={story.id}
            currentStatus={story.publication_status_code}
            onStatusChange={onStatusChange}
          />
          <span className="text-xs">{story.story_code}</span>
        </div>
      </TableCell>
      <TableCell className="p-1 admin-table-cell" style={{ width: '280px', minWidth: '280px', maxWidth: '280px' }}>
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
            <div className="font-bold text-black text-sm truncate">
              {story.title}
            </div>
            {story.tagline && (
              <div className="text-xs italic text-amber-700 truncate admin-table-font">
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
        <TableCell className="p-1 text-center admin-table-cell" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs">
              {categoryFilter === 'WebText' ? (story.page_path || 'No path set') : story.author}
            </span>
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
      <TableCell className="p-1 text-center admin-table-cell" style={{ width: '50px', minWidth: '50px', maxWidth: '50px' }}>
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span 
                  className={`text-xs font-bold px-2 py-1 rounded text-white cursor-pointer ${
                    (story.copyright_status || '©') === '©' ? 'bg-red-500 hover:bg-red-600' :
                    (story.copyright_status || '©') === 'O' ? 'bg-green-500 hover:bg-green-600' :
                    'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                  onClick={handleCycleCopyright}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCycleCopyright();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Change copyright status from ${story.copyright_status || '©'} to next status`}
                >
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
                  {(story.copyright_status || '©') === 'L' && (
                    <span className="text-yellow-600 font-bold">L Limited Sharing - Gpa John's Copyright</span>
                  )}
                  <div className="mt-1 text-gray-600">Click to cycle: © → L → O</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell className="p-1 text-center admin-table-cell" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
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
          {/* Audio Status - Fourth position */}
          <div className="text-center">
            {getAudioStatusIndicator()}
          </div>
        </div>
      </TableCell>
      <TableCell className="p-1 text-center admin-table-cell" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>
        <div className="flex flex-col items-center space-y-1">
          {showActions ? (
            <>
              {isEditingDate ? (
                <div className="flex flex-col items-center space-y-2 w-full">
                  {/* Date Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-44 justify-start text-left font-normal text-xs h-8",
                          !editedDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-3 w-3" />
                        {editedDate ? format(editedDate, "MMM d, yyyy") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={editedDate}
                        onSelect={setEditedDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {/* Time Picker */}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <Select value={editedTime} onValueChange={setEditedTime}>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {Array.from({ length: 24 }, (_, hour) => {
                          return Array.from({ length: 4 }, (_, quarterHour) => {
                            const minutes = quarterHour * 15;
                            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                            const ampm = hour < 12 ? 'AM' : 'PM';
                            const timeString = `${displayHour}:${String(minutes).padStart(2, '0')} ${ampm}`;
                            return (
                              <SelectItem key={`${hour}-${minutes}`} value={timeString} className="text-xs">
                                {timeString}
                              </SelectItem>
                            );
                          });
                        }).flat()}
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                  <Button
                    size="sm"
                    onClick={handleEditDate}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-1 h-6 w-6"
                  >
                    <Calendar className="h-3 w-3" />
                  </Button>
                  <span className="text-xs">{format(new Date(story.updated_at), "MMM d, yy")}</span>
                </>
              )}
              <div className="flex items-center space-x-1">
                {story.category === 'WebText' ? (
                  <div
                    className={story.publication_status_code === 0 || story.publication_status_code === 1
                      ? 'bg-gradient-to-b from-blue-500 to-blue-700 border-blue-800 text-white px-2 py-1 text-xs font-bold h-6 w-16 rounded flex items-center justify-center gap-1' 
                      : 'bg-gradient-to-b from-red-400 to-red-600 border-red-700 text-white px-2 py-1 text-xs font-bold h-6 w-16 rounded flex items-center justify-center gap-1'
                    }
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    <Globe className="h-3 w-3" />
                    <span className="text-xs font-bold">WT</span>
                  </div>
                ) : (
                  showPublishedColumn && (
                    <div
                      className={story.publication_status_code === 0 || story.publication_status_code === 1
                        ? 'bg-gradient-to-b from-green-400 to-green-600 border-green-700 text-white px-2 py-1 text-xs font-bold h-6 w-16 rounded flex items-center justify-center gap-1' 
                        : 'bg-gradient-to-b from-red-400 to-red-600 border-red-700 text-white px-2 py-1 text-xs font-bold h-6 w-16 rounded flex items-center justify-center gap-1'
                      }
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                      <BookOpen className="h-3 w-3" />
                      {story.publication_status_code === 0 || story.publication_status_code === 1 ? 'Pub' : 'UnPub'}
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <span className="text-xs">{format(new Date(story.updated_at), "MMM d, yy")}</span>
          )}
        </div>
      </TableCell>
      {showActions && (
        <TableCell className="p-1 align-top" style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between">
              <Button
                size="sm"
                className="!bg-gradient-to-b !from-green-400 !to-green-600 !text-white !border-green-700 !shadow-[0_6px_12px_rgba(34,197,94,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:!shadow-[0_8px_16px_rgba(34,197,94,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] h-7 w-10 ml-2"
                onClick={() => onEdit(story)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(story.id)}
                className="h-6 w-8"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            <Popover open={presetPopoverOpen} onOpenChange={setPresetPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className="w-full h-7 px-2 rounded-lg font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: currentPreset ? currentPreset.box_border_color_hex : '#9ca3af',
                    backgroundColor: currentPreset ? currentPreset.background_color_hex : 'rgba(156, 163, 175, 0.2)',
                    color: currentPreset ? currentPreset.font_color_hex : '#6b7280',
                  }}
                >
                  {currentPreset ? `${currentPreset.id} - ${currentPreset.name}` : 'NONE'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                <div className="p-2">
                  <ColorPresetSelector
                    value={story.color_preset_id || ''}
                    onChange={handleColorPresetChange}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

export default StoriesTableRow;
