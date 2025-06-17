
import AdminHeader from "./AdminHeader";
import AdminLayout from "./AdminLayout";
import CommentsTable from "./CommentsTable";

const CommentsDashboard = () => {
  return (
    <AdminLayout>
      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-8 text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Manage Comments
        </h2>
      </div>
      <CommentsTable />
    </AdminLayout>
  );
};

export default CommentsDashboard;
