
import AdminHeader from "./AdminHeader";
import AdminLayout from "./AdminLayout";
import CommentsTable from "./CommentsTable";
import { useQuery } from "@tanstack/react-query";
import { adminClient } from "@/integrations/supabase/clients";
import { Database } from "@/integrations/supabase/types";

type Comment = Database['public']['Tables']['comments']['Row'];

const CommentsDashboard = () => {
  const { data: comments } = useQuery<Comment[]>({
    queryKey: ["admin_comments"],
    queryFn: async () => {
      const { data, error } = await adminClient
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
        </div>
      </div>
      <CommentsTable />
    </AdminLayout>
  );
};

export default CommentsDashboard;
