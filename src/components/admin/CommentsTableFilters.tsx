
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";
import CommentsStatusFilter from "./CommentsStatusFilter";

type Comment = Database['public']['Tables']['comments']['Row'];
type StatusFilter = 'all' | Comment['status'];

interface CommentsTableFiltersProps {
  searchPersonalCode: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  filteredCount: number;
  totalCount: number;
  selectedStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  statusCounts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    archived: number;
  };
}

const CommentsTableFilters = ({ 
  searchPersonalCode, 
  onSearchChange, 
  onClearSearch, 
  filteredCount, 
  totalCount,
  selectedStatus,
  onStatusChange,
  statusCounts
}: CommentsTableFiltersProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <CommentsStatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
          statusCounts={statusCounts}
        />
        
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by Personal Code..."
            value={searchPersonalCode}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64"
          />
          {searchPersonalCode && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearSearch}
              className="whitespace-nowrap"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {(searchPersonalCode || selectedStatus !== 'all') && (
        <div className="text-sm text-gray-600 mt-4">
          Showing {filteredCount} of {totalCount} comments
        </div>
      )}
    </div>
  );
};

export default CommentsTableFilters;
