
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
        <ToggleGroupItem 
          value="all" 
          variant="outline" 
          className={selectedStatus === 'all' 
            ? "bg-blue-500 text-white border-blue-600 shadow-lg hover:bg-blue-600" 
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }
        >
          All ({statusCounts.all})
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="approved" 
          variant="outline" 
          className={selectedStatus === 'approved' 
            ? "bg-green-500 text-white border-green-600 shadow-lg hover:bg-green-600" 
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }
        >
          Approved ({statusCounts.approved})
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="rejected" 
          variant="outline" 
          className={selectedStatus === 'rejected' 
            ? "bg-red-500 text-white border-red-600 shadow-lg hover:bg-red-600" 
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }
        >
          Rejected ({statusCounts.rejected})
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="archived" 
          variant="outline" 
          className={selectedStatus === 'archived' 
            ? "bg-gray-500 text-white border-gray-600 shadow-lg hover:bg-gray-600" 
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }
        >
          Archived ({statusCounts.archived})
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default CommentsStatusFilter;
