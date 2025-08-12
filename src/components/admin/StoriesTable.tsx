import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import StoriesTableHeader from "./StoriesTableHeader";
import StoriesTableRow from "./StoriesTableRow";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'published' | 'read_count' | 'thumbs_up_count' | 'thumbs_down_count' | 'ok_count' | 'reading_time_minutes' | 'updated_at';
type SortDirection = 'asc' | 'desc';
type PublishedFilter = 'all' | 'published' | 'unpublished';
type CategoryFilter = 'all' | 'Fun' | 'Life' | 'North Pole' | 'World Changers' | 'WebText';

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
  onToggleGroupByAuthor?: () => void;
  onEditBio?: (authorName: string) => void;
}

const StoriesTable = ({ 
  onEditStory, 
  showActions = true, 
  showPublishedOnly = false,
  showPublishedColumn = true,
  groupByAuthor = false,
  onToggleGroupByAuthor,
  onEditBio
}: StoriesTableProps) => {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [publishedFilter, setPublishedFilter] = useState<PublishedFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const { data: stories, isLoading: storiesLoading, refetch } = useQuery({
    queryKey: ['admin-stories', sortField, sortDirection, showPublishedOnly, publishedFilter, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('stories')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (showPublishedOnly) {
        query = query.eq('published', 'Y').not('category', 'eq', 'WebText');
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Filter stories based on visitor's local time for public library
        const now = new Date();
        let filteredStories = data.filter(story => {
          const storyDate = new Date(story.updated_at);
          return storyDate <= now;
        });
        
        // Apply category filter for public library
        if (categoryFilter !== 'all') {
          filteredStories = filteredStories.filter(story => story.category === categoryFilter);
        }
        
        return filteredStories;
      } else {
        if (publishedFilter === 'published') {
          query = query.eq('published', 'Y');
        } else if (publishedFilter === 'unpublished') {
          query = query.eq('published', 'N');
        }
        
        // Apply category filter for admin view
        if (categoryFilter !== 'all') {
          query = query.eq('category', categoryFilter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
      }
    },
  });

  const handleSort = (field: SortField) => {
    // Exit group by author view when sorting by other fields
    if (groupByAuthor && field !== 'author' && onToggleGroupByAuthor) {
      onToggleGroupByAuthor();
    }
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatsSort = (field: SortField, direction: SortDirection) => {
    // Exit group by author view when sorting by other fields
    if (groupByAuthor && field !== 'author' && onToggleGroupByAuthor) {
      onToggleGroupByAuthor();
    }
    
    setSortField(field);
    setSortDirection(direction);
  };

  const handleCategoryFilter = (filter: CategoryFilter) => {
    setCategoryFilter(filter);
    // Exit group by author view when filtering
    if (groupByAuthor && onToggleGroupByAuthor) {
      onToggleGroupByAuthor();
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
        
        <div className="relative">
          {storiesLoading ? (
            <div className="text-center py-8 text-black-system">
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
                          onStatsSort={handleStatsSort}
                          showActions={showActions}
                          showPublishedColumn={showPublishedColumn}
                          hideAuthorColumn={true}
                          groupByAuthor={groupByAuthor}
                          onToggleGroupByAuthor={onToggleGroupByAuthor}
                          categoryFilter={categoryFilter}
                          onCategoryFilter={handleCategoryFilter}
                          showPublishedOnly={showPublishedOnly}
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
              {/* Fixed header outside scrollable area */}
              <div className="border-b bg-background">
                <Table className="table-fixed w-full">
                  <StoriesTableHeader
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onStatsSort={handleStatsSort}
                    showActions={showActions}
                    showPublishedColumn={showPublishedColumn}
                    groupByAuthor={groupByAuthor}
                    onToggleGroupByAuthor={onToggleGroupByAuthor}
                    categoryFilter={categoryFilter}
                    onCategoryFilter={handleCategoryFilter}
                    showPublishedOnly={showPublishedOnly}
                  />
                </Table>
              </div>
              {/* Scrollable content area */}
              <div className="max-h-[calc(100vh-140px)] overflow-y-auto">
                <Table className="table-fixed w-full">
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
