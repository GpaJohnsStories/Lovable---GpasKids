
import AdminHeader from "./AdminHeader";
import AdminLayout from "./AdminLayout";
import CommentsTable from "./CommentsTable";

const CommentsDashboard = () => {
  return (
    <AdminLayout>
      <AdminHeader />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Manage Comments</h2>
      </div>
      <CommentsTable />
    </AdminLayout>
  );
};

export default CommentsDashboard;
