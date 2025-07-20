
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown, Users, Plus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'published' | 'read_count' | 'thumbs_up_count' | 'updated_at';
type SortDirection = 'asc' | 'desc';
type CategoryFilter = 'all' | 'Fun' | 'Life' | 'North Pole' | 'World Changers' | 'WebText';

interface StoriesTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  showActions: boolean;
  showPublishedColumn?: boolean;
  hideAuthorColumn?: boolean;
  groupByAuthor?: boolean;
  onToggleGroupByAuthor?: () => void;
  onCreateStory?: () => void;
  categoryFilter?: CategoryFilter;
  onCategoryFilter?: (filter: CategoryFilter) => void;
  showPublishedOnly?: boolean;
}

const StoriesTableHeader = ({ 
  sortField, 
  sortDirection, 
  onSort, 
  showActions, 
  showPublishedColumn = true,
  hideAuthorColumn = false,
  groupByAuthor = false,
  onToggleGroupByAuthor,
  onCreateStory,
  categoryFilter = 'all',
  onCategoryFilter,
  showPublishedOnly = false
}: StoriesTableHeaderProps) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getButtonColor = (field: SortField) => {
    // Use consistent green styling for all buttons
    return 'bg-green-500 hover:bg-green-600 text-white';
  };

  // Define category options based on context
  const getCategoryOptions = (): CategoryFilter[] => {
    const baseCategories: CategoryFilter[] = ['all', 'Fun', 'Life', 'North Pole', 'World Changers'];
    
    // Include WebText ONLY for admin view (when showPublishedOnly is false)
    // Exclude WebText from public library (when showPublishedOnly is true)
    if (showPublishedOnly) {
      return baseCategories; // Public library - no WebText
    }
    
    return [...baseCategories, 'WebText']; // Admin library - include WebText
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
      case 'WebText':
        return 'WebText';
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
        return 'bg-gradient-to-b from-purple-400 to-purple-600 text-white border-purple-500';
      case 'WebText':
        return 'bg-gradient-to-b from-gray-400 to-gray-600 text-white border-gray-500';
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

  return (
    <TableHeader>
      <TableRow className="bg-background hover:bg-background">
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>
          <Button
            onClick={() => onSort('story_code')}
            className={`${getButtonColor('story_code')} w-full h-6 text-xs px-1 py-1`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Code
            {getSortIcon('story_code')}
          </Button>
        </TableHead>
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '280px', minWidth: '280px', maxWidth: '280px' }}>
          <Button
            onClick={() => onSort('title')}
            className={`${getButtonColor('title')} w-full h-6 text-xs px-1 py-1`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Title
            {getSortIcon('title')}
          </Button>
        </TableHead>
        {!hideAuthorColumn && (
          <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
            <Button
              onClick={onToggleGroupByAuthor || (() => onSort('author'))}
              className={`${groupByAuthor ? 'bg-green-600 hover:bg-green-700' : getButtonColor('author')} w-full h-6 text-xs px-1 py-1 flex items-center justify-center gap-1`}
              size="sm"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {groupByAuthor ? (
                <>
                  <Users className="h-3 w-3" />
                  Group
                </>
              ) : (
                <>
                  Author
                  {getSortIcon('author')}
                </>
              )}
            </Button>
          </TableHead>
        )}
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={`${getButtonColor('category')} w-full h-6 text-xs px-1 py-1 flex items-center justify-center gap-1`}
                size="sm"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {getCurrentCategoryDisplay()}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="center" 
              className="bg-white border border-gray-200 shadow-lg rounded-md z-50"
              style={{ minWidth: '120px' }}
            >
              {getCategoryOptions().map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => {
                    if (category === 'all') {
                      onSort('category');
                    } else {
                      onCategoryFilter?.(category);
                    }
                  }}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div 
                      className={`${getCategoryColor(category)} px-2 py-1 rounded text-xs font-medium border`}
                      style={{ minWidth: '80px', textAlign: 'center' }}
                    >
                      {getCategoryDisplayName(category)}
                    </div>
                    {categoryFilter === category && (
                      <div className="text-green-600 font-bold">✓</div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableHead>
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '50px', minWidth: '50px', maxWidth: '50px' }}>
          <div
            className="bg-gradient-to-b from-orange-400 to-orange-600 text-white h-6 text-xs px-1 py-1 flex items-center justify-center"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', width: '100%', borderRadius: '0px' }}
            title="Copyright Status: ©=Full Copyright, O=Open, S=Limited Sharing"
          >
            ©
          </div>
        </TableHead>
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
          <Button
            onClick={() => onSort('read_count')}
            className={`${getButtonColor('read_count')} w-full h-6 text-xs px-1 py-1`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Stats
            {getSortIcon('read_count')}
          </Button>
        </TableHead>
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>
          <Button
            onClick={() => onSort('updated_at')}
            className={`${getButtonColor('updated_at')} w-full h-6 text-xs px-1 py-1`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Updated
            {getSortIcon('updated_at')}
          </Button>
        </TableHead>
        {showActions && (
          <TableHead className="p-1 text-center bg-background" style={{ width: '170px', minWidth: '170px', maxWidth: '170px' }}>
            <div className="flex gap-1">
              <div
                className="bg-blue-500 text-white h-6 text-xs px-1 py-1 flex items-center justify-center flex-1"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', borderRadius: '0px' }}
              >
                Actions
              </div>
              {onCreateStory && (
                <Button
                  onClick={onCreateStory}
                  className="bg-green-500 hover:bg-green-600 text-white h-6 text-xs px-1 py-1 flex items-center justify-center gap-1"
                  size="sm"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  title="Create New Story"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default StoriesTableHeader;
