
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";
import AdminLogin from "@/components/admin/AdminLogin";
import CommentsDashboard from "@/components/admin/CommentsDashboard";
import LoadingSpinner from "@/components/LoadingSpinner";

const AdminCommentsContent = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <LoadingSpinner />
      </div>
    );
  }

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
