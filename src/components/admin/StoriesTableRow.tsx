
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ThumbsUp, ThumbsDown, BookOpen, Calendar, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateReadingTime } from "@/utils/readingTimeUtils";
import { useState } from "react";

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
  created_at: string;
  updated_at: string;
  photo_link_1?: string;
  photo_link_2?: string;
  photo_link_3?: string;
  content?: string;
  excerpt?: string;
}

interface StoriesTableRowProps {
  story: Story;
  showActions: boolean;
  showPublishedColumn?: boolean;
  onEdit: (story: Story) => void;
  onDelete: (id: string) => void;
  onStatusChange?: () => void;
}

const StoriesTableRow = ({ 
  story, 
  showActions, 
  showPublishedColumn = true, 
  onEdit, 
  onDelete,
  onStatusChange
}: StoriesTableRowProps) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editedDate, setEditedDate] = useState('');

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Fun":
        return "bg-blue-500";
      case "Life":
        return "bg-green-500";
      case "North Pole":
        return "bg-red-600";
      case "World Changers":
        return "bg-amber-400 text-amber-900";
      default:
        return "bg-amber-200 text-amber-800";
    }
  };

  const getFirstAvailablePhoto = () => {
    return story.photo_link_1 || story.photo_link_2 || story.photo_link_3;
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
    // Parse the stored UTC date and format it for datetime-local input
    // We want to show the exact UTC values in the input (no timezone conversion)
    const utcDate = new Date(story.updated_at);
    const year = utcDate.getUTCFullYear();
    const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getUTCDate()).padStart(2, '0');
    const hours = String(utcDate.getUTCHours()).padStart(2, '0');
    const minutes = String(utcDate.getUTCMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    setEditedDate(formattedDate);
    setIsEditingDate(true);
  };

  const handleSaveDate = async () => {
    if (!editedDate) {
      toast.error("Please enter a valid date");
      return;
    }

    // Parse the datetime-local input value and create a proper ISO string
    // The input gives us "YYYY-MM-DDTHH:mm" format
    // We need to treat this as the user's intended local time and store it as UTC
    const [datePart, timePart] = editedDate.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    
    // Create date in UTC with the exact values the user entered
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));

    console.log('User entered:', editedDate);
    console.log('Storing as UTC:', utcDate.toISOString());

    const { error } = await supabase
      .from('stories')
      .update({ updated_at: utcDate.toISOString() })
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
  };

  const handleCancelDateEdit = () => {
    setIsEditingDate(false);
    setEditedDate('');
  };

  const firstPhoto = getFirstAvailablePhoto();

  return (
    <TableRow>
      <TableCell className="font-medium font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        {story.story_code}
      </TableCell>
      <TableCell className="font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <div className="flex items-center space-x-3">
          {firstPhoto && (
            <div className="flex-shrink-0">
              <img 
                src={firstPhoto} 
                alt={`${story.title} thumbnail`}
                className="w-12 h-12 object-cover rounded border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <Link to={`/story/${story.id}`}>
              <div className="font-bold text-black hover:text-orange-600 transition-colors cursor-pointer">{story.title}</div>
            </Link>
            {story.tagline && (
              <div className="text-sm italic text-amber-700 mt-1 font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {story.tagline}
              </div>
            )}
            {story.excerpt && (
              <div className="text-xs text-gray-600 mt-1 line-clamp-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {story.excerpt}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        {story.author}
      </TableCell>
      <TableCell>
        <Badge className={`${getCategoryBadgeColor(story.category)} text-center flex items-center justify-center`}>
          {story.category}
        </Badge>
      </TableCell>
      {showPublishedColumn && (
        <TableCell className="text-center">
          <Button
            size="sm"
            onClick={handleTogglePublished}
            className={story.published === 'Y' 
              ? 'bg-gradient-to-b from-green-400 to-green-600 border-green-700 text-white px-3 py-1 text-xs font-bold hover:bg-gradient-to-b hover:from-green-500 hover:to-green-700 cursor-pointer' 
              : 'bg-gradient-to-b from-red-400 to-red-600 border-red-700 text-white px-3 py-1 text-xs font-bold hover:bg-gradient-to-b hover:from-red-500 hover:to-red-700 cursor-pointer'
            }
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {story.published}
          </Button>
        </TableCell>
      )}
      <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <div className="space-y-1">
          <div className="text-xs text-amber-600 mb-1">{calculateReadingTime(story.content || story.excerpt || '')}</div>
          <div className="flex items-center space-x-1 text-blue-600">
            <BookOpen className="h-3 w-3" />
            <span className="text-xs font-medium">{story.read_count}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-green-600">
              <ThumbsUp className="h-3 w-3" />
              <span className="text-xs">{story.thumbs_up_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-600">
              <span className="text-xs">👌</span>
              <span className="text-xs">{story.ok_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-red-600">
              <ThumbsDown className="h-3 w-3" />
              <span className="text-xs">{story.thumbs_down_count || 0}</span>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        {isEditingDate ? (
          <div className="flex items-center space-x-2">
            <input
              type="datetime-local"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
              className="text-xs border rounded px-1 py-1"
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
          <div className="flex items-center space-x-2">
            <span>{new Date(story.updated_at).toLocaleDateString()}</span>
            <Button
              size="sm"
              onClick={handleEditDate}
              className="bg-blue-600 hover:bg-blue-700 text-white p-1 h-6 w-6"
            >
              <Calendar className="h-3 w-3" />
            </Button>
          </div>
        )}
      </TableCell>
      {showActions && (
        <TableCell>
          <div className="flex space-x-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onEdit(story)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(story.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

export default StoriesTableRow;
