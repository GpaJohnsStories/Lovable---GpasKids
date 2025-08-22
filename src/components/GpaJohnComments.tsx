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
  const {
    data: comments,
    isLoading,
    error
  } = useQuery<GpaJohnComment[]>({
    queryKey: ["gpaJohnComments"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("comments").select("id, created_at, subject, content").eq("personal_id", "0000FF").eq("status", "approved").order("created_at", {
        ascending: false
      }).limit(3);
      if (error) {
        throw new Error(error.message);
      }
      return data as GpaJohnComment[];
    }
  });
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  if (isLoading) {
    return <div className="flex justify-center py-4">
        <LoadingSpinner />
      </div>;
  }

  // Always show the announcements banner, even if no comments
  return <section className="py-8">
      {/* Header Banner - Always visible */}
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <Link to="/viewcomments" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <button className="bg-gradient-to-b from-blue-400 to-blue-600 text-white border-blue-700 h3-fun-24 px-8 py-4 rounded-full shadow-[0_6px_12px_rgba(37,99,235,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border hover:shadow-[0_8px_16px_rgba(37,99,235,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200">
              Click to Read Latest Announcements from Grandpa John
            </button>
          </Link>
        </div>
      </div>
    </section>;
};
export default GpaJohnComments;