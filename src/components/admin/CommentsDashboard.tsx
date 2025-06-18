
import AdminHeader from "./AdminHeader";
import AdminLayout from "./AdminLayout";
import CommentsTable from "./CommentsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Comment = Database['public']['Tables']['comments']['Row'];

const CommentsDashboard = () => {
  const { data: comments } = useQuery<Comment[]>({
    queryKey: ["admin_comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch comments: ${error.message}`);
      }
      
      return data || [];
    },
  });

  return (
    <AdminLayout>
      <div className="mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Manage Comments
          </h2>
          <div className="text-base text-gray-600">
            Found {comments?.length || 0} comments total
            {comments && comments.length > 0 && (
              <span className="ml-2 text-sm">
                (Status breakdown: {comments.filter(c => c.status === 'pending').length} pending, 
                {comments.filter(c => c.status === 'approved').length} approved, 
                {comments.filter(c => c.status === 'rejected').length} rejected)
              </span>
            )}
          </div>
        </div>
      </div>
      <CommentsTable />
    </AdminLayout>
  );
};

export default CommentsDashboard;
