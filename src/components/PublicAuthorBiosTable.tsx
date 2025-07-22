
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUp, ArrowDown, User, Globe, Calendar, BookOpen } from "lucide-react";
import { createSafeHtml } from "@/utils/xssProtection";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AuthorBio {
  id: string;
  author_name: string;
  bio_content: string | null;
  born_date: string | null;
  died_date: string | null;
  native_country_name: string | null;
  native_language: string | null;
  buddys_comments: string | null;
}

interface PublicAuthorBiosTableProps {
  bios: AuthorBio[];
  onViewBio: (bio: AuthorBio) => void;
  isLoading?: boolean;
}

interface Story {
  id: string;
  title: string;
  tagline?: string;
  author: string;
}

type SortField = 'author_name' | 'native_country_name' | 'born_date';
type SortDirection = 'asc' | 'desc';

const PublicAuthorBiosTable = ({ bios, onViewBio, isLoading = false }: PublicAuthorBiosTableProps) => {
  const [sortField, setSortField] = useState<SortField>('author_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [storiesByAuthor, setStoriesByAuthor] = useState<Record<string, Story[]>>({});

  // Fetch stories for all authors
  useEffect(() => {
    const fetchStoriesForAuthors = async () => {
      if (bios.length === 0) return;

      const authorNames = bios.map(bio => bio.author_name);
      
      try {
        const { data: stories, error } = await supabase
          .from('stories')
          .select('id, title, tagline, author')
          .in('author', authorNames)
          .eq('published', 'Y')
          .not('category', 'eq', 'WebText')
          .order('title', { ascending: true });

        if (error) {
          console.error('Error fetching stories:', error);
          return;
        }

        // Group stories by author
        const groupedStories: Record<string, Story[]> = {};
        stories?.forEach(story => {
          if (!groupedStories[story.author]) {
            groupedStories[story.author] = [];
          }
          groupedStories[story.author].push(story);
        });

        setStoriesByAuthor(groupedStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStoriesForAuthors();
  }, [bios]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const formatLifeSpan = (bio: AuthorBio) => {
    if (!bio.born_date && !bio.died_date) return '—';
    
    const born = bio.born_date ? new Date(bio.born_date).getFullYear() : '?';
    const died = bio.died_date ? new Date(bio.died_date).getFullYear() : 'present';
    
    return `${born} - ${died}`;
  };

  const getCountryLanguageDisplay = (bio: AuthorBio) => {
    const parts = [];
    if (bio.native_country_name) parts.push(bio.native_country_name);
    if (bio.native_language) parts.push(bio.native_language);
    return parts.length > 0 ? parts.join(' • ') : '—';
  };

  const getBioPreview = (bioContent: string | null) => {
    if (!bioContent) return 'No biography available';
    
    // Create safe HTML and extract text content for preview
    const safeHtml = createSafeHtml(bioContent);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = safeHtml.__html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.substring(0, 100) + (textContent.length > 100 ? '...' : '');
  };

  const renderAuthorStories = (authorName: string) => {
    const authorStories = storiesByAuthor[authorName] || [];
    
    if (authorStories.length === 0) {
      return <div className="text-xs text-amber-600 italic">No published stories</div>;
    }

    return (
      <div className="space-y-1">
        {authorStories.map(story => (
          <div key={story.id} className="text-xs">
            <div className="font-medium text-amber-800">{story.title}</div>
            {story.tagline && (
              <div className="text-amber-600 italic">{story.tagline}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const sortedBios = [...bios].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'born_date') {
      aValue = a.born_date ? new Date(a.born_date) : new Date(0);
      bValue = b.born_date ? new Date(b.born_date) : new Date(0);
    } else if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase() || '';
      bValue = bValue?.toLowerCase() || '';
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-800 text-center">
            Meet Our Story Authors
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-amber-700 text-lg">Loading author biographies...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-800 text-center">
            Meet Our Story Authors
          </CardTitle>
          <p className="text-amber-700 text-center text-lg leading-relaxed mt-2">
            Discover the talented authors who bring Grandpa's stories to life. 
            Click "View Bio" to learn more about each author's background and journey.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-background hover:bg-background">
                  <TableHead className="p-1 text-center bg-background border-r border-gray-200">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleSort('author_name')}
                          className="bg-green-500 hover:bg-green-600 text-white w-full h-6 text-xs px-1 py-1"
                          size="sm"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          <User className="h-3 w-3 mr-1" />
                          Author
                          {getSortIcon('author_name')}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Click to sort by Author Name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="p-1 text-center bg-background border-r border-gray-200">
                    <div className="bg-green-500 text-white w-full h-6 text-xs px-1 py-1 flex items-center justify-center rounded"
                         style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Biography & Stories
                    </div>
                  </TableHead>
                  <TableHead className="p-1 text-center bg-background border-r border-gray-200">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleSort('native_country_name')}
                          className="bg-green-500 hover:bg-green-600 text-white w-full h-6 text-xs px-1 py-1"
                          size="sm"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          Origin
                          {getSortIcon('native_country_name')}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Click to sort by Country & Language</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="p-1 text-center bg-background border-r border-gray-200">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleSort('born_date')}
                          className="bg-green-500 hover:bg-green-600 text-white w-full h-6 text-xs px-1 py-1"
                          size="sm"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Life Span
                          {getSortIcon('born_date')}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Click to sort by Birth Date</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="p-1 text-center bg-background">
                    <div className="bg-green-500 text-white w-full h-6 text-xs px-1 py-1 flex items-center justify-center rounded"
                         style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Actions
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBios.map((bio) => (
                  <TableRow key={bio.id} className="hover:bg-amber-50/50">
                    <TableCell 
                      className="font-semibold text-amber-900 align-top"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
                    >
                      {bio.author_name}
                    </TableCell>
                    <TableCell 
                      className="max-w-md align-top"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
                    >
                      <div className="space-y-3">
                        <div className="text-sm text-amber-700 leading-relaxed">
                          {getBioPreview(bio.bio_content)}
                        </div>
                        <div className="border-t border-amber-200 pt-2">
                          <div className="text-xs font-semibold text-amber-800 mb-1 flex items-center">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Published Stories:
                          </div>
                          {renderAuthorStories(bio.author_name)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell 
                      className="text-amber-700 align-top"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
                    >
                      <div className="text-sm">
                        {getCountryLanguageDisplay(bio)}
                      </div>
                    </TableCell>
                    <TableCell 
                      className="text-amber-700 align-top"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
                    >
                      <div className="text-sm">
                        {formatLifeSpan(bio)}
                      </div>
                    </TableCell>
                    <TableCell 
                      className="align-top"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
                    >
                      <Button
                        size="sm"
                        onClick={() => onViewBio(bio)}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Bio
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {sortedBios.length === 0 && (
            <div className="text-center py-8">
              <p className="text-amber-700 text-lg">
                No author biographies are currently available.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default PublicAuthorBiosTable;
