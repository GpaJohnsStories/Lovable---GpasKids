
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Database } from "@/integrations/supabase/types";
import CommentReplyForm from "@/components/CommentReplyForm";
import CommentRepliesList from "@/components/CommentRepliesList";

type Comment = Database['public']['Tables']['comments']['Row'];

interface AdminCommentDetailProps {
  comment: Comment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Comment['status']) => void;
}

const AdminCommentDetail = ({ comment, isOpen, onClose, onUpdateStatus }: AdminCommentDetailProps) => {
  if (!comment) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Comment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Comment Header */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {comment.subject}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">By: {comment.personal_id}</span>
                  <span>Posted: {format(new Date(comment.created_at), 'MMM d, yyyy, h:mm a')}</span>
                  {getStatusBadge(comment.status)}
                </div>
              </div>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="flex gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mr-4">Admin Actions:</h3>
            {comment.status !== 'approved' && (
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white" 
                onClick={() => onUpdateStatus(comment.id, 'approved')}
              >
                Approve
              </Button>
            )}
            {comment.status !== 'rejected' && (
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => onUpdateStatus(comment.id, 'rejected')}
              >
                Reject
              </Button>
            )}
            {comment.status !== 'archived' && (
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => onUpdateStatus(comment.id, 'archived')}
              >
                Archive
              </Button>
            )}
          </div>

          {/* Replies Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Replies
            </h3>
            <CommentRepliesList parentId={comment.id} />
          </div>

          {/* Reply Form */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Post Admin Reply
            </h3>
            <CommentReplyForm parentId={comment.id} parentSubject={comment.subject} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCommentDetail;
