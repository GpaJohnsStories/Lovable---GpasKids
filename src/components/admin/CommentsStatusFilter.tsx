
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Database } from "@/integrations/supabase/types";

type Comment = Database['public']['Tables']['comments']['Row'];
type StatusFilter = 'all' | Comment['status'];

interface CommentsStatusFilterProps {
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

const CommentsStatusFilter = ({ 
  selectedStatus, 
  onStatusChange, 
  statusCounts 
}: CommentsStatusFilterProps) => {
  return (
    <div>
      <ToggleGroup
        type="single"
        value={selectedStatus}
        onValueChange={(value) => {
          if (value) {
            onStatusChange(value as StatusFilter);
          }
        }}
        className="justify-start gap-2"
      >
        <ToggleGroupItem value="all" variant="outline" className="data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:border-blue-600 data-[state=on]:shadow-lg">
          All ({statusCounts.all})
        </ToggleGroupItem>
        <ToggleGroupItem value="approved" variant="outline" className="data-[state=on]:bg-green-500 data-[state=on]:text-white data-[state=on]:border-green-600 data-[state=on]:shadow-lg">
          Approved ({statusCounts.approved})
        </ToggleGroupItem>
        <ToggleGroupItem value="rejected" variant="outline" className="data-[state=on]:bg-red-500 data-[state=on]:text-white data-[state=on]:border-red-600 data-[state=on]:shadow-lg">
          Rejected ({statusCounts.rejected})
        </ToggleGroupItem>
        <ToggleGroupItem value="archived" variant="outline" className="data-[state=on]:bg-gray-500 data-[state=on]:text-white data-[state=on]:border-gray-600 data-[state=on]:shadow-lg">
          Archived ({statusCounts.archived})
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default CommentsStatusFilter;
