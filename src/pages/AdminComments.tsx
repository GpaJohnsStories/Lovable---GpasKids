
import { DualAdminAuthProvider, useDualAdminAuth } from "@/components/admin/DualAdminAuthProvider";
import DualAdminLogin from "@/components/admin/DualAdminLogin";
import CommentsDashboard from "@/components/admin/CommentsDashboard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentProtection from "@/components/ContentProtection";

const AdminCommentsContent = () => {
  const { isAuthenticated, isLoading } = useDualAdminAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <DualAdminLogin />;
  }

  return <CommentsDashboard />;
};

const AdminComments = () => {
  return (
    <ContentProtection enableProtection={false}>
      <DualAdminAuthProvider>
        <AdminCommentsContent />
      </DualAdminAuthProvider>
    </ContentProtection>
  );
};

export default AdminComments;
