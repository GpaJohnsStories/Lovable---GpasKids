
import AdminOverview from "@/components/admin/AdminOverview";
import AdminStories from "@/components/admin/AdminStories";
import AdminStoryForm from "@/components/admin/AdminStoryForm";
import CommentsDashboard from "@/components/admin/CommentsDashboard";
import VoicePreview from "@/components/VoicePreview";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentProtection from "@/components/ContentProtection";
import SecureAdminCheck from "@/components/admin/SecureAdminCheck";
import { useAdminSession } from "@/hooks/useAdminSession";
import { Routes, Route, Navigate } from "react-router-dom";

// Protected admin content that requires authentication
const BuddysAdminContent = () => {
  const { handleStoryFormSave } = useAdminSession();

  const handleStoryFormCancel = () => {
    // Navigate back to stories list and scroll to top
    window.location.href = '/buddys_admin/stories';
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/buddys_admin/dashboard" replace />} />
      <Route path="/dashboard" element={<AdminOverview />} />
      <Route path="/stories" element={<AdminStories />} />
      <Route path="/stories/edit/:id?" element={
        <AdminStoryForm
          onSave={handleStoryFormSave}
          onCancel={handleStoryFormCancel}
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

// Main admin component - now with simple authentication
const BuddysAdmin = () => {
  return (
    <ContentProtection enableProtection={false}>
      <SecureAdminCheck>
        <BuddysAdminContent />
      </SecureAdminCheck>
    </ContentProtection>
  );
};

export default BuddysAdmin;
