
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  return (
    <TableHeader>
      <TableRow className="bg-orange-100/50">
        <TableHead className="text-center font-bold text-orange-900">
          <Button 
            variant="ghost" 
            className="font-bold text-orange-900 hover:bg-orange-200/50 font-fun"
            onClick={() => onSort('personal_id')}
          >
            Author
            {getSortIcon('personal_id')}
          </Button>
        </TableHead>
        <TableHead className="text-center font-bold text-orange-900">
          <Button 
            variant="ghost" 
            className="font-bold text-orange-900 hover:bg-orange-200/50 font-fun"
            onClick={() => onSort('created_at')}
          >
            Date
            {getSortIcon('created_at')}
          </Button>
        </TableHead>
        <TableHead className="font-bold text-orange-900">
          <Button 
            variant="ghost" 
            className="font-bold text-orange-900 hover:bg-orange-200/50 font-fun"
            onClick={() => onSort('subject')}
          >
            Subject
            {getSortIcon('subject')}
          </Button>
        </TableHead>
        <TableHead className="text-right font-bold text-orange-900">
          <Button 
            variant="ghost" 
            className="font-bold text-orange-900 hover:bg-orange-200/50 font-fun"
            onClick={() => onSort('replies_count')}
          >
            Replies
            {getSortIcon('replies_count')}
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CommentsListHeader;
