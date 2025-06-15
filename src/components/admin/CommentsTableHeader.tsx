
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Comment = Database['public']['Tables']['comments']['Row'];
type SortField = keyof Omit<Comment, 'author_email' | 'parent_id' | 'updated_at'> | 'actions';
type SortDirection = 'asc' | 'desc';

interface CommentsTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const CommentsTableHeader = ({ sortField, sortDirection, onSort }: CommentsTableHeaderProps) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const headers: { label: string; field: SortField, className?: string }[] = [
    { label: "Personal Code", field: "personal_id", className: "w-[150px]" },
    { label: "Date", field: "created_at", className: "w-[200px]" },
    { label: "Subject", field: "subject", className: "w-[200px]" },
    { label: "Content", field: "content" },
    { label: "Status", field: "status", className: "w-[120px]" },
    { label: "Actions", field: "actions", className: "w-[250px]" },
  ];

  return (
    <TableHeader>
      <TableRow>
        {headers.map(header => (
          <TableHead key={header.field} className={header.className}>
            {header.field === 'actions' ? (
              <span className="font-bold">{header.label}</span>
            ) : (
              <Button
                variant="ghost"
                onClick={() => onSort(header.field)}
                className="font-bold p-0 hover:bg-transparent"
              >
                {header.label}
                {getSortIcon(header.field)}
              </Button>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default CommentsTableHeader;
