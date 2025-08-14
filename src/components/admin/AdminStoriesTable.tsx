
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import StoriesTableHeader from "./StoriesTableHeader";
import StoriesTableRow from "./StoriesTableRow";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'published' | 'read_count' | 'thumbs_up_count' | 'thumbs_down_count' | 'ok_count' | 'reading_time_minutes' | 'updated_at';
type SortDirection = 'asc' | 'desc';
type PublishedFilter = 'all' | 'published' | 'unpublished';
type CategoryFilter = 'all' | 'Fun' | 'Life' | 'North Pole' | 'World Changers' | 'WebText' | 'BioText';

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

interface AdminStoriesTableProps {
  onEditStory: (story: any) => void;
  onCreateStory: () => void;
  showActions?: boolean;
  onEditBio?: (authorName: string) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const AdminStoriesTable = ({ 
  onEditStory, 
  onCreateStory,
  showActions = true,
  onEditBio,
  searchTerm = '',
  onSearchChange
}: AdminStoriesTableProps) => {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [publishedFilter, setPublishedFilter] = useState<PublishedFilter>('all');
  const [groupByAuthor, setGroupByAuthor] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Sync local search term with parent prop
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(localSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  const { data: stories, isLoading, refetch } = useQuery({
    queryKey: ['admin-stories', sortField, sortDirection, publishedFilter, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('stories')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (publishedFilter === 'published') {
        query = query.eq('published', 'Y');
      } else if (publishedFilter === 'unpublished') {
        query = query.eq('published', 'N');
      }
      
      // Apply category filter
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  // Filter stories based on search term
  const filteredStories = React.useMemo(() => {
    if (!stories || !searchTerm.trim()) return stories;
    
    const searchLower = searchTerm.toLowerCase();
    return stories.filter(story => 
      story.title?.toLowerCase().includes(searchLower) ||
      story.author?.toLowerCase().includes(searchLower) ||
      story.content?.toLowerCase().includes(searchLower) ||
      story.story_code?.toLowerCase().includes(searchLower) ||
      story.tagline?.toLowerCase().includes(searchLower) ||
      story.excerpt?.toLowerCase().includes(searchLower) ||
      story.category?.toLowerCase().includes(searchLower)
    );
  }, [stories, searchTerm]);

  const handleSort = (field: SortField) => {
    // Exit group by author view when sorting by other fields
    if (groupByAuthor && field !== 'author') {
      setGroupByAuthor(false);
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
    if (groupByAuthor && field !== 'author') {
      setGroupByAuthor(false);
    }
    
    setSortField(field);
    setSortDirection(direction);
  };

  const handleCategoryFilter = (filter: CategoryFilter) => {
    setCategoryFilter(filter);
    // Exit group by author view when filtering
    if (groupByAuthor) {
      setGroupByAuthor(false);
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
    if (!groupByAuthor || !filteredStories) return null;
    
    const grouped = filteredStories.reduce((acc: Record<string, GroupedStory[]>, story) => {
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
  }, [filteredStories, groupByAuthor]);

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search stories by title, content, author, or keywords..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-2 text-sm border-2 focus:border-orange-400 rounded-lg placeholder:font-bold search-input-amber"
            />
            {searchTerm && (
              <Button
                onClick={handleClearSearch}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="relative">
          {isLoading ? (
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
                          showPublishedColumn={true}
                          hideAuthorColumn={true}
                          groupByAuthor={groupByAuthor}
                          onToggleGroupByAuthor={() => setGroupByAuthor(!groupByAuthor)}
                          onCreateStory={onCreateStory}
                          categoryFilter={categoryFilter}
                          onCategoryFilter={handleCategoryFilter}
                          showPublishedOnly={false}
                        />
                        <TableBody>
                          {authorStories.map((story) => (
                            <StoriesTableRow
                              key={story.id}
                              story={story}
                              showActions={showActions}
                              showPublishedColumn={true}
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
                    showPublishedColumn={true}
                    groupByAuthor={groupByAuthor}
                    onToggleGroupByAuthor={() => setGroupByAuthor(!groupByAuthor)}
                    onCreateStory={onCreateStory}
                    categoryFilter={categoryFilter}
                    onCategoryFilter={handleCategoryFilter}
                    showPublishedOnly={false}
                  />
                </Table>
              </div>
              {/* Scrollable content area */}
              <div className="max-h-[calc(100vh-140px)] overflow-y-auto">
                <Table className="table-fixed w-full">
                  <TableBody>
                    {filteredStories?.map((story) => (
                      <StoriesTableRow
                        key={story.id}
                        story={story}
                        showActions={showActions}
                        showPublishedColumn={true}
                        onEdit={(story) => {
                          console.log('🎯 AdminStoriesTable: Edit button clicked for story:', story.id, story.title);
                          onEditStory(story);
                        }}
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

export default AdminStoriesTable;
