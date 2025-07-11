import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { adminClient } from "@/integrations/supabase/clients";
import { useQuery } from "@tanstack/react-query";
import StoriesTableHeader from "./StoriesTableHeader";
import StoriesTableRow from "./StoriesTableRow";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'published' | 'read_count' | 'thumbs_up_count' | 'updated_at';
type SortDirection = 'asc' | 'desc';
type PublishedFilter = 'all' | 'published' | 'unpublished';

interface GroupedStory extends Record<string, any> {
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
}

interface StoriesTableProps {
  onEditStory: (story: any) => void;
  showActions?: boolean;
  showPublishedOnly?: boolean;
  showPublishedColumn?: boolean;
  groupByAuthor?: boolean;
  onEditBio?: (authorName: string) => void;
}

const StoriesTable = ({ 
  onEditStory, 
  showActions = true, 
  showPublishedOnly = false,
  showPublishedColumn = true,
  groupByAuthor = false,
  onEditBio
}: StoriesTableProps) => {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [publishedFilter, setPublishedFilter] = useState<PublishedFilter>('all');

  const { data: stories, isLoading: storiesLoading, refetch } = useQuery({
    queryKey: ['admin-stories', sortField, sortDirection, showPublishedOnly, publishedFilter],
    queryFn: async () => {
      let query = adminClient
        .from('stories')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (showPublishedOnly) {
        query = query.eq('published', 'Y').not('category', 'in', '(System,STORY)');
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Filter stories based on visitor's local time for public library
        const now = new Date();
        const filteredStories = data.filter(story => {
          const storyDate = new Date(story.updated_at);
          return storyDate <= now;
        });
        
        return filteredStories;
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

  const { data: storyCounts } = useQuery({
    queryKey: ['story-counts'],
    queryFn: async () => {
      const [allResult, publishedResult, unpublishedResult] = await Promise.all([
        adminClient.from('stories').select('id', { count: 'exact', head: true }),
        adminClient.from('stories').select('id', { count: 'exact', head: true }).eq('published', 'Y'),
        adminClient.from('stories').select('id', { count: 'exact', head: true }).eq('published', 'N')
      ]);

      return {
        all: allResult.count || 0,
        published: publishedResult.count || 0,
        unpublished: unpublishedResult.count || 0
      };
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

    const { error } = await adminClient
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

  const handleStatusChange = () => {
    refetch();
  };

  // Group stories by author when needed
  const groupedStories = React.useMemo(() => {
    if (!groupByAuthor || !stories) return null;
    
    const grouped = stories.reduce((acc: Record<string, GroupedStory[]>, story) => {
      const author = story.author;
      if (!acc[author]) {
        acc[author] = [];
      }
      acc[author].push(story);
      return acc;
    }, {});
    
    // Sort stories within each author group by title
    Object.keys(grouped).forEach(author => {
      grouped[author].sort((a, b) => a.title.localeCompare(b.title));
    });
    
    return grouped;
  }, [stories, groupByAuthor]);

  return (
    <Card>
      <CardContent>
        {showActions && (
          <div className="flex gap-2 mb-4 pt-4">
            <Button
              onClick={() => setPublishedFilter('all')}
              variant={publishedFilter === 'all' ? 'default' : 'outline'}
            >
              All {storyCounts && `(${storyCounts.all})`}
            </Button>
            <Button
              onClick={() => setPublishedFilter('published')}
              variant={publishedFilter === 'published' ? 'default' : 'outline'}
            >
              Published {storyCounts && `(${storyCounts.published})`}
            </Button>
            <Button
              onClick={() => setPublishedFilter('unpublished')}
              variant={publishedFilter === 'unpublished' ? 'default' : 'outline'}
            >
              Unpublished {storyCounts && `(${storyCounts.unpublished})`}
            </Button>
          </div>
        )}
        
        <div className="relative">
          {storiesLoading ? (
            <div className="text-center py-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
              <BookOpen className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
              <p>Loading stories...</p>
            </div>
          ) : groupByAuthor && groupedStories ? (
            <div className="space-y-8">
              {Object.entries(groupedStories).sort(([a], [b]) => a.localeCompare(b)).map(([author, authorStories]) => (
                <div key={author} className="space-y-4">
                  <h3 className="text-xl font-bold text-amber-800 border-b-2 border-amber-200 pb-2 sticky top-0 bg-background z-20">
                    {author} ({authorStories.length} {authorStories.length === 1 ? 'story' : 'stories'})
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-[400px] overflow-y-auto">
                      <Table>
                        <StoriesTableHeader
                          sortField={sortField}
                          sortDirection={sortDirection}
                          onSort={handleSort}
                          showActions={showActions}
                          showPublishedColumn={showPublishedColumn}
                          hideAuthorColumn={true}
                        />
                        <TableBody>
                          {authorStories.map((story) => (
                            <StoriesTableRow
                              key={story.id}
                              story={story}
                              showActions={showActions}
                              showPublishedColumn={showPublishedColumn}
                              onEdit={onEditStory}
                              onDelete={handleDeleteStory}
                              onStatusChange={handleStatusChange}
                              hideAuthor={true}
                              onEditBio={onEditBio}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
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
                        onStatusChange={handleStatusChange}
                        onEditBio={onEditBio}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StoriesTable;
