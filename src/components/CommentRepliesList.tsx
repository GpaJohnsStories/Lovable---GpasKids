import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from 'date-fns';
import SecureCommentDisplay from "@/components/secure/SecureCommentDisplay";

type Reply = {
  id: string;
  created_at: string;
  personal_id: string;
  subject: string;
  content: string;
};

interface CommentRepliesListProps {
  parentId: string;
}

const CommentRepliesList = ({ parentId }: CommentRepliesListProps) => {
  const { data: replies, isLoading, error } = useQuery<Reply[]>({
    queryKey: ["comment_replies", parentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, created_at, personal_id, subject, content")
        .eq("parent_id", parentId)
        .eq("status", "approved")
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as Reply[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error loading replies: {error.message}
      </div>
    );
  }

  if (!replies || replies.length === 0) {
    return (
      <div className="text-center py-6 text-orange-600 font-fun">
        No replies yet. Be the first to reply!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => {
        const isAnnouncement = reply.personal_id === '0000FF';
        return (
          <SecureCommentDisplay
            key={reply.id}
            subject={reply.subject}
            content={reply.content}
            personalId={reply.personal_id}
            createdAt={format(new Date(reply.created_at), 'MMM d, yyyy, h:mm a')}
            className="ml-4"
            isAnnouncement={isAnnouncement}
          />
        );
      })}
    </div>
  );
};

export default CommentRepliesList;
