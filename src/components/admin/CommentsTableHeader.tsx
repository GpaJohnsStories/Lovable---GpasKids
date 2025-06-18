
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Comment = Database['public']['Tables']['comments']['Row'];
type SortField = keyof Omit<Comment, 'author_email' | 'parent_id' | 'updated_at' | 'content'> | 'actions';
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
      case 'status':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'created_at':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const headers: { label: string; field: SortField; isAction?: boolean; width?: string }[] = [
    { label: "Code", field: "personal_id", width: "w-20" },
    { label: "Date", field: "created_at", width: "w-32" },
    { label: "Subject", field: "subject", width: "w-96" },
    { label: "Status", field: "status", width: "w-28" },
    { label: "Actions", field: "actions", isAction: true, width: "w-36" },
  ];

  return (
    <TableHeader>
      <TableRow>
        {headers.map((header, index) => (
          <TableHead key={`${header.field}-${index}`} className={`p-2 text-center ${header.width || ''}`}>
            {header.isAction ? (
              <span 
                className="font-bold bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow-[0_6px_12px_rgba(161,98,7,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-yellow-700" 
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {header.label}
              </span>
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
