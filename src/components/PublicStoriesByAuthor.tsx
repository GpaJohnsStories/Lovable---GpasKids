import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Volume2, VideoIcon, ChevronDown, Check, X, Glasses, ArrowUp, ArrowDown, User } from "lucide-react";
import LoadingSpinner from '@/components/LoadingSpinner';

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

const PublicStoriesByAuthor = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .in('publication_status_code', [0, 1])
        .neq('category', 'WebText')
        .order('author', { ascending: true });

      if (error) {
        console.error('Error fetching stories:', error);
        return;
      }

      setStories(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group and filter stories
  const groupedStories = useMemo(() => {
    // First apply search and media filters
    let filteredStories = stories.filter(story => {
      const searchMatch = searchTerm === '' || 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.story_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

      const mediaMatch = (() => {
        const hasAudio = story.audio_url;
        const hasVideo = story.video_url;
        
        switch (mediaFilter) {
          case 'text': return !hasAudio && !hasVideo;
          case 'audio': return hasAudio && !hasVideo;
          case 'video': return hasVideo && !hasAudio;
          case 'both': return hasAudio && hasVideo;
          default: return true;
        }
      })();

      return searchMatch && mediaMatch;
    });

    // Group by author
    const grouped = filteredStories.reduce((acc: Record<string, Story[]>, story) => {
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
  }, [stories, searchTerm, mediaFilter]);

  const handleStoryClick = (story: Story) => {
    navigate(`/story/${story.story_code}`);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setMediaFilter('all');
  };

  const getMediaFilterDisplayName = (filter: MediaFilter): string => {
    switch (filter) {
      case 'all': return 'All Media';
      case 'text': return 'Text Only';
      case 'audio': return 'Audio Only';
      case 'video': return 'Video Only';
      case 'both': return 'Audio + Video';
      default: return 'All Media';
    }
  };

  const getCategoryBadgeColor = (category: string): string => {
    switch (category) {
      case 'Fun': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Life': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'North Pole': return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'World Changers': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getCategoryDisplayName = (category: string): string => {
    return category;
  };

  // Media icons component
  const MediaIcons = ({ story }: { story: Story }) => (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {story.reading_time_minutes && (
        <div className="flex items-center gap-1">
          <Glasses className="w-3 h-3" />
          <span>{story.reading_time_minutes}m</span>
        </div>
      )}
      {story.audio_url && (
        <div className="flex items-center gap-1">
          <Volume2 className="w-3 h-3" />
          <span>{formatDuration(story.audio_duration_seconds)}</span>
        </div>
      )}
      {story.video_url && (
        <div className="flex items-center gap-1">
          <VideoIcon className="w-3 h-3" />
          <span>{formatDuration(story.video_duration_seconds)}</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalAuthors = Object.keys(groupedStories).length;
  const totalStories = Object.values(groupedStories).flat().length;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    placeholder="Search stories, authors, codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-8"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[140px] justify-between">
                      {getMediaFilterDisplayName(mediaFilter)}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[140px]">
                    {(['all', 'text', 'audio', 'video', 'both'] as MediaFilter[]).map((filter) => (
                      <DropdownMenuItem 
                        key={filter} 
                        onSelect={() => setMediaFilter(filter)}
                        className="flex items-center justify-between"
                      >
                        {getMediaFilterDisplayName(filter)}
                        {mediaFilter === filter && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {totalStories} stories by {totalAuthors} authors
            </div>
          </div>
        </CardContent>
      </Card>

      {totalAuthors === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No stories found</p>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedStories).sort(([a], [b]) => a.localeCompare(b)).map(([author, authorStories]) => (
            <Card key={author}>
              <CardContent className="p-0">
                {/* Full-width blue banner for author */}
                <div className="bg-blue-600 text-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      {author}
                    </h2>
                    <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-500">
                      {authorStories.length} {authorStories.length === 1 ? 'story' : 'stories'}
                    </Badge>
                  </div>
                </div>

                {/* Stories table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Code</TableHead>
                        <TableHead>Story</TableHead>
                        <TableHead className="w-[120px]">Category</TableHead>
                        <TableHead className="w-[150px]">Details</TableHead>
                        <TableHead className="w-[100px]">Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {authorStories.map((story) => (
                        <TableRow 
                          key={story.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleStoryClick(story)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {story.photo_link_1 && (
                                <img 
                                  src={story.photo_link_1} 
                                  alt="Story thumbnail"
                                  className="w-8 h-8 rounded object-cover"
                                />
                              )}
                              <span className="font-mono text-sm">{story.story_code}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-sm leading-tight">{story.title}</div>
                              {story.tagline && (
                                <div className="text-xs text-muted-foreground italic leading-tight">
                                  {story.tagline}
                                </div>
                              )}
                              {story.excerpt && (
                                <div className="text-xs text-muted-foreground leading-tight line-clamp-2">
                                  {story.excerpt}
                                </div>
                              )}
                              <MediaIcons story={story} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getCategoryBadgeColor(story.category)}>
                              {getCategoryDisplayName(story.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs space-y-1">
                              <div className="flex items-center gap-2">
                                <span>👍 {story.thumbs_up_count || 0}</span>
                                <span>👎 {story.thumbs_down_count || 0}</span>
                                <span>👌 {story.ok_count || 0}</span>
                              </div>
                              <div>📖 {story.read_count || 0} reads</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(story.updated_at), 'MMM d, yyyy')}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicStoriesByAuthor;