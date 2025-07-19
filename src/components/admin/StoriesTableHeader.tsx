
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown, Users } from "lucide-react";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'published' | 'read_count' | 'thumbs_up_count' | 'updated_at';
type SortDirection = 'asc' | 'desc';

interface StoriesTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  showActions: boolean;
  showPublishedColumn?: boolean;
  hideAuthorColumn?: boolean;
  groupByAuthor?: boolean;
  onToggleGroupByAuthor?: () => void;
}

const StoriesTableHeader = ({ 
  sortField, 
  sortDirection, 
  onSort, 
  showActions, 
  showPublishedColumn = true,
  hideAuthorColumn = false,
  groupByAuthor = false,
  onToggleGroupByAuthor
}: StoriesTableHeaderProps) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getButtonColor = (field: SortField) => {
    switch (field) {
      case 'story_code':
        return 'bg-cyan-500 hover:bg-cyan-600 text-white';
      case 'title':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'author':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'category':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'published':
        return 'bg-indigo-500 hover:bg-indigo-600 text-white';
      case 'read_count':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'thumbs_up_count':
        return 'bg-pink-500 hover:bg-pink-600 text-white';
      case 'updated_at':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
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
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '220px', minWidth: '220px', maxWidth: '220px' }}>
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
          <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
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
          <Button
            onClick={() => onSort('category')}
            className={`${getButtonColor('category')} w-full h-6 text-xs px-1 py-1`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Category
            {getSortIcon('category')}
          </Button>
        </TableHead>
        <TableHead className="p-1 text-center bg-background border-r border-gray-200" style={{ width: '50px', minWidth: '50px', maxWidth: '50px' }}>
          <div
            className="bg-yellow-500 hover:bg-yellow-600 text-white h-6 text-xs px-1 py-1 flex items-center justify-center"
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
            <div
              className="bg-blue-500 text-white h-6 text-xs px-1 py-1 flex items-center justify-center"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', width: '100%', borderRadius: '0px' }}
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
