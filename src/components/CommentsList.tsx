import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from 'date-fns';
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CommentsListHeader from "./CommentsListHeader";
import { Badge } from "@/components/ui/badge";
import { sanitizeCommentSubject, sanitizePersonalId } from "@/utils/xssProtection";

type CommentFromDB = {
  id: string;
  created_at: string;
  personal_id: string;
  subject: string;
  parent_id: string | null;
};

type CommentWithReplies = CommentFromDB & {
  replies_count: number;
};

type SortField = 'personal_id' | 'created_at' | 'subject' | 'replies_count';
type SortDirection = 'asc' | 'desc';

interface CommentsListProps {
  personalIdFilter: string | null;
}

const CommentsList = ({ personalIdFilter }: CommentsListProps) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const navigate = useNavigate();

  const { data: comments, isLoading, error } = useQuery<CommentWithReplies[]>({
    queryKey: ["comments", personalIdFilter],
    queryFn: async () => {
      let query = supabase
        .from("comments")
        .select("id, created_at, personal_id, subject, parent_id")
        .eq("status", "approved");

      if (personalIdFilter) {
        query = query.eq('personal_id', personalIdFilter);
      }
      
      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      console.log("Raw comments data from DB:", data);

      const repliesCountMap: Record<string, number> = {};
      const parentComments: CommentFromDB[] = [];

      (data || []).forEach(comment => {
        if (comment.parent_id) {
          repliesCountMap[comment.parent_id] = (repliesCountMap[comment.parent_id] || 0) + 1;
        } else {
          parentComments.push(comment as CommentFromDB);
        }
      });
      
      const commentsWithReplies = parentComments.map(comment => ({
        ...comment,
        replies_count: repliesCountMap[comment.id] || 0,
      }));

      console.log("Parent comments with replies:", commentsWithReplies);
      console.log("Announcements found:", commentsWithReplies.filter(c => c.personal_id === '0000FF'));

      return commentsWithReplies;
    },
  });

  const sortedComments = useMemo(() => {
    if (!comments) return [];
    
    console.log("Sorting comments. Current sort field:", sortField, "direction:", sortDirection);
    
    return [...comments].sort((a, b) => {
      // Always put announcements (0000FF) at the top when sorting by date (default)
      if (sortField === 'created_at') {
        if (a.personal_id === '0000FF' && b.personal_id !== '0000FF') {
          console.log("Moving announcement to top:", a.subject);
          return -1;
        }
        if (b.personal_id === '0000FF' && a.personal_id !== '0000FF') {
          console.log("Moving announcement to top:", b.subject);
          return 1;
        }
      }
      
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
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

  const handleCommentClick = (commentId: string) => {
    navigate(`/comment/${commentId}`);
  };

  const getPersonalIdDisplay = (personalId: string) => {
    const safePersonalId = sanitizePersonalId(personalId);
    if (safePersonalId === '0000FF') {
      console.log("Rendering GpaJohn display for:", safePersonalId);
      return (
        <div className="flex items-center gap-2 justify-center">
          <span className="text-blue-600 font-semibold font-fun">GpaJohn</span>
        </div>
      );
    }
    return <span className="font-fun text-orange-800">{safePersonalId}</span>;
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error fetching comments: {error.message}</div>;
  }

  console.log("Final sorted comments for rendering:", sortedComments);

  return (
    <div className="mt-0">
      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-orange-200">
        <Table>
          <CommentsListHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableBody>
            {sortedComments && sortedComments.length > 0 ? (
              sortedComments.map((comment) => {
                const isAnnouncement = comment.personal_id === '0000FF';
                console.log("Rendering comment:", comment.subject, "isAnnouncement:", isAnnouncement);
                return (
                  <TableRow 
                    key={comment.id} 
                    className={`cursor-pointer transition-colors ${
                      isAnnouncement 
                        ? "bg-blue-50/80 hover:bg-blue-100/80 border-l-4 border-l-blue-500" 
                        : "hover:bg-orange-50/50"
                    }`}
                    onClick={() => handleCommentClick(comment.id)}
                  >
                    <TableCell className="font-medium text-center">
                      {getPersonalIdDisplay(comment.personal_id)}
                    </TableCell>
                    <TableCell className="font-fun text-orange-800">{format(new Date(comment.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className={`font-fun ${isAnnouncement ? 'text-blue-800' : 'text-orange-800'}`}>
                      {isAnnouncement && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mr-2 mb-1">
                          📢 Announcement
                        </Badge>
                      )}
                      {sanitizeCommentSubject(comment.subject)}
                    </TableCell>
                    <TableCell className="text-right font-fun text-orange-800">{comment.replies_count}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-orange-800 font-fun">
                  {personalIdFilter ? "No comments found for this Personal Code." : "No comments yet. Be the first to share your thoughts!"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CommentsList;
