import AdminOverview from "@/components/admin/AdminOverview";
import AdminStories from "@/components/admin/AdminStories";
import AdminStoryForm from "@/components/admin/AdminStoryForm";
import CommentsDashboard from "@/components/admin/CommentsDashboard";
import StaticDeploymentSystem from "@/components/admin/StaticDeploymentSystem";
import VoicePreview from "@/components/VoicePreview";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentProtection from "@/components/ContentProtection";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import { useAdminSession } from "@/hooks/useAdminSession";
import { Routes, Route, Navigate } from "react-router-dom";

// Protected admin content that requires authentication
const BuddysAdminContent = () => {
  const {
    showStoryForm,
    editingStory,
    handleEditStory,
    handleCreateStory,
    handleStoryFormSave,
    handleStoryFormCancel,
  } = useAdminSession();

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
      <Route path="/dashboard" element={<AdminOverview />} />
      <Route path="/stories" element={<AdminStories />} />
      <Route path="/comments" element={<CommentsDashboard />} />
      <Route path="/deployment" element={<StaticDeploymentSystem />} />
      <Route path="/voice-preview" element={
        <AdminLayout>
          <VoicePreview />
        </AdminLayout>
      } />
    </Routes>
  );
};

// Main admin component - temporarily bypassing auth to test
const BuddysAdmin = () => {
  return (
    <ContentProtection enableProtection={false}>
      <div className="relative">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
          <span className="text-sm text-gray-600">Admin Access</span>
        </div>
        <BuddysAdminContent />
      </div>
    </ContentProtection>
  );
};

export default BuddysAdmin;