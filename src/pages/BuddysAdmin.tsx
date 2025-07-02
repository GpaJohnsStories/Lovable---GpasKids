
import { DualAdminAuthProvider, useDualAdminAuth } from "@/components/admin/DualAdminAuthProvider";
import DualAdminLogin from "@/components/admin/DualAdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminStoryForm from "@/components/admin/AdminStoryForm";
import ContentProtection from "@/components/ContentProtection";
import { useAdminSession } from "@/hooks/useAdminSession";

const BuddysAdminContent = () => {
  const { isAuthenticated } = useDualAdminAuth();
  const {
    showStoryForm,
    editingStory,
    handleEditStory,
    handleCreateStory,
    handleStoryFormSave,
    handleStoryFormCancel,
  } = useAdminSession();

  if (!isAuthenticated) {
    return <DualAdminLogin />;
  }

  if (showStoryForm) {
    return (
      <AdminStoryForm
        editingStory={editingStory}
        onSave={handleStoryFormSave}
        onCancel={handleStoryFormCancel}
      />
    );
  }

  return (
    <AdminDashboard
      onCreateStory={handleCreateStory}
      onEditStory={handleEditStory}
    />
  );
};

const BuddysAdmin = () => {
  return (
    <ContentProtection enableProtection={false}>
      <DualAdminAuthProvider>
        <BuddysAdminContent />
      </DualAdminAuthProvider>
    </ContentProtection>
  );
};

export default BuddysAdmin;
