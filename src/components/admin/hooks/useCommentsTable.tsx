
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Comment = Database['public']['Tables']['comments']['Row'];
type SortField = keyof Omit<Comment, 'author_email' | 'parent_id' | 'updated_at' | 'content'> | 'actions';
type SortDirection = 'asc' | 'desc';

export const useCommentsTable = () => {
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchPersonalCode, setSearchPersonalCode] = useState('');

  const { data: comments, isLoading, error } = useQuery<Comment[]>({
    queryKey: ["admin_comments"],
    queryFn: async () => {
      console.log("🔍 Admin fetching comments...");
      
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order('created_at', { ascending: false });

      console.log("📊 Admin comments query result:", {
        success: !error,
        count: data?.length || 0,
        error: error?.message
      });

      if (error) {
        console.error("❌ Error fetching admin comments:", error);
        throw new Error(`Failed to fetch comments: ${error.message}`);
      }
      
      return data || [];
    },
  });

  const updateCommentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Comment['status'] }) => {
      console.log("🔄 Updating comment status:", { id, status });
      
      const { error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error("❌ Error updating comment status:", error);
        throw new Error(error.message);
      }
      
      console.log("✅ Comment status updated successfully");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success("Comment status updated successfully!");
    },
    onError: (error) => {
      console.error("💥 Failed to update comment status:", error);
      toast.error(`Error updating comment: ${error.message}`);
    },
  });

  const filteredAndSortedComments = useMemo(() => {
    if (!comments) return [];
    
    let filtered = comments;
    if (searchPersonalCode.trim()) {
      filtered = comments.filter(comment => 
        comment.personal_id.toLowerCase().includes(searchPersonalCode.toLowerCase())
      );
    }
    
    return [...filtered].sort((a, b) => {
      if (sortField === 'actions') return 0;
      const aValue = a[sortField as keyof Comment];
      const bValue = b[sortField as keyof Comment];

      if (aValue === null || bValue === null) return 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (sortField === 'created_at') {
        return sortDirection === 'asc'
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      return 0;
    });
  }, [comments, sortField, sortDirection, searchPersonalCode]);

  const handleUpdateStatus = (id: string, status: Comment['status']) => {
    updateCommentStatusMutation.mutate({ id, status });
  };

  const handleViewComment = (comment: Comment) => {
    setSelectedComment(comment);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedComment(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClearSearch = () => {
    setSearchPersonalCode('');
  };

  return {
    comments,
    isLoading,
    error,
    sortField,
    sortDirection,
    selectedComment,
    isDetailOpen,
    searchPersonalCode,
    filteredAndSortedComments,
    setSearchPersonalCode,
    handleUpdateStatus,
    handleViewComment,
    handleCloseDetail,
    handleSort,
    handleClearSearch,
  };
};
