
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from 'date-fns';

type Comment = {
  id: string;
  created_at: string;
  personal_id: string;
  subject: string;
};

const CommentsList = () => {
  const { data: comments, isLoading, error } = useQuery<Comment[]>({
    queryKey: ["comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, created_at, personal_id, subject")
        .eq("is_approved", true)
        .is("parent_id", null)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      
      return data as any as Comment[];
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-8"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error fetching comments: {error.message}</div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center text-orange-800 mb-4 font-fun">
        Published Comments
      </h2>
      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-orange-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] text-orange-900 font-bold font-fun text-base">Personal Code</TableHead>
              <TableHead className="w-[150px] text-orange-900 font-bold font-fun text-base">Date</TableHead>
              <TableHead className="text-orange-900 font-bold font-fun text-base">Subject</TableHead>
              <TableHead className="text-right w-[100px] text-orange-900 font-bold font-fun text-base">Replies</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium font-fun text-orange-800">{comment.personal_id}</TableCell>
                  <TableCell className="font-fun text-orange-800">{format(new Date(comment.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="font-fun text-orange-800">{comment.subject}</TableCell>
                  <TableCell className="text-right font-fun text-orange-800">0</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-orange-800 font-fun">
                  No comments yet. Be the first to share your thoughts!
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
