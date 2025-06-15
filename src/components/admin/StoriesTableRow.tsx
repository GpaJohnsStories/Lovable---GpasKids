
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ThumbsUp, ThumbsDown, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface Story {
  id: string;
  story_code: string;
  title: string;
  tagline?: string;
  author: string;
  category: string;
  read_count: number;
  thumbs_up_count?: number;
  thumbs_down_count?: number;
  ok_count?: number;
  created_at: string;
  photo_link_1?: string;
  photo_link_2?: string;
  photo_link_3?: string;
}

interface StoriesTableRowProps {
  story: Story;
  showActions: boolean;
  onEdit: (story: Story) => void;
  onDelete: (id: string) => void;
}

const StoriesTableRow = ({ story, showActions, onEdit, onDelete }: StoriesTableRowProps) => {
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
              <div className="text-sm italic text-gray-600 mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {story.tagline}
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
      <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <div className="space-y-1">
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
        {new Date(story.created_at).toLocaleDateString()}
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
