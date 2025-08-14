import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, ArrowUp, ArrowDown, ChevronDown, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getCategoryShortName } from "@/utils/categoryUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'read_count' | 'updated_at';
type SortDirection = 'asc' | 'desc';
type CategoryFilter = 'all' | 'Fun' | 'Life' | 'North Pole' | 'World Changers';

interface Story {
  id: string;
  story_code: string;
  title: string;
  author: string;
  category: string;
  read_count: number;
  updated_at: string;
  created_at: string;
  tagline?: string;
  excerpt?: string;
  photo_link_1?: string;
  photo_alt_1?: string;
}

interface PublicStoriesTableProps {
  onEditBio?: (authorName: string) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const PublicStoriesTable = ({ onEditBio, searchTerm = '', onSearchChange }: PublicStoriesTableProps) => {
  const [sortField, setSortField] = useState<SortField>('read_count');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(localSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  const { data: stories, isLoading } = useQuery({
    queryKey: ['public-stories', sortField, sortDirection, categoryFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('stories')
        .select('id, story_code, title, author, category, read_count, updated_at, created_at, tagline, excerpt, photo_link_1, photo_alt_1')
        .eq('published', 'Y')
        .not('category', 'eq', 'WebText')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      // Apply category filter
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      // Apply search filter
      if (searchTerm && searchTerm.trim() !== '') {
        const searchQuery = `%${searchTerm.trim()}%`;
        query = query.or(
          `title.ilike.${searchQuery},content.ilike.${searchQuery},excerpt.ilike.${searchQuery},tagline.ilike.${searchQuery},author.ilike.${searchQuery}`
        );
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter stories based on current time for public library
      const now = new Date();
      return data.filter(story => {
        const storyDate = new Date(story.updated_at);
        return storyDate <= now;
      });
    },
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
      case 'all': return 'Show All';
      case 'Fun': return 'Fun Stuff';
      case 'Life': return 'Life Lessons';
      case 'North Pole': return 'North Pole';
      case 'World Changers': return 'World Changers';
      default: return category;
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

  return (
    <TooltipProvider>
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
                className="pl-10 pr-10 py-2 text-sm border-2 focus:border-green-700 rounded-lg placeholder:font-bold search-input-amber"
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
            
            {/* Search Results Counter */}
            {searchTerm && searchTerm.trim() !== '' && (
              <div className="text-center mt-3">
                <p className="text-sm text-green-700 font-system">
                  Found {stories?.length || 0} stories matching '{searchTerm}'
                </p>
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-green-700 text-green-700 hover:bg-green-50"
                >
                  Clear Search Results
                </Button>
              </div>
            )}
          </div>
          {isLoading ? (
            <div className="text-center py-8 text-black-system">
              <BookOpen className="h-8 w-8 animate-spin text-green-700 mx-auto mb-4" />
              <p>Loading stories...</p>
            </div>
          ) : (
            <div className="border border-green-700 rounded-lg overflow-hidden">
              <Table>
                  <TableHeader className="table-header-no-border">
                    <TableRow className="table-header-no-border bg-background hover:bg-background">
                      <TableHead className="p-1 text-center bg-background border-r border-green-700 min-w-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleSort('title')}
                              className="bg-green-700 hover:bg-green-800 text-white w-full h-6 text-xs px-1 py-1 font-system"
                            >
                              Title
                              {getSortIcon('title')}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Click to sort by Title</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead className="p-1 text-center bg-background border-r border-green-700 w-24 min-w-24 max-w-24">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleSort('author')}
                              className="bg-green-700 hover:bg-green-800 text-white w-full h-6 text-xs px-1 py-1 font-system"
                            >
                              Author
                              {getSortIcon('author')}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Click to sort by Author</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead className="p-1 text-center bg-background w-32 min-w-32 max-w-32">
                        <div className="text-white bg-green-700 h-6 text-xs px-1 py-1 font-system flex items-center justify-center">
                          Details
                        </div>
                      </TableHead>
                     </TableRow>
                  </TableHeader>
                <TableBody>
                  {stories?.map((story) => (
                     <TableRow key={story.id} className="table-row-green">
                       <TableCell className="text-black-system table-cell-top">
                         <div className="flex items-start gap-3">
                           {story.photo_link_1 && (
                             <div className="flex-shrink-0 flex flex-col items-center">
                               <Tooltip>
                                 <TooltipTrigger asChild>
                                   <img
                                     src={story.photo_link_1}
                                     alt={story.photo_alt_1 || `Photo for ${story.title}`}
                                     className="w-[100px] h-[100px] rounded-lg border-2 border-white shadow-lg object-cover cursor-pointer"
                                     onError={(e) => {
                                       e.currentTarget.style.display = 'none';
                                     }}
                                   />
                                 </TooltipTrigger>
                                 <TooltipContent className="story-photo-tooltip">
                                   <p>{story.photo_alt_1 || `Photo for ${story.title}`}</p>
                                 </TooltipContent>
                               </Tooltip>
                               <div className="font-mono text-sm font-bold text-black-system mt-2">
                                 {story.story_code}
                               </div>
                             </div>
                           )}
                           <div className="flex-1">
                             <Link 
                               to={`/story/${story.story_code}`} 
                               className="hover:text-red-600 transition-colors duration-300 font-medium text-base"
                             >
                               {story.title}
                             </Link>
                             {story.tagline && (
                               <div className="text-sm font-medium text-amber-700 italic mt-1">
                                 {story.tagline}
                               </div>
                             )}
                             {story.excerpt && (
                               <div className="text-sm text-amber-600 mt-1 leading-relaxed">
                                 {story.excerpt}
                               </div>
                             )}
                           </div>
                         </div>
                       </TableCell>
                       <TableCell className="text-black-system table-cell-top">
                         <div className="flex flex-col items-center gap-1">
                           <span className="text-sm">{story.author}</span>
                           {onEditBio && (
                             <Button
                               onClick={() => onEditBio(story.author)}
                               className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2 py-1 h-auto"
                               size="sm"
                             >
                               Bio
                             </Button>
                           )}
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
                             <div className="text-xs text-gray-600 font-medium">Updated</div>
                             <div className="text-xs text-black-system">{new Date(story.updated_at).toLocaleDateString()}</div>
                           </div>
                         </div>
                       </TableCell>
                     </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default PublicStoriesTable;
