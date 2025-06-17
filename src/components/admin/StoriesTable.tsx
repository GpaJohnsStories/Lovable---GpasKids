import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import StoriesTableHeader from "./StoriesTableHeader";
import StoriesTableRow from "./StoriesTableRow";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'published' | 'read_count' | 'thumbs_up_count' | 'created_at';
type SortDirection = 'asc' | 'desc';
type PublishedFilter = 'all' | 'published' | 'unpublished';

interface StoriesTableProps {
  onEditStory: (story: any) => void;
  showActions?: boolean;
  showPublishedOnly?: boolean;
  showPublishedColumn?: boolean;
}

const StoriesTable = ({ 
  onEditStory, 
  showActions = true, 
  showPublishedOnly = false,
  showPublishedColumn = true 
}: StoriesTableProps) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [publishedFilter, setPublishedFilter] = useState<PublishedFilter>('all');

  const { data: stories, isLoading: storiesLoading, refetch } = useQuery({
    queryKey: ['admin-stories', sortField, sortDirection, showPublishedOnly, publishedFilter],
    queryFn: async () => {
      let query = supabase
        .from('stories')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (showPublishedOnly) {
        query = query.eq('published', 'Y');
      } else if (publishedFilter === 'published') {
        query = query.eq('published', 'Y');
      } else if (publishedFilter === 'unpublished') {
        query = query.eq('published', 'N');
      }
      
      const { data, error } = await query;
      
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

  const getFilterButtonClass = (filter: PublishedFilter, isActive: boolean) => {
    const baseClass = 'filter-button-base';
    
    if (!isActive) {
      return `${baseClass} filter-button-inactive`;
    }

    switch (filter) {
      case 'all':
        return `${baseClass} filter-button-all`;
      case 'published':
        return `${baseClass} filter-button-published`;
      case 'unpublished':
        return `${baseClass} filter-button-unpublished`;
      default:
        return `${baseClass} filter-button-inactive`;
    }
  };

  return (
    <Card>
      <CardContent>
        {showActions && (
          <div className="flex gap-2 mb-4 pt-4">
            <button
              onClick={() => setPublishedFilter('all')}
              className={getFilterButtonClass('all', publishedFilter === 'all')}
            >
              All
            </button>
            <button
              onClick={() => setPublishedFilter('published')}
              className={getFilterButtonClass('published', publishedFilter === 'published')}
            >
              Published
            </button>
            <button
              onClick={() => setPublishedFilter('unpublished')}
              className={getFilterButtonClass('unpublished', publishedFilter === 'unpublished')}
            >
              Unpublished
            </button>
          </div>
        )}
        
        {storiesLoading ? (
          <div className="text-center py-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
            <BookOpen className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p>Loading stories...</p>
          </div>
        ) : (
          <Table>
            <StoriesTableHeader
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              showActions={showActions}
              showPublishedColumn={showPublishedColumn}
            />
            <TableBody>
              {stories?.map((story) => (
                <StoriesTableRow
                  key={story.id}
                  story={story}
                  showActions={showActions}
                  showPublishedColumn={showPublishedColumn}
                  onEdit={onEditStory}
                  onDelete={handleDeleteStory}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default StoriesTable;
