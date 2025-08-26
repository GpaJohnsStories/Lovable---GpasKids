import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { ProportionalWebTextBox } from "./ProportionalWebTextBox";
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
  return <section className="pt-4 pb-2">
      {/* Header Banner - Always visible */}
      <div className="container mx-auto px-4">
        <div className="flex justify-center w-full">
          <div style={{ border: '2px solid #2563eb' }} className="rounded-lg w-full max-w-4xl">
            <ProportionalWebTextBox 
              webtextCode="SYS-LAA"
              borderColor="#2563eb"
              backgroundColor="bg-blue-50"
            />
          </div>
        </div>
      </div>
    </section>;
};
export default GpaJohnComments;