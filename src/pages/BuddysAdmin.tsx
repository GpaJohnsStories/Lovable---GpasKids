
import AdminOverview from "@/components/admin/AdminOverview";
import AdminStories from "@/components/admin/AdminStories";
import AdminStoryForm from "@/components/admin/AdminStoryForm";
import CommentsDashboard from "@/components/admin/CommentsDashboard";
import VoicePreview from "@/components/VoicePreview";
import AdminLayoutWithHeaderBanner from "@/components/admin/AdminLayoutWithHeaderBanner";
import ContentProtection from "@/components/ContentProtection";
import EnhancedSecureAdminCheck from "@/components/admin/EnhancedSecureAdminCheck";
import UnifiedStoryPage from "@/components/unified-story/UnifiedStoryPage";
import { useAdminSession } from "@/hooks/useAdminSession";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Protected admin content that requires authentication
const BuddysAdminContent = () => {
  const { handleStoryFormSave } = useAdminSession();
  const navigate = useNavigate();

  const handleStoryFormCancel = () => {
    // Navigate back to stories list and scroll to top
    navigate('/buddys_admin/stories');
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
      
      {/* Unified Story System Routes */}
      <Route path="/unified_story_system/add" element={<UnifiedStoryPage mode="add" />} />
      <Route path="/unified_story_system/update/:id" element={<UnifiedStoryPage mode="update" />} />
      
      {/* Legacy story routes - kept for backward compatibility */}
      <Route path="/story" element={
        <AdminStoryForm
          onSave={handleStoryFormSave}
          onCancel={handleStoryFormCancel}
        />
      } />
      <Route path="/story/:id" element={
        <AdminStoryForm
          onSave={handleStoryFormSave}
          onCancel={handleStoryFormCancel}
        />
      } />
      
      <Route path="/comments" element={<CommentsDashboard />} />
      <Route path="/voice-preview" element={
        <AdminLayoutWithHeaderBanner>
          <VoicePreview />
        </AdminLayoutWithHeaderBanner>
      } />
    </Routes>
  );
};

// Main admin component - now with enhanced authentication
const BuddysAdmin = () => {
  return (
    <ContentProtection enableProtection={false}>
      <EnhancedSecureAdminCheck>
        <BuddysAdminContent />
      </EnhancedSecureAdminCheck>
    </ContentProtection>
  );
};

export default BuddysAdmin;
