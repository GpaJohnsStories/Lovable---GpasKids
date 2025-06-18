
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Database } from "@/integrations/supabase/types";
import CommentsTableHeader from "./CommentsTableHeader";
import CommentsTableRow from "./CommentsTableRow";

type Comment = Database['public']['Tables']['comments']['Row'];
type SortField = keyof Omit<Comment, 'author_email' | 'parent_id' | 'updated_at' | 'content'> | 'actions';
type SortDirection = 'asc' | 'desc';

interface CommentsTableContentProps {
  comments: Comment[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onUpdateStatus: (id: string, status: Comment['status']) => void;
  onViewComment: (comment: Comment) => void;
  searchPersonalCode: string;
}

const CommentsTableContent = ({
  comments,
  sortField,
  sortDirection,
  onSort,
  onUpdateStatus,
  onViewComment,
  searchPersonalCode
}: CommentsTableContentProps) => {
  return (
    <Table>
      <CommentsTableHeader
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <TableBody>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentsTableRow 
              key={comment.id}
              comment={comment}
              onUpdateStatus={onUpdateStatus}
              onViewComment={onViewComment}
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
  );
};

export default CommentsTableContent;
