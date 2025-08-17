import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Database } from "@/integrations/supabase/types";
import CommentReplyForm from "@/components/CommentReplyForm";
import CommentRepliesList from "@/components/CommentRepliesList";
import DecryptedCommentContent from "./DecryptedCommentContent";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

type Comment = Database['public']['Tables']['comments']['Row'];

interface AdminCommentDetailProps {
  comment: Comment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Comment['status']) => void;
}

const AdminCommentDetail = ({ comment, isOpen, onClose, onUpdateStatus }: AdminCommentDetailProps) => {
  const { isViewer } = useUserRole();
  if (!comment) return null;

  const isAnnouncement = comment.personal_id === '0000FF';

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
        <span className="text-blue-600 font-semibold">GpaJohn</span>
      );
    }
    return comment.personal_id;
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
          <div className={`p-4 rounded-lg border ${isAnnouncement ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className={`text-lg font-semibold mb-2 ${isAnnouncement ? 'text-blue-900' : 'text-gray-900'}`}>
                  {isAnnouncement && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mr-2 mb-1">
                      📢 Announcement
                    </Badge>
                  )}
                  {comment.subject}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium flex items-center gap-2">
                    By: {getPersonalIdDisplay()}
                  </span>
                  <span>Posted: {format(new Date(comment.created_at), 'MMM d, yyyy, h:mm a')}</span>
                  {getStatusBadge(comment.status)}
                </div>
              </div>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <DecryptedCommentContent 
                content={comment.content}
                personalId={comment.personal_id}
                className={`whitespace-pre-wrap leading-relaxed text-lg ${isAnnouncement ? 'text-blue-800' : 'text-gray-800'}`}
              />
            </div>

            {/* Photo Attachment */}
            {comment.attachment_path && (
              <div className="mt-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  📷 Photo Attachment
                  {comment.attachment_caption && (
                    <span className="text-sm font-normal text-orange-600">
                      - {comment.attachment_caption}
                    </span>
                  )}
                </h4>
                <div className="space-y-3">
                  <img
                    src={`https://hlywucxwpzbqmzssmwpj.supabase.co/storage/v1/object/public/${comment.attachment_bucket}/${comment.attachment_path}`}
                    alt={comment.attachment_caption || comment.subject}
                    className="max-w-md max-h-64 object-contain rounded-lg shadow-sm border border-orange-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const errorMsg = e.currentTarget.nextElementSibling as HTMLElement;
                      if (errorMsg) errorMsg.style.display = 'block';
                    }}
                  />
                  <div className="hidden text-red-600 text-sm">
                    Error loading image. File may have been moved or deleted.
                  </div>
                  <div className="text-xs text-orange-600 space-y-1">
                    <p><strong>File:</strong> {comment.attachment_path}</p>
                    <p><strong>Bucket:</strong> {comment.attachment_bucket}</p>
                    {comment.attachment_mime && <p><strong>Type:</strong> {comment.attachment_mime}</p>}
                    <p><strong>PID from filename:</strong> 
                      <code className="ml-1 bg-orange-100 px-1 rounded">
                        {comment.attachment_path?.split('/').pop()?.split('_')[0] || 'Unknown'}
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Actions */}
          {!isViewer && (
            <div className="space-y-3">
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

              {/* Photo-specific Actions */}
              {comment.attachment_path && comment.attachment_bucket === 'orange-gang-pending' && comment.status !== 'approved' && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Orange Gang Photo Actions:</h4>
                  <p className="text-sm text-orange-700 mb-3">
                    Approving this comment will move the photo to the public Orange Gang Gallery.
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700 text-white" 
                    onClick={async () => {
                      try {
                        const { data } = await supabase.functions.invoke('approve-comment-photo', {
                          body: { commentId: comment.id }
                        });
                        
                        if (data?.success) {
                          onUpdateStatus(comment.id, 'approved');
                        }
                      } catch (error) {
                        console.error('Error approving photo:', error);
                      }
                    }}
                  >
                    🎉 Approve for Orange Gang Gallery
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Replies Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Replies
            </h3>
            <CommentRepliesList parentId={comment.id} />
          </div>

          {/* Reply Form */}
          {!isViewer && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Post Admin Reply
              </h3>
              <CommentReplyForm parentId={comment.id} parentSubject={comment.subject} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCommentDetail;
