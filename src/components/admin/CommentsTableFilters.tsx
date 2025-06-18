
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CommentsTableFiltersProps {
  searchPersonalCode: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  filteredCount: number;
  totalCount: number;
}

const CommentsTableFilters = ({ 
  searchPersonalCode, 
  onSearchChange, 
  onClearSearch, 
  filteredCount, 
  totalCount 
}: CommentsTableFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by Personal Code..."
          value={searchPersonalCode}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64"
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
      {searchPersonalCode && (
        <div className="text-sm text-gray-600">
          Showing {filteredCount} of {totalCount} comments
        </div>
      )}
    </div>
  );
};

export default CommentsTableFilters;
