
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";
import AdminLogin from "@/components/admin/AdminLogin";
import CommentsDashboard from "@/components/admin/CommentsDashboard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentProtection from "@/components/ContentProtection";
import ScrollToTop from "@/components/ScrollToTop";

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

  return (
    <>
      <CommentsDashboard />
      <ScrollToTop />
    </>
  );
};

const AdminComments = () => {
  return (
    <ContentProtection enableProtection={false}>
      <AdminAuthProvider>
        <AdminCommentsContent />
      </AdminAuthProvider>
    </ContentProtection>
  );
};

export default AdminComments;
