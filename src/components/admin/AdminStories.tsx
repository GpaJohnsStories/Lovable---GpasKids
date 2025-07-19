
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
import AdminLayout from "./AdminLayout";
import { useUserRole } from "@/hooks/useUserRole";

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

const AdminStories = () => {
  const { isViewer } = useUserRole();
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [publishedFilter, setPublishedFilter] = useState<PublishedFilter>('all');
  const [groupByAuthor, setGroupByAuthor] = useState(false);

  const { data: stories, isLoading: storiesLoading, refetch } = useQuery({
    queryKey: ['admin-stories', sortField, sortDirection, publishedFilter],
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
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

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

  const handleEditStory = (story: any) => {
    // TODO: Implement edit functionality
    console.log('Edit story:', story);
  };

  const handleCreateStory = () => {
    // TODO: Implement create functionality
    console.log('Create new story');
  };

  const handleEditBioByAuthorName = async (authorName: string) => {
    // TODO: Implement bio edit functionality
    console.log('Edit bio for author:', authorName);
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
    <AdminLayout>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {!isViewer && (
                <>
                  <Button
                    onClick={handleCreateStory}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Create New Story
                  </Button>
                  <Button
                    onClick={() => setGroupByAuthor(!groupByAuthor)}
                    variant={groupByAuthor ? 'default' : 'outline'}
                    className="flex items-center gap-2"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {groupByAuthor ? 'Ungroup Stories' : 'Group by Author'}
                  </Button>
                </>
              )}
            </div>
            <div className="text-sm text-amber-700">
              <p className="font-medium">Story Management</p>
              <p className="text-xs mt-1">
                {isViewer ? 'Viewing in read-only mode' : 'Full editing access available'}
              </p>
            </div>
          </div>
        </div>

        {/* Stories Table */}
        <Card>
          <CardContent>
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
                              showActions={!isViewer}
                              showPublishedColumn={true}
                              hideAuthorColumn={true}
                              groupByAuthor={groupByAuthor}
                              onToggleGroupByAuthor={() => setGroupByAuthor(!groupByAuthor)}
                            />
                            <TableBody>
                              {authorStories.map((story) => (
                                <StoriesTableRow
                                  key={story.id}
                                  story={story}
                                  showActions={!isViewer}
                                  showPublishedColumn={true}
                                  onEdit={handleEditStory}
                                  onDelete={handleDeleteStory}
                                  onStatusChange={handleStatusChange}
                                  hideAuthor={true}
                                  onEditBio={handleEditBioByAuthorName}
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
                        showActions={!isViewer}
                        showPublishedColumn={true}
                        groupByAuthor={groupByAuthor}
                        onToggleGroupByAuthor={() => setGroupByAuthor(!groupByAuthor)}
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
                            showActions={!isViewer}
                            showPublishedColumn={true}
                            onEdit={handleEditStory}
                            onDelete={handleDeleteStory}
                            onStatusChange={handleStatusChange}
                            onEditBio={handleEditBioByAuthorName}
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
      </div>
    </AdminLayout>
  );
};

export default AdminStories;
