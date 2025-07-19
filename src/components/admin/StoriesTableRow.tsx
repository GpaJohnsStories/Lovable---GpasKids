
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <TableCell className="w-[120px]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div className="flex flex-col items-start gap-1">
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
      <TableCell className="w-32" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Badge 
          variant="outline" 
          className={`text-sm font-medium border ${getCategoryColor(story.category)}`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {story.category === 'System' ? 'WebText' : story.category}
        </Badge>
      </TableCell>

      {/* Published Status */}
      {showPublishedColumn && (
        <TableCell className="w-24">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePublishToggle}
              disabled={isChangingStatus}
              className={`h-6 w-6 p-0 ${
                story.published === 'Y' 
                  ? 'text-green-600 hover:text-green-700' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title={story.published === 'Y' ? 'Published - Click to unpublish' : 'Unpublished - Click to publish'}
            >
              {story.published === 'Y' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <span className="text-xs text-gray-600">
              {story.published === 'Y' ? 'Pub' : 'Draft'}
            </span>
          </div>
        </TableCell>
      )}

      {/* Stats */}
      <TableCell className="w-20" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
        <TableCell className="w-28">
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
