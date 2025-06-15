
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";
import AdminLogin from "@/components/admin/AdminLogin";
import CommentsDashboard from "@/components/admin/CommentsDashboard";

const AdminCommentsContent = () => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <CommentsDashboard />;
};

const AdminComments = () => {
  return (
    <AdminAuthProvider>
      <AdminCommentsContent />
    </AdminAuthProvider>
  );
};

export default AdminComments;
