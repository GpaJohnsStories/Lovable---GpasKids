
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import AdminCommentDetail from "./AdminCommentDetail";
import CommentsTableFilters from "./CommentsTableFilters";
import CommentsTableContent from "./CommentsTableContent";
import { useCommentsTable } from "./hooks/useCommentsTable";

const CommentsTable = () => {
  const {
    comments,
    isLoading,
    error,
    sortField,
    sortDirection,
    selectedComment,
    isDetailOpen,
    searchPersonalCode,
    selectedStatus,
    statusCounts,
    filteredAndSortedComments,
    setSearchPersonalCode,
    setSelectedStatus,
    handleUpdateStatus,
    handleViewComment,
    handleCloseDetail,
    handleSort,
    handleClearSearch,
  } = useCommentsTable();

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
              <CommentsTableFilters
                searchPersonalCode={searchPersonalCode}
                onSearchChange={setSearchPersonalCode}
                onClearSearch={handleClearSearch}
                filteredCount={filteredAndSortedComments.length}
                totalCount={comments?.length || 0}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                statusCounts={statusCounts}
              />
              
              <CommentsTableContent
                comments={filteredAndSortedComments}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onUpdateStatus={handleUpdateStatus}
                onViewComment={handleViewComment}
                searchPersonalCode={searchPersonalCode}
              />
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
