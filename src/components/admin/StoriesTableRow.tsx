import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface Story {
  id: string;
  story_code: string;
  title: string;
  tagline?: string;
  author: string;
  category: string;
  read_count: number;
  created_at: string;
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

  return (
    <TableRow>
      <TableCell className="font-medium font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        {story.story_code}
      </TableCell>
      <TableCell className="font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <div>
          <div className="font-bold text-black">{story.title}</div>
          {story.tagline && (
            <div className="text-sm italic text-gray-600 mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {story.tagline}
            </div>
          )}
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
        {story.read_count}
      </TableCell>
      <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        {new Date(story.created_at).toLocaleDateString()}
      </TableCell>
      {showActions && (
        <TableCell>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
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
