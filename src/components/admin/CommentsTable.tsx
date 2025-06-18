import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CommentsTableHeader from "./CommentsTableHeader";
import CommentsTableRow from "./CommentsTableRow";
import AdminCommentDetail from "./AdminCommentDetail";

type Comment = Database['public']['Tables']['comments']['Row'];
type SortField = keyof Omit<Comment, 'author_email' | 'parent_id' | 'updated_at' | 'content'> | 'actions';
type SortDirection = 'asc' | 'desc';

const CommentsTable = () => {
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
      queryClient.invalidateQueries({ queryKey: ['comments'] }); // Also invalidate public comments
      toast.success("Comment status updated successfully!");
    },
    onError: (error) => {
      console.error("💥 Failed to update comment status:", error);
      toast.error(`Error updating comment: ${error.message}`);
    },
  });

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

  const filteredAndSortedComments = useMemo(() => {
    if (!comments) return [];
    
    // First filter by personal code if search term exists
    let filtered = comments;
    if (searchPersonalCode.trim()) {
      filtered = comments.filter(comment => 
        comment.personal_id.toLowerCase().includes(searchPersonalCode.toLowerCase())
      );
    }
    
    // Then sort the filtered results
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

  return (
    <>
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
              <BookOpen className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
              <p>Loading comments...</p>
            </div>
          ) : error ? (
             <div className="text-red-500 text-center py-8">
               <p className="font-semibold">Error fetching comments:</p>
               <p className="text-sm mb-4">{error.message}</p>
             </div>
          ) : (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by Personal Code..."
                    value={searchPersonalCode}
                    onChange={(e) => setSearchPersonalCode(e.target.value)}
                    className="w-full sm:w-64"
                  />
                  {searchPersonalCode && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleClearSearch}
                      className="whitespace-nowrap"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {searchPersonalCode && (
                  <div className="text-sm text-gray-600">
                    Showing {filteredAndSortedComments.length} of {comments?.length || 0} comments
                  </div>
                )}
              </div>
              
              <Table>
                <CommentsTableHeader
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableBody>
                  {filteredAndSortedComments && filteredAndSortedComments.length > 0 ? (
                    filteredAndSortedComments.map((comment) => (
                      <CommentsTableRow 
                        key={comment.id}
                        comment={comment}
                        onUpdateStatus={handleUpdateStatus}
                        onViewComment={handleViewComment}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <p>
                          {searchPersonalCode 
                            ? `No comments found for Personal Code "${searchPersonalCode}"`
                            : "No comments found. Comments submitted through the website should appear here."
                          }
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AdminCommentDetail
        comment={selectedComment}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onUpdateStatus={handleUpdateStatus}
      />
    </>
  );
};

export default CommentsTable;
