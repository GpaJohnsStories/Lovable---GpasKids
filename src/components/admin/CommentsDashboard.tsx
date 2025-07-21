
import AdminLayoutWithHeaderBanner from "./AdminLayoutWithHeaderBanner";
import CommentsTable from "./CommentsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateAdminComment from "./CreateAdminComment";
import { useUserRole } from "@/hooks/useUserRole";

type Comment = Database['public']['Tables']['comments']['Row'];

const CommentsDashboard = () => {
  const { isViewer } = useUserRole();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
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
    <AdminLayoutWithHeaderBanner>
      <div className="mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {isViewer ? 'View Comments' : 'Manage Comments'}
          </h2>
          {!isViewer && (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Comment
            </Button>
          )}
        </div>
      </div>
      
      {showCreateForm && (
        <CreateAdminComment 
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
        />
      )}
      
      <CommentsTable />
    </AdminLayoutWithHeaderBanner>
  );
};

export default CommentsDashboard;
