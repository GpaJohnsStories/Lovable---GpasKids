
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'read_count' | 'created_at';
type SortDirection = 'asc' | 'desc';

interface StoriesTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  showActions: boolean;
}

const StoriesTableHeader = ({ sortField, sortDirection, onSort, showActions }: StoriesTableHeaderProps) => {
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
      case 'read_count':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'created_at':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="p-2">
          <Button
            onClick={() => onSort('story_code')}
            className={`${getButtonColor('story_code')} w-full justify-between`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Code
            {getSortIcon('story_code')}
          </Button>
        </TableHead>
        <TableHead className="p-2">
          <Button
            onClick={() => onSort('title')}
            className={`${getButtonColor('title')} w-full justify-between`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Title
            {getSortIcon('title')}
          </Button>
        </TableHead>
        <TableHead className="p-2">
          <Button
            onClick={() => onSort('author')}
            className={`${getButtonColor('author')} w-full justify-between`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Author
            {getSortIcon('author')}
          </Button>
        </TableHead>
        <TableHead className="p-2">
          <Button
            onClick={() => onSort('category')}
            className={`${getButtonColor('category')} w-full justify-between`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Category
            {getSortIcon('category')}
          </Button>
        </TableHead>
        <TableHead className="p-2">
          <Button
            onClick={() => onSort('read_count')}
            className={`${getButtonColor('read_count')} w-full justify-between`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Read Count
            {getSortIcon('read_count')}
          </Button>
        </TableHead>
        <TableHead className="p-2">
          <Button
            onClick={() => onSort('created_at')}
            className={`${getButtonColor('created_at')} w-full justify-between`}
            size="sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Created
            {getSortIcon('created_at')}
          </Button>
        </TableHead>
        {showActions && (
          <TableHead style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>Actions</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default StoriesTableHeader;
