
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminStoryForm from "@/components/admin/AdminStoryForm";
import ContentProtection from "@/components/ContentProtection";
import ScrollToTop from "@/components/ScrollToTop";
import { useAdminSession } from "@/hooks/useAdminSession";

const BuddysAdminContent = () => {
  const { isAuthenticated } = useAdminAuth();
  const {
    showStoryForm,
    editingStory,
    handleEditStory,
    handleCreateStory,
    handleStoryFormSave,
    handleStoryFormCancel,
  } = useAdminSession();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  if (showStoryForm) {
    return (
      <>
        <AdminStoryForm
          editingStory={editingStory}
          onSave={handleStoryFormSave}
          onCancel={handleStoryFormCancel}
        />
        <ScrollToTop />
      </>
    );
  }

  return (
    <>
      <AdminDashboard
        onCreateStory={handleCreateStory}
        onEditStory={handleEditStory}
      />
      <ScrollToTop />
    </>
  );
};

const BuddysAdmin = () => {
  return (
    <ContentProtection enableProtection={false}>
      <AdminAuthProvider>
        <BuddysAdminContent />
      </AdminAuthProvider>
    </ContentProtection>
  );
};

export default BuddysAdmin;
