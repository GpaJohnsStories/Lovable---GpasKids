
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from 'date-fns';

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
      {replies.map((reply) => (
        <div key={reply.id} className="bg-white/60 p-4 rounded-lg border border-orange-100 ml-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-4 text-sm text-orange-600">
              <span className="font-semibold font-fun">By: {reply.personal_id}</span>
              <span className="font-fun">
                {format(new Date(reply.created_at), 'MMM d, yyyy, h:mm a')}
              </span>
            </div>
          </div>
          
          <div className="text-gray-800 whitespace-pre-wrap font-fun leading-relaxed text-lg">
            {reply.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentRepliesList;
