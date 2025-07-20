
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
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
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const getButtonColor = (field: SortField) => {
    // Use consistent green styling for all buttons
    return 'bg-green-500 hover:bg-green-600 text-white';
  };

  const headers: { label: string; field: SortField; width?: string }[] = [
    { label: "Code", field: "personal_id", width: "w-32" },
    { label: "Date", field: "created_at", width: "w-32" },
    { label: "Subject", field: "subject", width: "w-96" },
    { label: "Replies", field: "replies_count", width: "w-24" },
  ];

  return (
    <TableHeader>
      <TableRow className="bg-orange-100/50">
        {headers.map((header, index) => (
          <TableHead key={`${header.field}-${index}`} className={`p-2 text-center ${header.width || ''}`}>
            <Button
              onClick={() => onSort(header.field)}
              className={`${getButtonColor(header.field)} w-full justify-center font-fun shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98]`}
              size="sm"
            >
              <div className="flex items-center justify-center gap-2">
                {header.label}
                {getSortIcon(header.field)}
              </div>
            </Button>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default CommentsListHeader;
