
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import CommentsTableHeader from "./CommentsTableHeader";
import CommentsTableRow from "./CommentsTableRow";

type Comment = Database['public']['Tables']['comments']['Row'];
type SortField = keyof Omit<Comment, 'author_email' | 'parent_id' | 'updated_at'> | 'actions';
type SortDirection = 'asc' | 'desc';

const CommentsTable = () => {
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: comments, isLoading, error } = useQuery<Comment[]>({
    queryKey: ["admin_comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
  });

  const updateCommentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Comment['status'] }) => {
      const { error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_comments'] });
      toast.success("Comment status updated successfully!");
    },
    onError: (error) => {
      toast.error(`Error updating comment: ${error.message}`);
    },
  });

  const handleUpdateStatus = (id: string, status: Comment['status']) => {
    updateCommentStatusMutation.mutate({ id, status });
  };

  const sortedComments = useMemo(() => {
    if (!comments) return [];
    
    return [...comments].sort((a, b) => {
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
  }, [comments, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <Card>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
            <BookOpen className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p>Loading comments...</p>
          </div>
        ) : error ? (
           <div className="text-red-500 text-center py-8">Error fetching comments: {error.message}</div>
        ) : (
          <Table>
            <CommentsTableHeader
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody>
              {sortedComments && sortedComments.length > 0 ? (
                sortedComments.map((comment) => (
                  <CommentsTableRow 
                    key={comment.id}
                    comment={comment}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No comments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsTable;
