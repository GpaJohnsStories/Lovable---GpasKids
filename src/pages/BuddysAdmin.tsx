
import { SupabaseAdminAuthProvider, useSupabaseAdminAuth } from "@/components/admin/SupabaseAdminAuthProvider";
import SupabaseAdminLogin from "@/components/admin/SupabaseAdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminStoryForm from "@/components/admin/AdminStoryForm";
import ContentProtection from "@/components/ContentProtection";
import { useAdminSession } from "@/hooks/useAdminSession";

const BuddysAdminContent = () => {
  const { isAuthenticated, isLoading } = useSupabaseAdminAuth();
  const {
    showStoryForm,
    editingStory,
    handleEditStory,
    handleCreateStory,
    handleStoryFormSave,
    handleStoryFormCancel,
  } = useAdminSession();

  if (!isAuthenticated) {
    return <SupabaseAdminLogin />;
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
  console.log('BuddysAdmin: Component rendering');
  return (
    <ContentProtection enableProtection={false}>
      <SupabaseAdminAuthProvider>
        <BuddysAdminContent />
      </SupabaseAdminAuthProvider>
    </ContentProtection>
  );
};

export default BuddysAdmin;
