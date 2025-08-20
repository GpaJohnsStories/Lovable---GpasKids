import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ArrowUp, ArrowDown, ChevronDown, Search, X, Headphones, Video, Calendar, Clock, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getCategoryShortName } from "@/utils/categoryUtils";
import { calculateReadingTime } from "@/utils/readingTimeUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'read_count' | 'updated_at' | 'created_at' | 'reading_time_minutes' | 'thumbs_up_count';
type SortDirection = 'asc' | 'desc';
type CategoryFilter = 'all' | 'Fun' | 'Life' | 'North Pole' | 'World Changers';
type SortOption = 'story_code' | 'title' | 'author' | 'category' | 'read_count' | 'thumbs' | 'updated_at' | 'reading_time';
type MediaFilter = 'all' | 'text' | 'audio' | 'video' | 'both';

interface Story {
  id: string;
  story_code: string;
  title: string;
  author: string;
  category: string;
  read_count: number;
  updated_at: string;
  created_at: string;
  thumbs_up_count: number;
  thumbs_down_count: number;
  reading_time_minutes?: number;
  audio_url?: string;
  video_url?: string;
  content?: string;
  tagline?: string;
  excerpt?: string;
  photo_link_1?: string;
  photo_alt_1?: string;
  copyright_status?: string;
}

interface PublicStoriesTableProps {
  onEditBio?: (authorName: string) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const PublicStoriesTable = ({
  onEditBio,
  searchTerm = '',
  onSearchChange
}: PublicStoriesTableProps) => {
  const [sortField, setSortField] = useState<SortField>('read_count');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [sortOption, setSortOption] = useState<SortOption>('read_count');
  const [groupByAuthor, setGroupByAuthor] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');

  // Sync local search with external search term
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const {
    data: stories,
    isLoading
  } = useQuery({
    queryKey: ['public-stories', sortField, sortDirection, categoryFilter, localSearchTerm, mediaFilter, sortOption],
    queryFn: async () => {
      let query = supabase.from('stories').select('id, story_code, title, author, category, read_count, updated_at, created_at, thumbs_up_count, thumbs_down_count, reading_time_minutes, audio_url, video_url, content, tagline, excerpt, photo_link_1, photo_alt_1, copyright_status').eq('published', 'Y').not('category', 'in', '("WebText","BioText")');

      // Apply category filter
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      // Apply media filter
      if (mediaFilter === 'text') {
        query = query.is('audio_url', null).is('video_url', null);
      } else if (mediaFilter === 'audio') {
        query = query.not('audio_url', 'is', null);
      } else if (mediaFilter === 'video') {
        query = query.not('video_url', 'is', null);
      } else if (mediaFilter === 'both') {
        query = query.not('audio_url', 'is', null).not('video_url', 'is', null);
      }

      // Apply search filter
      if (localSearchTerm && localSearchTerm.trim() !== '') {
        const searchQuery = `%${localSearchTerm.trim()}%`;
        query = query.or(`title.ilike.${searchQuery},content.ilike.${searchQuery},excerpt.ilike.${searchQuery},tagline.ilike.${searchQuery},author.ilike.${searchQuery}`);
      }

      // Apply sorting
      if (sortOption === 'thumbs') {
        query = query.order('thumbs_up_count', {
          ascending: false
        }).order('thumbs_down_count', {
          ascending: true
        });
      } else {
        query = query.order(sortField, {
          ascending: sortDirection === 'asc'
        });
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;

      // Filter stories based on current time for public library
      const now = new Date();
      let filteredData = data.filter(story => {
        const storyDate = new Date(story.updated_at);
        return storyDate <= now;
      });

      // Calculate reading time for stories that don't have it
      filteredData = filteredData.map(story => ({
        ...story,
        reading_time_minutes: story.reading_time_minutes || Math.max(1, Math.ceil((story.content?.length || 0) / 1000))
      }));
      return filteredData;
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      // Start with descending for read_count, ascending for others
      setSortDirection(field === 'read_count' ? 'desc' : 'asc');
    }
  };

  const handleSortOptionChange = (option: SortOption) => {
    setSortOption(option);
    setGroupByAuthor(option === 'author');
    setShowCategorySelect(option === 'category');
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
    } else {
      setSortField(option as SortField);
      setSortDirection(option === 'read_count' ? 'desc' : 'asc');
    }
  };

  const toggleSortDirection = () => {
    if (sortOption !== 'thumbs' && sortOption !== 'author') {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Fun":
        return "bg-gradient-to-b from-blue-400 to-blue-600 border-blue-700 shadow-[0_6px_12px_rgba(37,99,235,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "Life":
        return "bg-gradient-to-b from-green-400 to-green-600 border-green-700 shadow-[0_6px_12px_rgba(34,197,94,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "North Pole":
        return "bg-gradient-to-b from-red-400 to-red-600 border-red-700 shadow-[0_6px_12px_rgba(239,68,68,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "World Changers":
        return "bg-gradient-to-b from-amber-400 to-amber-600 border-amber-700 shadow-[0_6px_12px_rgba(245,158,11,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-amber-900";
      default:
        return "bg-gradient-to-b from-gray-400 to-gray-600 border-gray-700 shadow-[0_6px_12px_rgba(75,85,99,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
    }
  };

  const getCategoryDisplayName = (category: CategoryFilter) => {
    switch (category) {
      case 'all':
        return 'Show All';
      case 'Fun':
        return 'Fun Stuff';
      case 'Life':
        return 'Life Lessons';
      case 'North Pole':
        return 'North Pole';
      case 'World Changers':
        return 'World Changers';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: CategoryFilter) => {
    switch (category) {
      case 'all':
        return 'bg-gradient-to-b from-orange-400 to-orange-600 text-white border-orange-500';
      case 'Fun':
        return 'bg-gradient-to-b from-blue-400 to-blue-600 text-white border-blue-500';
      case 'Life':
        return 'bg-gradient-to-b from-green-400 to-green-600 text-white border-green-500';
      case 'North Pole':
        return 'bg-gradient-to-b from-cyan-400 to-cyan-600 text-white border-cyan-500';
      case 'World Changers':
        return 'bg-gradient-to-b from-amber-400 to-amber-600 text-white border-amber-500';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCurrentCategoryDisplay = () => {
    if (categoryFilter === 'all') {
      return 'Category';
    }
    return getCategoryDisplayName(categoryFilter);
  };

  const categoryOptions: CategoryFilter[] = ['all', 'Fun', 'Life', 'North Pole', 'World Changers'];

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

  // Group stories by author when in author mode
  const groupedStories = groupByAuthor && stories ? stories.reduce((groups, story) => {
    const author = story.author;
    if (!groups[author]) {
      groups[author] = [];
    }
    groups[author].push(story);
    return groups;
  }, {} as Record<string, typeof stories>) : null;

  return <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
      <TooltipProvider>
        <Card>
        <CardContent className="p-6">
          {/* Control Boxes */}
          <div className="w-full flex justify-center mb-4">
            <div className="grid gap-3 grid-cols-1 md:grid-cols-3 justify-items-center">
              {/* Search Library */}
              <div className="w-full max-w-[380px] h-16 relative">
                <div className="absolute -top-4 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
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
                  {stories ? stories.length : 0} returned
                </div>
              </div>

              {/* Select Media */}
              <div className="w-full max-w-[380px] h-16 relative">
                <div className="absolute -top-4 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
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
                  {getMediaFilterDisplayName(mediaFilter)} selected
                </div>
              </div>

              {/* Sort On */}
              <div className="w-full max-w-[380px] h-16 relative">
                <div className="absolute -top-4 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
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
                    <DropdownMenuItem onSelect={() => handleSortOptionChange('category')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-center">
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
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="text-center mt-1 text-[14pt] text-[#8b4513] font-medium">
                  {getSortOptionDisplayName(sortOption)} sorted
                </div>
              </div>
            </div>
          </div>
          
          {isLoading ? <div className="text-center py-8 text-black-system">
              <BookOpen className="h-8 w-8 animate-spin text-green-700 mx-auto mb-4" />
              <p>Loading stories...</p>
            </div> : groupByAuthor && groupedStories ?
          // Grouped by Author View
          <div className="space-y-6">
              {Object.entries(groupedStories).sort(([a], [b]) => a.localeCompare(b)).map(([author, authorStories]) => <div key={author} className="border border-green-700 rounded-lg overflow-hidden">
                    <div className="bg-green-700 text-white p-4">
                      <h3 className="text-lg font-bold">{author}</h3>
                      <p className="text-sm opacity-90">{authorStories.length} stories</p>
                    </div>
                    <div className="p-4">
                      <div className="grid gap-3">
                        {authorStories.sort((a, b) => a.title.localeCompare(b.title)).map(story => <div key={story.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-green-700">{story.story_code}</span>
                                <Link to={`/story/${story.story_code}`} className="font-medium hover:text-red-600 transition-colors">
                                  {story.title}
                                </Link>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{story.read_count} reads</span>
                                {story.audio_url && <Headphones className="h-4 w-4 text-green-600" />}
                                {story.video_url && <Video className="h-4 w-4 text-blue-600" />}
                              </div>
                            </div>)}
                      </div>
                    </div>
                  </div>)}
            </div> : <div className="border border-green-700 rounded-lg overflow-hidden">
              <Table>
                  <TableHeader className="table-header-no-border">
                    <TableRow className="table-header-no-border bg-background hover:bg-background">
                      <TableHead className="p-1 text-center bg-background border-r border-green-700 min-w-0">
                        <div className="bg-green-700 text-white w-full h-6 text-xs px-1 py-1 font-system">
                          Title
                        </div>
                      </TableHead>
                      <TableHead className="p-1 text-center bg-background border-r border-green-700 w-24 min-w-24 max-w-24">
                        <div className="bg-green-700 text-white w-full h-6 text-xs px-1 py-1 font-system">
                          Author
                        </div>
                      </TableHead>
                      <TableHead className="p-1 text-center bg-background w-32 min-w-32 max-w-32">
                        <div className="text-white bg-green-700 h-6 text-xs px-1 py-1 font-system flex items-center justify-center">
                          Details
                        </div>
                      </TableHead>
                     </TableRow>
                  </TableHeader>
                <TableBody>
                  {stories?.map(story => <TableRow key={story.id} className="table-row-green">
                       <TableCell className="text-black-system table-cell-top">
                         <div className="flex items-start gap-3">
                           {story.photo_link_1 && <div className="flex-shrink-0 flex flex-col items-center">
                               <Tooltip>
                                 <TooltipTrigger asChild>
                                   <img src={story.photo_link_1} alt={story.photo_alt_1 || `Photo for ${story.title}`} className="w-[100px] h-[100px] rounded-lg border-2 border-white shadow-lg object-cover cursor-pointer" onError={e => {
                              e.currentTarget.style.display = 'none';
                            }} />
                                 </TooltipTrigger>
                                 <TooltipContent className="story-photo-tooltip">
                                   <p>{story.photo_alt_1 || `Photo for ${story.title}`}</p>
                                 </TooltipContent>
                               </Tooltip>
                               <div className="font-mono text-sm font-bold text-black-system mt-2">
                                 {story.story_code}
                               </div>
                             </div>}
                           <div className="flex-1">
                             <Link to={`/story/${story.story_code}`} className="hover:text-red-600 transition-colors duration-300 font-medium text-base">
                               {story.title}
                             </Link>
                             {story.tagline && <div className="text-sm font-medium text-amber-700 italic mt-1">
                                 {story.tagline}
                               </div>}
                             {story.excerpt && <div className="text-sm text-amber-600 mt-1 leading-relaxed">
                                 {story.excerpt}
                               </div>}
                           </div>
                         </div>
                       </TableCell>
                        <TableCell className="text-black-system table-cell-top">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm">{story.author}</span>
                             {onEditBio && <Tooltip>
                                 <TooltipTrigger asChild>
                                   <Button onClick={() => onEditBio(story.author)} className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1 h-auto min-w-[80px]" size="sm">
                                     Biography
                                   </Button>
                                 </TooltipTrigger>
                                 <TooltipContent>
                                   <p className="text-xs">View {story.author}'s biography</p>
                                 </TooltipContent>
                               </Tooltip>}
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <Link to="/writing">
                                   <span className={`text-xs font-bold px-2 py-1 rounded text-white cursor-pointer ${(story.copyright_status || '©') === '©' ? 'bg-red-500' : (story.copyright_status || '©') === 'O' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                     {story.copyright_status || '©'}
                                   </span>
                                 </Link>
                               </TooltipTrigger>
                               <TooltipContent>
                                 <div className="text-xs">
                                   {(story.copyright_status || '©') === '©' && <span>© Full Copyright - All rights reserved. Click for more information</span>}
                                   {(story.copyright_status || '©') === 'O' && <span>O Open, No Copyright - Free to share. Click for more information</span>}
                    {(story.copyright_status || '©') === 'L' && <span>L Limited Sharing - Gpa John's Copyright. Click for more information</span>}
                                 </div>
                               </TooltipContent>
                             </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell className="text-black-system table-cell-top">
                          <div className="details-column-stack">
                            <div className="details-stack-item">
                              <div className={`${getCategoryBadgeColor(story.category)} text-white text-xs px-2 py-1 rounded text-center mb-1`}>
                                {getCategoryShortName(story.category)}
                              </div>
                            </div>
                            <div className="details-stack-item">
                              <div className="text-xs text-gray-600 font-medium">Reads</div>
                              <div className="text-sm font-bold text-black-system">{story.read_count}</div>
                            </div>
                            <div className="details-stack-item">
                              <div className="text-xs text-gray-600 font-medium">👍 {story.thumbs_up_count} 👎 {story.thumbs_down_count}</div>
                            </div>
                            <div className="details-stack-item">
                              <div className="text-xs text-gray-600 font-medium">Updated</div>
                              <div className="text-xs text-black-system">{new Date(story.updated_at).toLocaleDateString()}</div>
                            </div>
                            <div className="details-stack-item flex gap-1 justify-center">
                              {story.audio_url && <Headphones className="h-4 w-4 text-green-600" />}
                              {story.video_url && <Video className="h-4 w-4 text-blue-600" />}
                              {story.reading_time_minutes && <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-gray-500" /><span className="text-xs text-gray-500">{story.reading_time_minutes}m</span></div>}
                            </div>
                          </div>
                        </TableCell>
                     </TableRow>)}
                </TableBody>
              </Table>
            </div>}
        </CardContent>
      </Card>
    </TooltipProvider>
    </div>;
};

export default PublicStoriesTable;
