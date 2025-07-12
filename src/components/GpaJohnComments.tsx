import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

type GpaJohnComment = {
  id: string;
  created_at: string;
  subject: string;
  content: string;
};

const GpaJohnComments = () => {
  const { data: comments, isLoading, error } = useQuery<GpaJohnComment[]>({
    queryKey: ["gpaJohnComments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, created_at, subject, content")
        .eq("personal_id", "0000FF")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        throw new Error(error.message);
      }

      return data as GpaJohnComment[];
    },
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  // Always show the announcements banner, even if no comments
  return (
    <section className="py-8">
      {/* Header Banner - Always visible */}
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 rounded-xl p-3 shadow-[0_6px_0_#1e40af,0_8px_15px_rgba(0,0,0,0.3)] border border-blue-700 mb-4 relative">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white font-fun">Latest Announcements from Grandpa John</h2>
          </div>
          
          {/* Web-text code in bottom right corner */}
          <div className="absolute bottom-2 right-2 text-xs font-mono text-blue-200 bg-blue-900/50 px-2 py-1 rounded">
            SYS-ANN
          </div>
        </div>
      </div>

      {/* Comments List - Only show if we have comments and no error */}
      {!error && comments && comments.length > 0 && (
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <div 
                key={comment.id}
                className="bg-blue-50/80 border-2 border-blue-200 rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-800 font-fun text-lg">GpaJohn</span>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-fun">
                      📢 Announcement
                    </div>
                  </div>
                  <span className="text-blue-600 font-fun text-sm">
                    {format(new Date(comment.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-blue-800 font-fun mb-3">
                  {comment.subject}
                </h3>
                
                <div className="text-blue-800 font-fun leading-relaxed text-base mb-4">
                  {comment.content.length > 200 
                    ? `${comment.content.substring(0, 200)}...` 
                    : comment.content
                  }
                </div>
                
                <Link 
                  to={`/comment/${comment.id}`} 
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-fun font-semibold transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Read Full Comment & Replies
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default GpaJohnComments;