
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'published' | 'read_count' | 'thumbs_up_count' | 'updated_at';
type SortDirection = 'asc' | 'desc';

interface StoriesTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  showActions: boolean;
  showPublishedColumn?: boolean;
  hideAuthorColumn?: boolean;
}

const StoriesTableHeader = ({ 
  sortField, 
  sortDirection, 
  onSort, 
  showActions, 
  showPublishedColumn = true,
  hideAuthorColumn = false
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
      <TableRow className="bg-background hover:bg-background">{/* Ensure row also has background */}
        <TableHead className="p-2 text-center bg-background w-24">
          <Button
            onClick={() => onSort('story_code')}
            className={`${getButtonColor('story_code')} w-full justify-center`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <div className="flex items-center justify-center gap-2">
              Code
              {getSortIcon('story_code')}
            </div>
          </Button>
        </TableHead>
        <TableHead className="p-2 text-center bg-background" style={{ minWidth: '320px' }}>
          <Button
            onClick={() => onSort('title')}
            className={`${getButtonColor('title')} w-full justify-center`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <div className="flex items-center justify-center gap-2">
              Title
              {getSortIcon('title')}
            </div>
          </Button>
        </TableHead>
        {!hideAuthorColumn && (
          <TableHead className="p-2 text-center bg-background w-28">
            <Button
              onClick={() => onSort('author')}
              className={`${getButtonColor('author')} w-full justify-center`}
              size="sm"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <div className="flex items-center justify-center gap-2">
                Author
                {getSortIcon('author')}
              </div>
            </Button>
          </TableHead>
        )}
        <TableHead className="p-2 text-center bg-background w-20">
          <Button
            onClick={() => onSort('category')}
            className={`${getButtonColor('category')} w-full justify-center`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <div className="flex items-center justify-center gap-2">
              Cat
              {getSortIcon('category')}
            </div>
          </Button>
        </TableHead>
        {showPublishedColumn && (
          <TableHead className="p-2 text-center bg-background w-16">
            <Button
              onClick={() => onSort('published')}
              className={`${getButtonColor('published')} w-full justify-center`}
              size="sm"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <div className="flex items-center justify-center gap-2">
                Publ
                {getSortIcon('published')}
              </div>
            </Button>
          </TableHead>
        )}
        <TableHead className="p-2 text-center bg-background w-24">
          <Button
            onClick={() => onSort('read_count')}
            className={`${getButtonColor('read_count')} w-full justify-center`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <div className="flex items-center justify-center gap-2">
              Stats
              {getSortIcon('read_count')}
            </div>
          </Button>
        </TableHead>
        <TableHead className="p-2 text-center bg-background w-28">
          <Button
            onClick={() => onSort('updated_at')}
            className={`${getButtonColor('updated_at')} w-full justify-center`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <div className="flex items-center justify-center gap-2">
              Updated
              {getSortIcon('updated_at')}
            </div>
          </Button>
        </TableHead>
        {showActions && (
          <TableHead className="p-2 text-center bg-background w-32">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white w-full justify-center"
              size="sm"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Actions
            </Button>
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default StoriesTableHeader;
