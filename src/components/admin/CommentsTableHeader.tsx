
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

  const getButtonColor = (field: SortField) => {
    switch (field) {
      case 'personal_id':
        return 'bg-cyan-500 hover:bg-cyan-600 text-white';
      case 'subject':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'content':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'status':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'created_at':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const headers: { label: string; field: SortField }[] = [
    { label: "Personal Code", field: "personal_id" },
    { label: "Date", field: "created_at" },
    { label: "Subject", field: "subject" },
    { label: "Content", field: "content" },
    { label: "Status", field: "status" },
    { label: "Actions", field: "actions" },
  ];

  return (
    <TableHeader>
      <TableRow>
        {headers.map(header => (
          <TableHead key={header.field} className="p-2 text-center">
            {header.field === 'actions' ? (
              <span className="font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>{header.label}</span>
            ) : (
              <Button
                onClick={() => onSort(header.field)}
                className={`${getButtonColor(header.field)} w-full justify-center`}
                size="sm"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <div className="flex items-center justify-center gap-2">
                  {header.label}
                  {getSortIcon(header.field)}
                </div>
              </Button>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default CommentsTableHeader;
