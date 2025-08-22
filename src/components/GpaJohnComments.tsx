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
        <button className="w-40 h-40 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-[0_6px_0_#1e40af,0_8px_15px_rgba(0,0,0,0.3)] border border-blue-700 mb-4 relative hover:shadow-[0_4px_0_#1e40af,0_6px_12px_rgba(0,0,0,0.4)] hover:translate-y-[2px] active:shadow-[0_2px_0_#1e40af,0_4px_8px_rgba(0,0,0,0.2)] active:translate-y-[4px] transition-all duration-150">
          <div className="flex flex-col items-center justify-center text-center h-full p-2">
            <h2 className="text-[16pt] font-bold text-white font-fun italic leading-tight">Click to Read Latest Announcements from Grandpa John</h2>
          </div>
        </button>
      </div>
    </section>;
};
export default GpaJohnComments;