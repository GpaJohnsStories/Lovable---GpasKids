
import { SupabaseAdminAuthProvider, useSupabaseAdminAuth } from "@/components/admin/SupabaseAdminAuthProvider";
import SupabaseAdminLogin from "@/components/admin/SupabaseAdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminStoryForm from "@/components/admin/AdminStoryForm";
import CommentsDashboard from "@/components/admin/CommentsDashboard";
import VoicePreview from "@/components/VoicePreview";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentProtection from "@/components/ContentProtection";
import { useAdminSession } from "@/hooks/useAdminSession";
import { Routes, Route, Navigate } from "react-router-dom";

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

  console.log('BuddysAdminContent: Auth state', { isAuthenticated, isLoading });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800">Loading admin panel...</p>
        </div>
      </div>
    );
  }

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
    <Routes>
      <Route path="/" element={<Navigate to="/buddys_admin/dashboard" replace />} />
      <Route path="/dashboard" element={
        <AdminDashboard
          onCreateStory={handleCreateStory}
          onEditStory={handleEditStory}
        />
      } />
      <Route path="/comments" element={<CommentsDashboard />} />
      <Route path="/voice-preview" element={
        <AdminLayout>
          <VoicePreview />
        </AdminLayout>
      } />
    </Routes>
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
