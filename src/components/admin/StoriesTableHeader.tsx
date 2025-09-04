
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown, Users, Plus, ChevronDown, ThumbsUp, ThumbsDown, BookOpen, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'published' | 'read_count' | 'thumbs_up_count' | 'thumbs_down_count' | 'ok_count' | 'reading_time_minutes' | 'updated_at' | 'copyright_status' | 'publication_status_code';
type SortDirection = 'asc' | 'desc';
type CategoryFilter = 'all' | 'Fun' | 'Life' | 'North Pole' | 'World Changers' | 'WebText' | 'Stories' | 'BioText' | 'Admin';

interface StoriesTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onStatsSort?: (field: SortField, direction: SortDirection) => void;
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
  onStatsSort,
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
    // Include WebText and BioText ONLY for admin view (when showPublishedOnly is false)
    // Exclude WebText and BioText from public library (when showPublishedOnly is true)
    if (showPublishedOnly) {
      return ['all', 'Fun', 'Life', 'North Pole', 'World Changers']; // Public library - no WebText or BioText
    }
    
    return ['all', 'WebText', 'Admin', 'Stories', 'Fun', 'Life', 'North Pole', 'World Changers', 'BioText']; // Admin library - WebText after Show All
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
      case 'Stories':
        return 'Stories';
      case 'BioText':
        return 'BioText';
      case 'Admin':
        return 'Admin';
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
        return 'bg-gradient-to-b from-red-400 to-red-600 text-white border-red-500';
      case 'World Changers':
        return 'bg-gradient-to-b from-purple-400 to-purple-600 text-white border-purple-500';
      case 'WebText':
        return 'bg-gradient-to-b from-amber-700 to-amber-900 text-white border-amber-900';
      case 'Stories':
        return 'bg-gradient-to-b from-emerald-600 to-emerald-800 text-white border-emerald-700';
      case 'BioText':
        return 'bg-gradient-to-b from-yellow-800 to-yellow-900 text-white border-yellow-800';
      case 'Admin':
        return 'bg-gradient-to-b from-yellow-400 to-yellow-600 border-[#eab308] text-[#3b82f6]';
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

  // Stats dropdown helper functions
  interface StatsOption {
    field: SortField;
    direction: SortDirection;
    label: string;
    icon: React.ReactNode;
    color: string;
  }

  const getStatsOptions = (): StatsOption[] => {
    return [
      { field: 'thumbs_up_count', direction: 'desc', label: 'Thumbs Up ↑', icon: <ThumbsUp className="h-3 w-3" />, color: 'text-green-600' },
      { field: 'thumbs_up_count', direction: 'asc', label: 'Thumbs Up ↓', icon: <ThumbsUp className="h-3 w-3" />, color: 'text-green-600' },
      { field: 'thumbs_down_count', direction: 'desc', label: 'Thumbs Down ↑', icon: <ThumbsDown className="h-3 w-3" />, color: 'text-red-600' },
      { field: 'thumbs_down_count', direction: 'asc', label: 'Thumbs Down ↓', icon: <ThumbsDown className="h-3 w-3" />, color: 'text-red-600' },
      { field: 'ok_count', direction: 'desc', label: '👌 Okay ↑', icon: <span className="text-xs">👌</span>, color: 'text-yellow-600' },
      { field: 'ok_count', direction: 'asc', label: '👌 Okay ↓', icon: <span className="text-xs">👌</span>, color: 'text-yellow-600' },
      { field: 'read_count', direction: 'desc', label: 'Readers ↑', icon: <BookOpen className="h-3 w-3" />, color: 'text-blue-600' },
      { field: 'read_count', direction: 'asc', label: 'Readers ↓', icon: <BookOpen className="h-3 w-3" />, color: 'text-blue-600' },
      { field: 'reading_time_minutes', direction: 'desc', label: 'Read Time ↑', icon: <Clock className="h-3 w-3" />, color: 'text-black' },
      { field: 'reading_time_minutes', direction: 'asc', label: 'Read Time ↓', icon: <Clock className="h-3 w-3" />, color: 'text-black' },
    ];
  };

  const isStatsOptionActive = (option: StatsOption): boolean => {
    return sortField === option.field && sortDirection === option.direction;
  };

  return (
    <TableHeader>
      <TableRow className="bg-background hover:bg-background">
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '70px', minWidth: '70px', maxWidth: '70px' }}>
          <Button
            onClick={() => onSort('story_code')}
            className={`${getButtonColor('story_code')} w-full h-6 text-xs px-1 py-1 admin-table-font`}
            size="sm"
          >
            Code
            {getSortIcon('story_code')}
          </Button>
        </TableHead>
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '280px', minWidth: '280px', maxWidth: '280px' }}>
          <Button
            onClick={() => onSort('title')}
            className={`${getButtonColor('title')} w-full h-6 text-xs px-1 py-1 admin-table-font`}
            size="sm"
          >
            Title
            {getSortIcon('title')}
          </Button>
        </TableHead>
        {!hideAuthorColumn && (
          <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
            <Button
              onClick={onToggleGroupByAuthor || (() => onSort('author'))}
              className={`${groupByAuthor ? 'bg-green-600 hover:bg-green-700' : getButtonColor('author')} w-full h-6 text-xs px-1 py-1 flex items-center justify-center gap-1 admin-table-font`}
              size="sm"
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
                className={`${getButtonColor('category')} w-full h-6 text-xs px-1 py-1 flex items-center justify-center gap-1 admin-table-font`}
                size="sm"
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
                  className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 admin-table-font"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div 
                      className={`${getCategoryColor(category)} px-3 py-1 rounded-full text-xs font-medium border shadow-sm hover:shadow-md transition-shadow`}
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
          <Button
            onClick={() => onSort('copyright_status')}
            className={`${getButtonColor('copyright_status')} w-full h-6 text-xs px-1 py-1 admin-table-font`}
            size="sm"
            title="Copyright Status: ©=Full Copyright, O=Open, S=Limited Sharing"
          >
            ©
            {getSortIcon('copyright_status')}
          </Button>
        </TableHead>
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={`${getButtonColor('read_count')} w-full h-6 text-xs px-1 py-1 flex items-center justify-center gap-1 admin-table-font`}
                size="sm"
              >
                Stats
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="center" 
              className="bg-white border border-gray-200 shadow-lg rounded-md z-50 max-h-64 overflow-y-auto"
              style={{ minWidth: '140px' }}
            >
              {getStatsOptions().map((option, index) => (
                <DropdownMenuItem
                  key={`${option.field}-${option.direction}-${index}`}
                  onClick={() => {
                    if (onStatsSort) {
                      onStatsSort(option.field, option.direction);
                    } else {
                      onSort(option.field);
                    }
                  }}
                  className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 admin-table-font"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={`flex items-center gap-1 ${option.color} font-bold`}>
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                    {isStatsOptionActive(option) && (
                      <div className="text-green-600 font-bold ml-auto">✓</div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableHead>
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>
          <Button
            onClick={() => onSort('updated_at')}
            className={`${getButtonColor('updated_at')} w-full h-6 text-xs px-1 py-1 admin-table-font`}
            size="sm"
          >
            Updated
            {getSortIcon('updated_at')}
          </Button>
        </TableHead>
        {showActions && (
          <TableHead className="p-1 text-center bg-background" style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
            <div
              className="bg-blue-500 text-white h-6 text-xs px-1 py-1 flex items-center justify-center admin-table-font"
              style={{ borderRadius: '0px' }}
            >
              Actions
            </div>
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default StoriesTableHeader;
