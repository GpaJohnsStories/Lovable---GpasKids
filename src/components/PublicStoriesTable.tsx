
import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Volume2, VideoIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Story {
  id: string;
  title: string;
  author: string;
  category: string;
  story_code: string;
  tagline: string;
  excerpt: string;
  updated_at: string;
  reading_time_minutes: number;
  audio_url?: string;
  audio_duration_seconds?: number;
  video_url?: string;
  video_duration_seconds?: number;
}

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
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [groupByAuthor, setGroupByAuthor] = useState(false);
  const [expandedAuthors, setExpandedAuthors] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const categories = ['Fun', 'Life', 'North Pole', 'World Changers'];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
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
          video_duration_seconds
        `)
        .eq('publication_status_code', 1)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = stories;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(term) ||
        story.author.toLowerCase().includes(term) ||
        story.story_code.toLowerCase().includes(term) ||
        story.tagline?.toLowerCase().includes(term) ||
        story.excerpt?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(story => story.category === selectedCategory);
    }

    setFilteredStories(filtered);
  }, [stories, searchTerm, selectedCategory]);

  const toggleAuthorExpansion = (author: string) => {
    const newExpanded = new Set(expandedAuthors);
    if (newExpanded.has(author)) {
      newExpanded.delete(author);
    } else {
      newExpanded.add(author);
    }
    setExpandedAuthors(newExpanded);
  };

  const handleStoryClick = (storyCode: string) => {
    navigate(`/story/${storyCode}`);
  };

  const MediaIcons: React.FC<{ story: Story }> = ({ story }) => {
    const hasAudio = story.audio_url;
    const hasVideo = story.video_url;
    
    if (!hasAudio && !hasVideo) return null;
    
    return (
      <div className="flex items-center gap-3 mt-1">
        {hasAudio && (
          <div className="flex items-center gap-1 text-blue-600">
            <Volume2 className="h-5 w-5" />
            <span className="text-sm font-medium">
              {formatDuration(story.audio_duration_seconds)}
            </span>
          </div>
        )}
        {hasVideo && (
          <div className="flex items-center gap-1 text-purple-600">
            <VideoIcon className="h-5 w-5" />
            <span className="text-sm font-medium">
              {formatDuration(story.video_duration_seconds)}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderGroupedByAuthor = () => {
    const groupedStories = filteredStories.reduce((acc, story) => {
      if (!acc[story.author]) {
        acc[story.author] = [];
      }
      acc[story.author].push(story);
      return acc;
    }, {} as Record<string, Story[]>);

    return Object.entries(groupedStories).map(([author, authorStories]) => {
      const isExpanded = expandedAuthors.has(author);
      
      return (
        <div key={author} className="mb-6">
          <div 
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleAuthorExpansion(author)}
          >
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h3 className="text-lg font-semibold">{author}</h3>
            <span className="text-sm text-gray-600">({authorStories.length} stories)</span>
          </div>
          
          {isExpanded && (
            <div className="mt-2 space-y-2">
              {authorStories.map((story) => (
                <Card key={story.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4" onClick={() => handleStoryClick(story.story_code)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{story.title}</h4>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">{story.author}</span>
                          <MediaIcons story={story} />
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{story.tagline}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <Badge variant="secondary">{story.category}</Badge>
                          <span>Code: {story.story_code}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{story.reading_time_minutes} min read</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500 ml-4">
                        <div>Last Updated</div>
                        <div>{format(new Date(story.updated_at), 'MM/dd/yyyy')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  const renderRegularView = () => {
    return filteredStories.map((story) => (
      <Card key={story.id} className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4" onClick={() => handleStoryClick(story.story_code)}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{story.title}</h3>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{story.author}</span>
                <MediaIcons story={story} />
              </div>
              <p className="text-gray-700 text-sm mb-2">{story.tagline}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <Badge variant="secondary">{story.category}</Badge>
                <span>Code: {story.story_code}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{story.reading_time_minutes} min read</span>
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-500 ml-4">
              <div>Last Updated</div>
              <div>{format(new Date(story.updated_at), 'MM/dd/yyyy')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search stories, authors, codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <Button
          variant={groupByAuthor ? "default" : "outline"}
          onClick={() => {
            setGroupByAuthor(!groupByAuthor);
            if (!groupByAuthor) {
              // Expand all authors when switching to grouped view
              const allAuthors = new Set(filteredStories.map(s => s.author));
              setExpandedAuthors(allAuthors);
            }
          }}
        >
          Group by Author
        </Button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredStories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No stories found matching your criteria.
          </div>
        ) : groupByAuthor ? (
          renderGroupedByAuthor()
        ) : (
          renderRegularView()
        )}
      </div>
    </div>
  );
};

export default PublicStoriesTable;
