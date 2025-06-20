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

  const getPersonalIdDisplay = (personalId: string) => {
    if (personalId === '000000') {
      return (
        <span className="text-blue-600 font-semibold font-fun">GpaJohn</span>
      );
    }
    return <span className="font-fun text-orange-600">{personalId}</span>;
  };

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
        const isAnnouncement = reply.personal_id === '000000';
        return (
          <div 
            key={reply.id} 
            className={`p-4 rounded-lg border ml-4 ${
              isAnnouncement 
                ? 'bg-blue-50/60 border-blue-200' 
                : 'bg-white/60 border-orange-100'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="font-semibold">
                  By: {getPersonalIdDisplay(reply.personal_id)}
                </span>
                <span className={`font-fun ${isAnnouncement ? 'text-blue-600' : 'text-orange-600'}`}>
                  {format(new Date(reply.created_at), 'MMM d, yyyy, h:mm a')}
                </span>
              </div>
            </div>
            
            <div className={`whitespace-pre-wrap font-fun leading-relaxed text-lg ${
              isAnnouncement ? 'text-blue-800' : 'text-gray-800'
            }`}>
              {reply.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentRepliesList;
