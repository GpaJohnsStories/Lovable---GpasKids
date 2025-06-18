
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
    <div className="mb-4">
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
        <ToggleGroupItem value="all" variant="outline" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-300">
          All ({statusCounts.all})
        </ToggleGroupItem>
        <ToggleGroupItem value="approved" variant="outline" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-300">
          Approved ({statusCounts.approved})
        </ToggleGroupItem>
        <ToggleGroupItem value="rejected" variant="outline" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-300">
          Rejected ({statusCounts.rejected})
        </ToggleGroupItem>
        <ToggleGroupItem value="archived" variant="outline" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-300">
          Archived ({statusCounts.archived})
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default CommentsStatusFilter;
