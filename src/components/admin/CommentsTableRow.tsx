
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
      <TableCell>{comment.personal_id}</TableCell>
      <TableCell>{format(new Date(comment.created_at), 'MMM d, yyyy, h:mm a')}</TableCell>
      <TableCell className="max-w-md">
        <div className="font-medium">{comment.subject}</div>
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewComment(comment)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Full
        </Button>
      </TableCell>
      <TableCell>{getStatusBadge(comment.status)}</TableCell>
      <TableCell className="flex space-x-2">
        {comment.status !== 'approved' && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onUpdateStatus(comment.id, 'approved')}>Approve</Button>
        )}
        {comment.status !== 'rejected' && (
          <Button size="sm" variant="destructive" onClick={() => onUpdateStatus(comment.id, 'rejected')}>Reject</Button>
        )}
        {comment.status !== 'archived' && (
          <Button size="sm" variant="secondary" onClick={() => onUpdateStatus(comment.id, 'archived')}>Archive</Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default CommentsTableRow;
