
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminStoryForm from "@/components/admin/AdminStoryForm";
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
    <AdminAuthProvider>
      <BuddysAdminContent />
    </AdminAuthProvider>
  );
};

export default BuddysAdmin;
