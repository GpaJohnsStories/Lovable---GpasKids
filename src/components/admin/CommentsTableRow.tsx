
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";

type Comment = Database['public']['Tables']['comments']['Row'];

interface CommentsTableRowProps {
  comment: Comment;
  onUpdateStatus: (id: string, status: Comment['status']) => void;
  onViewComment: (comment: Comment) => void;
}

const CommentsTableRow = ({ comment, onUpdateStatus, onViewComment }: CommentsTableRowProps) => {
  const isAnnouncement = comment.personal_id === '000000';

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

  const getPersonalIdDisplay = () => {
    if (isAnnouncement) {
      return (
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-blue-600" />
          <span className="text-blue-600 font-semibold">Admin</span>
        </div>
      );
    }
    return <span className="text-base">{comment.personal_id}</span>;
  };

  return (
    <TableRow className={isAnnouncement ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}>
      <TableCell className="w-20 text-center">
        {getPersonalIdDisplay()}
      </TableCell>
      <TableCell className="w-32 text-center text-base">{format(new Date(comment.created_at), 'MMM d, yyyy')}</TableCell>
      <TableCell className="w-96">
        <div 
          className={`font-medium break-words whitespace-normal text-base cursor-pointer hover:text-blue-600 transition-colors ${isAnnouncement ? 'text-blue-800 hover:text-blue-900' : 'hover:text-blue-600'}`}
          onClick={() => onViewComment(comment)}
        >
          {isAnnouncement && (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mr-2 mb-1">
              📢 Announcement
            </Badge>
          )}
          {comment.subject}
        </div>
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
