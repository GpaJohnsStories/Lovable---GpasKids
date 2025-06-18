
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ContentProtection from "@/components/ContentProtection";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from 'date-fns';
import CommentReplyForm from "@/components/CommentReplyForm";
import CommentRepliesList from "@/components/CommentRepliesList";

type Comment = {
  id: string;
  created_at: string;
  personal_id: string;
  subject: string;
  content: string;
  parent_id: string | null;
};

const CommentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: comment, isLoading, error } = useQuery<Comment>({
    queryKey: ["comment", id],
    queryFn: async () => {
      if (!id) throw new Error("Comment ID is required");
      
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Comment not found");
      }

      return data as Comment;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ContentProtection enableProtection={true}>
        <div className="flex flex-col min-h-screen bg-amber-50">
          <WelcomeHeader />
          <main className="flex-grow container mx-auto px-4 py-8">
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          </main>
          <CookieFreeFooter />
        </div>
      </ContentProtection>
    );
  }

  if (error || !comment) {
    return (
      <ContentProtection enableProtection={true}>
        <div className="flex flex-col min-h-screen bg-amber-50">
          <WelcomeHeader />
          <main className="flex-grow container mx-auto px-4 py-8">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-orange-200">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-orange-800 mb-4">Comment Not Found</h2>
                <p className="text-orange-600 mb-4">
                  {error ? error.message : "The comment you're looking for doesn't exist or hasn't been approved yet."}
                </p>
                <Button onClick={() => navigate("/view-comments")} className="bg-orange-500 hover:bg-orange-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Comments
                </Button>
              </div>
            </div>
          </main>
          <CookieFreeFooter />
        </div>
      </ContentProtection>
    );
  }

  return (
    <ContentProtection enableProtection={true}>
      <div className="flex flex-col min-h-screen bg-amber-50">
        <WelcomeHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-orange-200">
            <div className="mb-6">
              <Button 
                onClick={() => navigate("/view-comments")} 
                variant="outline"
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Comments
              </Button>
            </div>

            {/* Main Comment */}
            <div className="bg-white/80 p-6 rounded-lg border border-orange-200 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-orange-800 font-fun mb-2">
                    {comment.subject}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-orange-600">
                    <span className="font-semibold">By: {comment.personal_id}</span>
                    <span>Posted: {format(new Date(comment.created_at), 'MMM d, yyyy, h:mm a')}</span>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-orange max-w-none">
                <div className="text-gray-800 whitespace-pre-wrap font-fun leading-relaxed text-lg">
                  {comment.content}
                </div>
              </div>
            </div>

            {/* Replies Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-orange-800 font-fun mb-4">
                Replies
              </h2>
              <CommentRepliesList parentId={comment.id} />
            </div>

            {/* Reply Form */}
            <div>
              <h3 className="text-lg font-bold text-orange-800 font-fun mb-4">
                Post a Reply
              </h3>
              <CommentReplyForm parentId={comment.id} parentSubject={comment.subject} />
            </div>
          </div>
        </main>
        <CookieFreeFooter />
      </div>
    </ContentProtection>
  );
};

export default CommentDetail;
