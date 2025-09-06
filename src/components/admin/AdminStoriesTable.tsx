import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, X, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StoriesTableHeader from "./StoriesTableHeader";
import StoriesTableRow from "./StoriesTableRow";


type SortField = 'story_code' | 'title' | 'author' | 'category' | 'published' | 'read_count' | 'thumbs_up_count' | 'thumbs_down_count' | 'ok_count' | 'reading_time_minutes' | 'updated_at' | 'copyright_status' | 'publication_status_code' | 'page_path';
type SortDirection = 'asc' | 'desc';
type PublishedFilter = 'all' | 'published' | 'unpublished';
type CategoryFilter = 'all' | 'Fun' | 'Life' | 'North Pole' | 'World Changers' | 'WebText' | 'Stories' | 'BioText';
type SortOption = 'story_code' | 'title' | 'author' | 'category' | 'read_count' | 'thumbs' | 'updated_at' | 'reading_time' | 'copyright_status' | 'publication_status' | 'text_code' | 'page_path';
type MediaFilter = 'all' | 'text' | 'audio' | 'video' | 'both';

interface GroupedStory extends Record<string, any> {
  id: string;
  story_code: string;
  title: string;
  author: string;
  category: string;
  publication_status_code: number;
  read_count: number;
  thumbs_up_count: number;
  updated_at: string;
  created_at: string;
}

interface AdminStoriesTableProps {
  onEditStory: (story: any) => void;
  onCreateStory: () => void;
  showActions?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const AdminStoriesTable = ({ 
  onEditStory, 
  onCreateStory,
  showActions = true,
  searchTerm = '',
  onSearchChange
}: AdminStoriesTableProps) => {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [publishedFilter, setPublishedFilter] = useState<PublishedFilter>('all');
  const [groupByAuthor, setGroupByAuthor] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [sortOption, setSortOption] = useState<SortOption>('title');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');

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
    queryKey: ['admin-stories', sortField, sortDirection, publishedFilter, categoryFilter, mediaFilter, sortOption],
    queryFn: async () => {
      let query = supabase
        .from('stories')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (publishedFilter === 'published') {
        query = query.in('publication_status_code', [0, 1]);
      } else if (publishedFilter === 'unpublished') {
        query = query.not('publication_status_code', 'in', '(0,1)');
      }
      
      // Apply category filter
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'Stories') {
          query = query.in('category', ['Fun', 'Life', 'North Pole', 'World Changers']);
        } else {
          query = query.eq('category', categoryFilter);
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  // Filter stories based on search term and media filter
  const filteredStories = React.useMemo(() => {
    let result = stories || [];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(story => 
        story.title?.toLowerCase().includes(searchLower) ||
        story.author?.toLowerCase().includes(searchLower) ||
        story.content?.toLowerCase().includes(searchLower) ||
        story.story_code?.toLowerCase().includes(searchLower) ||
        story.tagline?.toLowerCase().includes(searchLower) ||
        story.excerpt?.toLowerCase().includes(searchLower) ||
        story.category?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply media filter
    if (mediaFilter !== 'all') {
      result = result.filter(story => {
        const hasAudio = !!story.audio_url;
        const hasVideo = !!story.video_url;
        
        switch (mediaFilter) {
          case 'text':
            return !hasAudio && !hasVideo;
          case 'audio':
            return hasAudio && !hasVideo;
          case 'video':
            return hasVideo;
          case 'both':
            return hasAudio && hasVideo;
          default:
            return true;
        }
      });
    }
    
    
    return result;
  }, [stories, searchTerm, mediaFilter]);

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

  const getSortOptionDisplayName = (option: SortOption) => {
    switch (option) {
      case 'story_code':
        return 'Story Code';
      case 'title':
        return 'Title';
      case 'author':
        return 'Author (Grouped)';
      case 'category':
        return 'Category';
      case 'read_count':
        return 'Read Count';
      case 'thumbs':
        return 'Thumbs Up/Down';
      case 'updated_at':
        return 'Date Updated';
      case 'reading_time':
        return 'Time to Read';
      case 'copyright_status':
        return 'Copyright Status';
      case 'publication_status':
        return 'Publication Status';
      case 'text_code':
        return 'Text Code';
      case 'page_path':
        return 'Page Path';
      default:
        return 'Sort by...';
    }
  };

  const getMediaFilterDisplayName = (filter: MediaFilter) => {
    switch (filter) {
      case 'all':
        return 'All Stories';
      case 'text':
        return 'Text Only';
      case 'audio':
        return 'Has Text & Audio';
      case 'video':
        return 'Has Video';
      case 'both':
        return 'Has Text, Audio & Video';
      default:
        return 'Media Filter';
    }
  };

  const handleSortOptionChange = (option: SortOption) => {
    setSortOption(option);
    setGroupByAuthor(option === 'author');
    if (option === 'thumbs') {
      setSortField('thumbs_up_count');
      setSortDirection('desc');
    } else if (option === 'author') {
      setSortField('author');
      setSortDirection('asc');
    } else if (option === 'reading_time') {
      setSortField('reading_time_minutes');
      setSortDirection('asc');
    } else if (option === 'updated_at') {
      setSortField('updated_at');
      setSortDirection('desc');
    } else if (option === 'copyright_status') {
      setSortField('copyright_status');
      setSortDirection('asc');
    } else if (option === 'publication_status') {
      setSortField('publication_status_code' as SortField);
      setSortDirection('asc');
    } else if (option === 'text_code') {
      setSortField('story_code');
      setSortDirection('asc');
    } else if (option === 'page_path') {
      setSortField('page_path' as SortField);
      setSortDirection('asc');
    } else {
      setSortField(option as SortField);
      setSortDirection(option === 'read_count' ? 'desc' : 'asc');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Control Boxes */}
        <div className="w-full flex justify-center mb-4">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-3 justify-items-center">
            {/* Search Library */}
            <div className="w-full max-w-[380px] h-16 relative">
              <div className="absolute -top-5 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
                <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>1</span>
              </div>
              <Input
                placeholder="Type Here to Search"
                value={localSearchTerm}
                onChange={(e) => {
                  setLocalSearchTerm(e.target.value);
                  onSearchChange?.(e.target.value);
                }}
                className="text-[16pt] text-[#8b4513] font-bold placeholder:text-[16pt] placeholder:text-[#8b4513]/70 rounded-lg h-10 px-2 py-0 flex items-center shadow-lg ring-1 ring-[#8b4513] focus:ring-2 focus:ring-[#8b4513] focus:ring-offset-0 border-0 z-40"
                style={{ backgroundColor: '#FFEDD5' }}
              />
              {localSearchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1 h-8 w-8 p-0 text-[#8b4513]/80 hover:text-[#8b4513] hover:bg-orange-200 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="text-center mt-1 text-[14pt] text-[#8b4513] font-medium">
                {stories ? stories.length : 0} Stories
              </div>
            </div>

            {/* Select Media */}
            <div className="w-full max-w-[380px] h-16 relative">
              <div className="absolute -top-5 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
                <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>2</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="text-[16pt] bg-[#A0522D] text-white font-bold hover:bg-[#8b4513] rounded-full h-10 px-5 shadow-lg ring-1 ring-[#8b4513] w-full justify-between"
                    aria-label={`Currently filtering by ${getMediaFilterDisplayName(mediaFilter)}`}
                    title={`Current filter: ${getMediaFilterDisplayName(mediaFilter)}`}
                  >
                    Select Media —
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-[18pt] z-50 !bg-[#A0522D] !bg-opacity-100 text-white shadow-lg border border-[#8b4513] rounded-2xl p-1">
                  <DropdownMenuItem disabled className="text-white cursor-default font-medium">
                    Select Media
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setMediaFilter('all')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    All Stories
                    {mediaFilter === 'all' && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setMediaFilter('text')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    Text Only
                    {mediaFilter === 'text' && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setMediaFilter('audio')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    Has Text & Audio
                    {mediaFilter === 'audio' && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setMediaFilter('both')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    Has Text, Audio & Video
                    {mediaFilter === 'both' && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="text-center mt-1 text-[14pt] text-[#8b4513] font-medium">
                Selected: {getMediaFilterDisplayName(mediaFilter)}
              </div>
            </div>

            {/* Sort On */}
            <div className="w-full max-w-[380px] h-16 relative">
              <div className="absolute -top-5 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
                <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>3</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="text-[16pt] bg-[#A0522D] text-white font-bold hover:bg-[#8b4513] rounded-full h-10 px-5 shadow-lg ring-1 ring-[#8b4513] w-full justify-between"
                    aria-label={`Currently sorting by ${getSortOptionDisplayName(sortOption)}`}
                    title={`Currently sorting by: ${getSortOptionDisplayName(sortOption)}`}
                  >
                    Sort On —
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent className="text-[18pt] z-50 !bg-[#A0522D] !bg-opacity-100 text-white shadow-lg border border-[#8b4513] rounded-2xl p-1">
                  <DropdownMenuItem disabled className="text-white cursor-default font-medium">
                    Sort On —
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleSortOptionChange('title')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    Title
                    {sortOption === 'title' && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleSortOptionChange('author')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    Author
                    {sortOption === 'author' && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleSortOptionChange('category')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    Category
                    {sortOption === 'category' && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleSortOptionChange('read_count')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    Times Story Read
                    {sortOption === 'read_count' && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleSortOptionChange('thumbs')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    Thumbs Up / Down
                    {sortOption === 'thumbs' && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleSortOptionChange('reading_time')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    Time to Read
                    {sortOption === 'reading_time' && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                   <DropdownMenuItem onSelect={() => handleSortOptionChange('updated_at')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                     Date Updated
                     {sortOption === 'updated_at' && <Check className="h-4 w-4" />}
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={() => handleSortOptionChange('copyright_status')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                     Copyright Status
                     {sortOption === 'copyright_status' && <Check className="h-4 w-4" />}
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={() => handleSortOptionChange('publication_status')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                     Publication Status
                     {sortOption === 'publication_status' && <Check className="h-4 w-4" />}
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={() => handleSortOptionChange('text_code')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                     Text Code
                     {sortOption === 'text_code' && <Check className="h-4 w-4" />}
                   </DropdownMenuItem>
                   {categoryFilter === 'WebText' && (
                     <DropdownMenuItem onSelect={() => handleSortOptionChange('page_path')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                       Page Path
                       {sortOption === 'page_path' && <Check className="h-4 w-4" />}
                     </DropdownMenuItem>
                   )}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="text-center mt-1 text-[14pt] text-[#8b4513] font-medium">
                Sorted: {getSortOptionDisplayName(sortOption)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Table Content */}
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
                        categoryFilter={categoryFilter}
                        onEdit={(story) => {
                          console.log('🎯 AdminStoriesTable: Edit button clicked for story:', story.id, story.title);
                          onEditStory(story);
                        }}
                        onDelete={handleDeleteStory}
                        onStatusChange={handleStatusChange}
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
