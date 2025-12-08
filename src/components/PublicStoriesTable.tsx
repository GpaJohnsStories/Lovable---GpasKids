import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Volume2, VideoIcon, ChevronDown, Check, X, Glasses, ArrowUp, ArrowDown } from "lucide-react";
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCategoryShortName, getCategoryDisplayName as getUtilsCategoryDisplayName } from "@/utils/categoryUtils";

interface Story {
  id: string;
  title: string;
  author: string;
  category: string;
  story_code: string;
  tagline?: string;
  excerpt?: string;
  updated_at: string;
  reading_time_minutes?: number;
  audio_url?: string;
  audio_duration_seconds?: number;
  video_url?: string;
  video_duration_seconds?: number;
  read_count?: number;
  thumbs_up_count?: number;
  thumbs_down_count?: number;
  ok_count?: number;
  photo_link_1?: string;
}

type MediaFilter = 'all' | 'text' | 'audio' | 'video' | 'both';
type SortOption = 'title' | 'author' | 'category' | 'read_count' | 'thumbs' | 'reading_time' | 'updated_at' | 'copyright_status';
type SortDirection = 'asc' | 'desc';

const formatDuration = (seconds: number | undefined): string => {
  if (!seconds || seconds === 0) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
};

const PublicStoriesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const navigate = useNavigate();

  // Fetch stories with aggressive caching - stays in memory for entire session
  const { data: stories = [], isLoading: loading } = useQuery({
    queryKey: ['public-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          author,
          category,
          story_code,
          tagline,
          excerpt,
          updated_at,
          reading_time_minutes,
          audio_url,
          audio_duration_seconds,
          video_url,
          video_duration_seconds,
          read_count,
          thumbs_up_count,
          thumbs_down_count,
          ok_count,
          photo_link_1
        `)
        .eq('site', 'KIDS')
        .lt('publication_status_code', 2)
        .not('category', 'in', '("WebText","BioText","Admin")')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: Infinity,           // Data never goes stale
    gcTime: Infinity,               // Keep in cache forever
    refetchOnWindowFocus: false,   // Don't refetch when tab regains focus
    refetchOnMount: false,          // Don't refetch on component remount
    refetchOnReconnect: false,      // Don't refetch on reconnect
  });

  // Filter and sort stories
  const filteredAndSortedStories = useMemo(() => {
    let result = stories;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(story => 
        story.title?.toLowerCase().includes(searchLower) ||
        story.author?.toLowerCase().includes(searchLower) ||
        story.story_code?.toLowerCase().includes(searchLower) ||
        story.tagline?.toLowerCase().includes(searchLower) ||
        story.excerpt?.toLowerCase().includes(searchLower) ||
        story.category?.toLowerCase().includes(searchLower) ||
        getCategoryShortName(story.category || '').toLowerCase().includes(searchLower) ||
        getUtilsCategoryDisplayName(story.category || '').toLowerCase().includes(searchLower)
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
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortOption) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'read_count':
          comparison = (a.read_count || 0) - (b.read_count || 0);
          break;
        case 'thumbs':
          comparison = (a.thumbs_up_count || 0) - (b.thumbs_up_count || 0);
          break;
        case 'reading_time':
          comparison = (a.reading_time_minutes || 0) - (b.reading_time_minutes || 0);
          break;
        case 'updated_at':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        default:
          return 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [stories, searchTerm, mediaFilter, sortOption, sortDirection]);

  // Group stories by author when sorting by author
  const groupedByAuthor = useMemo(() => {
    if (sortOption !== 'author') return null;
    
    const groups: { [author: string]: Story[] } = {};
    
    filteredAndSortedStories.forEach(story => {
      if (!groups[story.author]) {
        groups[story.author] = [];
      }
      groups[story.author].push(story);
    });
    
    // Sort stories within each author group by updated_at (newest first)
    Object.keys(groups).forEach(author => {
      groups[author].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    });
    
    // Convert to array and sort authors
    const authorsArray = Object.keys(groups).sort((a, b) => {
      return sortDirection === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    });
    
    return authorsArray.map(author => ({
      author,
      stories: groups[author],
      count: groups[author].length
    }));
  }, [filteredAndSortedStories, sortOption, sortDirection]);

  const handleStoryClick = (storyCode: string) => {
    window.open(`/story/${storyCode}`, '_blank');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setMediaFilter('all');
  };

  const getMediaFilterDisplayName = (filter: MediaFilter) => {
    switch (filter) {
      case 'all': return 'All Stories';
      case 'text': return 'Text Only';
      case 'audio': return 'Has Text & Audio';
      case 'video': return 'Has Video';
      case 'both': return 'Has Text, Audio & Video';
      default: return 'Media Filter';
    }
  };

  const getSortOptionDisplayName = (option: SortOption) => {
    switch (option) {
      case 'title': return 'Title';
      case 'author': return 'Author';
      case 'category': return 'Category';
      case 'read_count': return 'Times Story Read';
      case 'thumbs': return 'Thumbs Up / Down';
      case 'reading_time': return 'Time to Read';
      case 'updated_at': return 'Date Updated';
      case 'copyright_status': return 'Copyright Status';
      default: return 'Sort by...';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Fun":
        return "bg-gradient-to-b from-blue-400 to-blue-600 text-white border-blue-500";
      case "Life":
        return "bg-gradient-to-b from-green-400 to-green-600 text-white border-green-500";
      case "North Pole":
        return "bg-gradient-to-b from-red-400 to-red-600 text-white border-red-500";
      case "World Changers":
        return "bg-gradient-to-b from-purple-400 to-purple-600 text-white border-purple-500";
      default:
        return "bg-gradient-to-b from-gray-400 to-gray-600 text-white border-gray-500";
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "Fun":
        return "Fun Stuff";
      case "Life":
        return "Life Lessons";
      case "North Pole":
        return "North Pole";
      case "World Changers":
        return "World Changers";
      default:
        return category;
    }
  };

  const MediaIcons: React.FC<{ story: Story }> = ({ story }) => {
    const hasAudio = story.audio_url;
    const hasVideo = story.video_url;
    const hasReadingTime = story.reading_time_minutes;
    
    return (
      <div className="flex flex-col items-center gap-2 mt-1">
        {/* Reading Time with Glasses Icon - Always show if available */}
        {hasReadingTime && (
          <div className="flex items-center gap-1" style={{ color: '#9c441a' }}>
            <Glasses className="h-[21px] w-[21px]" />
            <span className="font-medium" style={{ fontSize: '21px' }}>
              {hasReadingTime} min
            </span>
          </div>
        )}
        
        {/* Audio and Video Icons */}
        <div className="flex items-center gap-4">
          {hasAudio && (
            <div className="flex items-center gap-1 text-blue-600">
              <Volume2 className="h-[21px] w-[21px]" />
              <span className="font-medium" style={{ fontSize: '21px' }}>
                {formatDuration(story.audio_duration_seconds)}
              </span>
            </div>
          )}
          {hasVideo && (
            <div className="flex items-center gap-1 text-purple-600">
              <VideoIcon className="h-[21px] w-[21px]" />
              <span className="font-medium" style={{ fontSize: '21px' }}>
                {formatDuration(story.video_duration_seconds)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Control Boxes - Copied from Admin */}
        <div className="w-full flex justify-center mb-4">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-3 justify-items-center">
            {/* Search Library */}
            <div className="w-full max-w-[380px] h-16 relative">
              <div className="absolute -top-5 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
                <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>1</span>
              </div>
              <Input
                placeholder="Type Here to Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-[16pt] text-[#8b4513] font-bold placeholder:text-[16pt] placeholder:text-[#8b4513]/70 rounded-lg h-10 px-2 py-0 flex items-center shadow-lg ring-1 ring-[#8b4513] focus:ring-2 focus:ring-[#8b4513] focus:ring-offset-0 border-0 z-40"
                style={{ backgroundColor: '#FFEDD5' }}
              />
              {searchTerm && (
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
                {filteredAndSortedStories.length} Stories
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
                  >
                    Select Media —
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="text-[18pt] !bg-[#A0522D] !bg-opacity-100 text-white shadow-lg border border-[#8b4513] rounded-2xl p-1"
                  style={{ zIndex: 9999 }}
                  sideOffset={5}
                  align="start"
                >
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
                  <DropdownMenuItem onSelect={() => setMediaFilter('video')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                    Has Video
                    {mediaFilter === 'video' && <Check className="h-4 w-4" />}
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
              <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="text-[16pt] bg-[#A0522D] text-white font-bold hover:bg-[#8b4513] rounded-full h-10 px-5 shadow-lg ring-1 ring-[#8b4513] flex-1 justify-between"
                  >
                    Sort On —
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="text-[18pt] !bg-[#A0522D] !bg-opacity-100 text-white shadow-lg border border-[#8b4513] rounded-2xl p-1"
                  style={{ zIndex: 9999 }}
                  sideOffset={5}
                  align="start"
                >
                    <DropdownMenuItem disabled className="text-white cursor-default font-medium">
                      Sort On —
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSortOption('title')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                      Title
                      {sortOption === 'title' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSortOption('author')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                      Author
                      {sortOption === 'author' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSortOption('category')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                      Category
                      {sortOption === 'category' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setSortOption('read_count'); setSortDirection('desc'); }} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                      Times Story Read
                      {sortOption === 'read_count' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSortOption('thumbs')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                      Thumbs Up / Down
                      {sortOption === 'thumbs' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSortOption('reading_time')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                      Time to Read
                      {sortOption === 'reading_time' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSortOption('updated_at')} className="text-white hover:bg-[#8b4513] rounded-lg flex items-center justify-between">
                      Date Updated
                      {sortOption === 'updated_at' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="text-[16pt] bg-[#A0522D] text-white font-bold hover:bg-[#8b4513] rounded-full h-10 w-12 shadow-lg ring-1 ring-[#8b4513] flex items-center justify-center"
                  title={`Currently sorting ${sortDirection === 'asc' ? 'A to Z / Low to High' : 'Z to A / High to Low'}`}
                >
                  {sortDirection === 'asc' ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                </Button>
              </div>
              <div className="text-center mt-1 text-[14pt] text-[#8b4513] font-medium">
                Sorted by: {getSortOptionDisplayName(sortOption)} ({sortDirection === 'asc' ? 'A→Z' : 'Z→A'})
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <TableHead className="p-1 text-center bg-background border-r border-gray-200" colSpan={2} style={{ width: '350px', minWidth: '350px' }}>
                  <div className="w-full h-6 px-1 py-1 text-white font-bold flex items-center justify-center" style={{ backgroundColor: '#228B22', fontSize: '21px' }}>
                    Title
                  </div>
                </TableHead>
                <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '220px', minWidth: '220px', maxWidth: '220px' }}>
                  <div className="w-full h-6 px-1 py-1 text-white font-bold flex items-center justify-center" style={{ backgroundColor: '#228B22', fontSize: '21px' }}>
                    Author
                  </div>
                </TableHead>
                <TableHead className="p-1 text-center bg-background" style={{ width: '140px', minWidth: '140px', maxWidth: '140px' }}>
                  <div className="w-full h-6 px-1 py-1 text-white font-bold text-center flex items-center justify-center" style={{ backgroundColor: '#228B22', fontSize: '21px' }}>
                    Details
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {filteredAndSortedStories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No stories found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : sortOption === 'author' && groupedByAuthor ? (
                // Author-grouped view
                groupedByAuthor.map((authorGroup) => (
                  <React.Fragment key={authorGroup.author}>
                    {/* Author Banner Row */}
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <div className="bg-blue-600 text-white text-center py-3 px-4">
                          <div className="font-bold" style={{ fontSize: '24px', fontFamily: 'Georgia, serif' }}>
                            {authorGroup.author} ({authorGroup.count} {authorGroup.count === 1 ? 'story' : 'stories'})
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Stories for this author */}
                    {authorGroup.stories.map((story) => (
                      <TableRow key={story.id} className="hover:bg-gray-50">
                        {/* Code Column with Photo */}
                        <TableCell className="p-2 text-center text-xs align-top" style={{ width: '80px', minWidth: '80px' }}>
                          <div className="flex flex-col items-center gap-2">
                            {story.photo_link_1 ? (
                              <img 
                                src={story.photo_link_1} 
                                alt={`${story.title} thumbnail`}
                                className="w-[75px] h-[75px] object-cover rounded border border-gray-400 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => handleStoryClick(story.story_code)}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div 
                                className="w-[75px] h-[75px] bg-gray-200 border border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                                onClick={() => handleStoryClick(story.story_code)}
                              >
                                <span className="text-gray-500 text-xs">No Image</span>
                              </div>
                            )}
                        <div 
                          className="cursor-pointer hover:text-blue-600 transition-colors"
                          style={{ fontSize: '19px', lineHeight: '1.1' }}
                          onClick={() => handleStoryClick(story.story_code)}
                        >
                          {story.story_code}
                        </div>
                          </div>
                        </TableCell>
                        
                        {/* Title Column */}
                        <TableCell className="p-2 align-top">
                          <div className="cursor-pointer" onClick={() => handleStoryClick(story.story_code)}>
                            <div className="font-bold text-black" style={{ fontFamily: 'Georgia, serif', fontSize: '21px' }}>
                              {story.title}
                            </div>
                            {story.tagline && (
                              <div className="italic text-amber-700 mt-1" style={{ fontFamily: 'Georgia, serif', fontSize: '21px' }}>
                                {story.tagline}
                              </div>
                            )}
                            {story.excerpt && (
                              <div className="text-black mt-1" style={{ fontFamily: 'Georgia, serif', fontSize: '21px' }}>
                                {story.excerpt}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                         {/* Author Column */}
                         <TableCell className="p-2 text-center align-top" style={{ width: '220px', minWidth: '220px', maxWidth: '220px' }}>
                           <Badge 
                             className={`${getCategoryBadgeColor(story.category)} justify-center text-center px-3 py-1 rounded-sm`} 
                             style={{ fontSize: '21px', width: '195px' }}
                           >
                             {getCategoryDisplayName(story.category)}
                           </Badge>
                           <div className="text-center mt-2" style={{ fontFamily: 'Georgia, serif', fontSize: '21px' }}>{story.author}</div>
                           <MediaIcons story={story} />
                         </TableCell>
                        
                         {/* Details Column */}
                         <TableCell className="p-2 text-center align-top">
                           <div className="space-y-2">
                            <div className="text-blue-600 font-medium" style={{ fontSize: '21px' }}>
                              Reads: {story.read_count || 0}
                            </div>
                            <div className="flex items-center justify-center gap-3">
                              <div className="flex items-center gap-1">
                                <span className="text-lg">👍</span>
                                <span className="font-medium" style={{ fontSize: '21px' }}>{story.thumbs_up_count || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-lg">👎</span>
                                <span className="font-medium" style={{ fontSize: '21px' }}>{story.thumbs_down_count || 0}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-blue-600 font-medium" style={{ fontSize: '21px' }}>Updated</div>
                              <div className="text-black" style={{ fontSize: '21px' }}>{format(new Date(story.updated_at), 'M/d/yyyy')}</div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                // Regular flat table view
                filteredAndSortedStories.map((story) => (
                  <TableRow key={story.id} className="hover:bg-gray-50">
                    {/* Code Column with Photo */}
                    <TableCell className="p-2 text-center text-xs align-top" style={{ width: '80px', minWidth: '80px' }}>
                      <div className="flex flex-col items-center gap-2">
                        {story.photo_link_1 ? (
                          <img 
                            src={story.photo_link_1} 
                            alt={`${story.title} thumbnail`}
                            className="w-[75px] h-[75px] object-cover rounded border border-gray-400 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleStoryClick(story.story_code)}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div 
                            className="w-[75px] h-[75px] bg-gray-200 border border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                            onClick={() => handleStoryClick(story.story_code)}
                          >
                            <span className="text-gray-500 text-xs">No Image</span>
                          </div>
                        )}
                        <div 
                          className="cursor-pointer hover:text-blue-600 transition-colors"
                          style={{ fontSize: '19px', lineHeight: '1.1' }}
                          onClick={() => handleStoryClick(story.story_code)}
                        >
                          {story.story_code}
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Title Column */}
                    <TableCell className="p-2 align-top">
                      <div className="cursor-pointer" onClick={() => handleStoryClick(story.story_code)}>
                        <div className="font-bold text-black" style={{ fontFamily: 'Georgia, serif', fontSize: '21px' }}>
                          {story.title}
                        </div>
                        {story.tagline && (
                          <div className="italic text-amber-700 mt-1" style={{ fontFamily: 'Georgia, serif', fontSize: '21px' }}>
                            {story.tagline}
                          </div>
                        )}
                        {story.excerpt && (
                          <div className="text-black mt-1" style={{ fontFamily: 'Georgia, serif', fontSize: '21px' }}>
                            {story.excerpt}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                     {/* Author Column */}
                     <TableCell className="p-2 text-center align-top" style={{ width: '220px', minWidth: '220px', maxWidth: '220px' }}>
                       <Badge 
                         className={`${getCategoryBadgeColor(story.category)} justify-center text-center px-3 py-1 rounded-sm`} 
                         style={{ fontSize: '21px', width: '195px' }}
                       >
                         {getCategoryDisplayName(story.category)}
                       </Badge>
                       <div className="text-center mt-2" style={{ fontFamily: 'Georgia, serif', fontSize: '21px' }}>{story.author}</div>
                       <MediaIcons story={story} />
                     </TableCell>
                    
                     {/* Details Column */}
                     <TableCell className="p-2 text-center align-top">
                       <div className="space-y-2">
                        <div className="text-blue-600 font-medium" style={{ fontSize: '21px' }}>
                          Reads: {story.read_count || 0}
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-lg">👍</span>
                            <span className="font-medium" style={{ fontSize: '21px' }}>{story.thumbs_up_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-lg">👎</span>
                            <span className="font-medium" style={{ fontSize: '21px' }}>{story.thumbs_down_count || 0}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-blue-600 font-medium" style={{ fontSize: '21px' }}>Updated</div>
                          <div className="text-black" style={{ fontSize: '21px' }}>{format(new Date(story.updated_at), 'M/d/yyyy')}</div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicStoriesTable;