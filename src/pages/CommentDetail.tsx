
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ContentProtection from "@/components/ContentProtection";
import LoadingSpinner from "@/components/LoadingSpinner";
import ScrollToTop from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Megaphone, Home } from "lucide-react";
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleHomeClick = () => {
    scrollToTop();
    navigate("/");
  };

  const handleCommentsListClick = () => {
    scrollToTop();
    navigate("/view-comments");
  };

  const getPersonalIdDisplay = (personalId: string) => {
    if (personalId === '000000') {
      return (
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-blue-600" />
          <span className="text-blue-600 font-semibold font-fun">GpaJohn</span>
        </div>
      );
    }
    return <span className="font-fun text-orange-600">{personalId}</span>;
  };

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
          <ScrollToTop />
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
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <button
                    onClick={handleHomeClick}
                    className="bg-gradient-to-b from-orange-400 to-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-[0_6px_0_#c2410c,0_8px_15px_rgba(0,0,0,0.3)] border border-white border-opacity-30 transition-all duration-200 hover:shadow-[0_4px_0_#c2410c,0_6px_12px_rgba(0,0,0,0.4)] hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#c2410c,0_4px_8px_rgba(0,0,0,0.3)] font-fun flex items-center gap-1 min-w-[100px] border-t-white/30"
                  >
                    <Home className="w-4 h-4" />
                    Back to Home Page
                  </button>
                  <button
                    onClick={handleCommentsListClick}
                    className="bg-gradient-to-b from-orange-400 to-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-[0_6px_0_#c2410c,0_8px_15px_rgba(0,0,0,0.3)] border border-white border-opacity-30 transition-all duration-200 hover:shadow-[0_4px_0_#c2410c,0_6px_12px_rgba(0,0,0,0.4)] hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#c2410c,0_4px_8px_rgba(0,0,0,0.3)] font-fun flex items-center gap-1 min-w-[100px] border-t-white/30"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Comments List
                  </button>
                </div>
              </div>
            </div>
          </main>
          <CookieFreeFooter />
          <ScrollToTop />
        </div>
      </ContentProtection>
    );
  }

  const isAnnouncement = comment.personal_id === '000000';

  return (
    <ContentProtection enableProtection={true}>
      <div className="flex flex-col min-h-screen bg-amber-50">
        <WelcomeHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-orange-200">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={handleHomeClick}
                  className="bg-gradient-to-b from-orange-400 to-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-[0_6px_0_#c2410c,0_8px_15px_rgba(0,0,0,0.3)] border border-white border-opacity-30 transition-all duration-200 hover:shadow-[0_4px_0_#c2410c,0_6px_12px_rgba(0,0,0,0.4)] hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#c2410c,0_4px_8px_rgba(0,0,0,0.3)] font-fun flex items-center justify-center gap-1 min-w-[100px] border-t-white/30"
                >
                  <Home className="w-4 h-4" />
                  Back to Home Page
                </button>
                <button
                  onClick={handleCommentsListClick}
                  className="bg-gradient-to-b from-orange-400 to-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-[0_6px_0_#c2410c,0_8px_15px_rgba(0,0,0,0.3)] border border-white border-opacity-30 transition-all duration-200 hover:shadow-[0_4px_0_#c2410c,0_6px_12px_rgba(0,0,0,0.4)] hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#c2410c,0_4px_8px_rgba(0,0,0,0.3)] font-fun flex items-center justify-center gap-1 min-w-[100px] border-t-white/30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Comments List
                </button>
              </div>
            </div>

            {/* Main Comment */}
            <div className={`p-6 rounded-lg border mb-8 ${
              isAnnouncement 
                ? 'bg-blue-50/80 border-blue-200' 
                : 'bg-white/80 border-orange-200'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className={`text-2xl font-bold font-fun mb-2 ${
                    isAnnouncement ? 'text-blue-800' : 'text-orange-800'
                  }`}>
                    {comment.subject}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold">
                      By: {getPersonalIdDisplay(comment.personal_id)}
                    </span>
                    <span className={`font-fun ${isAnnouncement ? 'text-blue-600' : 'text-orange-600'}`}>
                      Posted: {format(new Date(comment.created_at), 'MMM d, yyyy, h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-orange max-w-none">
                <div className={`whitespace-pre-wrap font-fun leading-relaxed text-lg ${
                  isAnnouncement ? 'text-blue-800' : 'text-gray-800'
                }`}>
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
        <ScrollToTop />
      </div>
    </ContentProtection>
  );
};

export default CommentDetail;
