
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Edit, 
  Trash2, 
  User, 
  Eye, 
  EyeOff, 
  ThumbsUp, 
  BarChart3,
  Calendar,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CopyrightColorKey from "./CopyrightColorKey";

interface Story {
  id: string;
  story_code: string;
  title: string;
  author: string;
  category: string;
  published: string;
  read_count: number;
  thumbs_up_count: number;
  updated_at: string;
  created_at: string;
  content?: string;
  tagline?: string;
  excerpt?: string;
  copyright_status?: string;
}

interface StoriesTableRowProps {
  story: Story;
  showActions: boolean;
  showPublishedColumn: boolean;
  onEdit: (story: Story) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
  hideAuthor?: boolean;
  onEditBio?: (authorName: string) => void;
}

const StoriesTableRow: React.FC<StoriesTableRowProps> = ({
  story,
  showActions,
  showPublishedColumn,
  onEdit,
  onDelete,
  onStatusChange,
  hideAuthor = false,
  onEditBio
}) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const handlePublishToggle = async () => {
    setIsChangingStatus(true);
    
    try {
      const newStatus = story.published === 'Y' ? 'N' : 'Y';
      
      const { error } = await supabase
        .from('stories')
        .update({ published: newStatus })
        .eq('id', story.id);

      if (error) throw error;

      toast.success(`Story ${newStatus === 'Y' ? 'published' : 'unpublished'} successfully`);
      onStatusChange();
    } catch (error) {
      console.error('Error updating story status:', error);
      toast.error('Failed to update story status');
    } finally {
      setIsChangingStatus(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Fun': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Life': return 'bg-green-100 text-green-800 border-green-300';
      case 'North Pole': return 'bg-blue-100 text-blue-800 border-blue-300';  
      case 'World Changers': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'WebText': 
      case 'System': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isWebText = story.category === 'WebText' || story.category === 'System';

  return (
    <TableRow className="hover:bg-muted/50">
      {/* Story Code */}
      <TableCell className="text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', width: '80px', minWidth: '80px', maxWidth: '80px' }}>
        <span className="font-bold text-xs">{story.story_code}</span>
      </TableCell>

      {/* Title */}
      <TableCell className="w-[220px]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div className="space-y-1">
          <div className="font-bold text-black hover:text-orange-600 transition-colors cursor-pointer text-sm">
            {story.title}
          </div>
          {(story.tagline || story.excerpt) && (
            <div className="text-sm text-gray-600 line-clamp-1">
              {story.tagline || story.excerpt}
            </div>
          )}
        </div>
      </TableCell>

      {/* Author */}
      {!hideAuthor && (
        <TableCell className="w-[120px] text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-gray-700">{story.author}</span>
            {/* Show Bio button if author has a bio - placeholder for now */}
            {story.author === 'Grandpa John' && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs font-bold bg-orange-100 text-orange-800 border-2 border-orange-300 hover:bg-orange-200"
                onClick={() => {
                  // TODO: Navigate to author bio or show bio modal
                  console.log(`Show bio for ${story.author}`);
                }}
              >
                Bio
              </Button>
            )}
          </div>
        </TableCell>
      )}

      {/* Category */}
      <TableCell className="w-32 text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Badge 
          variant="outline" 
          className={`text-sm font-medium border ${getCategoryColor(story.category)}`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {story.category === 'System' ? 'WebText' : story.category}
        </Badge>
      </TableCell>

      {/* Copyright */}
      <TableCell className="text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', width: '50px', minWidth: '50px', maxWidth: '50px' }}>
        <Popover>
          <PopoverTrigger asChild>
            <div 
              className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-white font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity ${
                story.copyright_status === '©' ? 'bg-red-500' :
                story.copyright_status === 'O' ? 'bg-green-500' :
                story.copyright_status === 'S' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              title="Click to see copyright color key"
            >
              {story.copyright_status || '©'}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CopyrightColorKey />
          </PopoverContent>
        </Popover>
      </TableCell>


      {/* Stats */}
      <TableCell className="w-20 text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            <span>{story.read_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            <span>{story.thumbs_up_count}</span>
          </div>
        </div>
      </TableCell>

      {/* Updated */}
      <TableCell className="text-center text-sm text-gray-700" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', width: '80px', minWidth: '80px', maxWidth: '80px' }}>
        {formatDate(story.updated_at)}
      </TableCell>

      {/* Actions */}
      {showActions && (
        <TableCell className="w-28 text-center">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(story)}
              className="h-7 w-7 p-0"
              title={isWebText ? "Edit WebText content" : "Edit story"}
            >
              <Edit className="h-3 w-3" />
            </Button>
            
            {/* WebText stories are managed directly like regular stories now */}
            {isWebText && (
              <div className="flex items-center">
                <FileText className="h-3 w-3 text-blue-500 ml-1" />
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(story.id)}
              className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
              title="Delete story"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

export default StoriesTableRow;
