
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

type Comment = Database['public']['Tables']['comments']['Row'];

interface CommentsTableRowProps {
  comment: Comment;
  onUpdateStatus: (id: string, status: Comment['status']) => void;
  onViewComment: (comment: Comment) => void;
}

const CommentsTableRow = ({ comment, onUpdateStatus, onViewComment }: CommentsTableRowProps) => {

  const getStatusBadge = (status: Comment['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-500 text-white">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell className="w-20 text-center text-base">{comment.personal_id}</TableCell>
      <TableCell className="w-32 text-center text-base">{format(new Date(comment.created_at), 'MMM d, yyyy')}</TableCell>
      <TableCell className="w-80">
        <div className="font-medium break-words whitespace-normal text-base">{comment.subject}</div>
      </TableCell>
      <TableCell className="w-24 text-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewComment(comment)}
          className="flex items-center gap-1"
        >
          <Eye className="h-3 w-3" />
          View
        </Button>
      </TableCell>
      <TableCell className="w-28 text-center">{getStatusBadge(comment.status)}</TableCell>
      <TableCell className="w-36">
        <div className="flex flex-row gap-1">
          {comment.status !== 'approved' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 min-w-fit" onClick={() => onUpdateStatus(comment.id, 'approved')}>Approve</Button>
          )}
          {comment.status !== 'rejected' && (
            <Button size="sm" variant="destructive" className="text-xs px-2 py-1 min-w-fit" onClick={() => onUpdateStatus(comment.id, 'rejected')}>Reject</Button>
          )}
          {comment.status !== 'archived' && (
            <Button size="sm" variant="secondary" className="text-xs px-2 py-1 min-w-fit" onClick={() => onUpdateStatus(comment.id, 'archived')}>Archive</Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CommentsTableRow;
