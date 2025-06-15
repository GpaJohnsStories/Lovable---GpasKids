import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trash2, Edit, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'read_count' | 'created_at';
type SortDirection = 'asc' | 'desc';

interface StoriesTableProps {
  onEditStory: (story: any) => void;
  showActions?: boolean;
}

const StoriesTable = ({ onEditStory, showActions = true }: StoriesTableProps) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: stories, isLoading: storiesLoading, refetch } = useQuery({
    queryKey: ['admin-stories', sortField, sortDirection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (error) throw error;
      return data;
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getButtonColor = (field: SortField) => {
    switch (field) {
      case 'story_code':
        return 'bg-cyan-500 hover:bg-cyan-600 text-white';
      case 'title':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'author':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'category':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'read_count':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'created_at':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Error deleting story");
      console.error(error);
    } else {
      toast.success("Story deleted successfully");
      refetch();
    }
  };

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
    <Card>
      <CardHeader>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="text-gray-700 italic" style={{ fontFamily: "'Segoe Print', cursive, sans-serif" }}>
            <p className="mb-3">
              Click on any column heading to sort the library by that column. The first click will always sort down and the next click will sort up.
            </p>
            <p>
              As more stories are loaded, you may want to keep a note on your device or even use pencil and paper to record the Story Code so you can find it easily in the future.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {storiesLoading ? (
          <div className="text-center py-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
            <BookOpen className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p>Loading stories...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-2">
                  <Button
                    onClick={() => handleSort('story_code')}
                    className={`${getButtonColor('story_code')} w-full justify-between`}
                    size="sm"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Code
                    {getSortIcon('story_code')}
                  </Button>
                </TableHead>
                <TableHead className="p-2">
                  <Button
                    onClick={() => handleSort('title')}
                    className={`${getButtonColor('title')} w-full justify-between`}
                    size="sm"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Title
                    {getSortIcon('title')}
                  </Button>
                </TableHead>
                <TableHead className="p-2">
                  <Button
                    onClick={() => handleSort('author')}
                    className={`${getButtonColor('author')} w-full justify-between`}
                    size="sm"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Author
                    {getSortIcon('author')}
                  </Button>
                </TableHead>
                <TableHead className="p-2">
                  <Button
                    onClick={() => handleSort('category')}
                    className={`${getButtonColor('category')} w-full justify-between`}
                    size="sm"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Category
                    {getSortIcon('category')}
                  </Button>
                </TableHead>
                <TableHead className="p-2">
                  <Button
                    onClick={() => handleSort('read_count')}
                    className={`${getButtonColor('read_count')} w-full justify-between`}
                    size="sm"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Read Count
                    {getSortIcon('read_count')}
                  </Button>
                </TableHead>
                <TableHead className="p-2">
                  <Button
                    onClick={() => handleSort('created_at')}
                    className={`${getButtonColor('created_at')} w-full justify-between`}
                    size="sm"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Created
                    {getSortIcon('created_at')}
                  </Button>
                </TableHead>
                {showActions && (
                  <TableHead style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stories?.map((story) => (
                <TableRow key={story.id}>
                  <TableCell className="font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>{story.story_code}</TableCell>
                  <TableCell className="font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>{story.title}</TableCell>
                  <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>{story.author}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryBadgeColor(story.category)}>
                      {story.category}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>{story.read_count}</TableCell>
                  <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
                    {new Date(story.created_at).toLocaleDateString()}
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditStory(story)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteStory(story.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default StoriesTable;
