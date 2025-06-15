import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";

type SortField = 'personal_id' | 'created_at' | 'subject' | 'replies_count';
type SortDirection = 'asc' | 'desc';

interface CommentsListHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const CommentsListHeader = ({ sortField, sortDirection, onSort }: CommentsListHeaderProps) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getButtonColor = (field: SortField) => {
    switch (field) {
      case 'personal_id':
        return 'bg-cyan-500 hover:bg-cyan-600 text-white';
      case 'created_at':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'subject':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'replies_count':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[150px] p-2 text-center">
          <Button
            onClick={() => onSort('personal_id')}
            className={`${getButtonColor('personal_id')} w-full justify-center`}
            size="sm"
          >
            <div className="flex items-center justify-center gap-2">
              Personal Code
              {getSortIcon('personal_id')}
            </div>
          </Button>
        </TableHead>
        <TableHead className="w-[150px] p-2 text-center">
          <Button
            onClick={() => onSort('created_at')}
            className={`${getButtonColor('created_at')} w-full justify-center`}
            size="sm"
          >
            <div className="flex items-center justify-center gap-2">
              Date
              {getSortIcon('created_at')}
            </div>
          </Button>
        </TableHead>
        <TableHead className="p-2 text-center">
          <Button
            onClick={() => onSort('subject')}
            className={`${getButtonColor('subject')} w-full justify-center`}
            size="sm"
          >
            <div className="flex items-center justify-center gap-2">
              Subject
              {getSortIcon('subject')}
            </div>
          </Button>
        </TableHead>
        <TableHead className="w-[100px] p-2 text-center text-orange-900 font-bold font-fun text-base">
          Replies
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CommentsListHeader;
