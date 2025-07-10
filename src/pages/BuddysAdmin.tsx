
import AdminOverview from "@/components/admin/AdminOverview";
import AdminStories from "@/components/admin/AdminStories";
import AdminStoryForm from "@/components/admin/AdminStoryForm";
import CommentsDashboard from "@/components/admin/CommentsDashboard";
import VoicePreview from "@/components/VoicePreview";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentProtection from "@/components/ContentProtection";
import { useAdminSession } from "@/hooks/useAdminSession";
import { Routes, Route, Navigate } from "react-router-dom";
import { SupabaseAdminAuthProvider, useSupabaseAdminAuth } from "@/components/admin/SupabaseAdminAuth";
import SupabaseAdminLogin from "@/components/admin/SupabaseAdminLogin";
import AdminPasswordSync from "@/components/admin/AdminPasswordSync";
import LoadingSpinner from "@/components/LoadingSpinner";

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

  console.log('BuddysAdminContent: Story form state', { showStoryForm, editingStory });

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
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="/dashboard" element={<AdminOverview />} />
      <Route path="/stories" element={<AdminStories />} />
      <Route path="/comments" element={<CommentsDashboard />} />
      <Route path="/voice-preview" element={
        <AdminLayout>
          <VoicePreview />
        </AdminLayout>
      } />
    </Routes>
  );
};

// Authentication guard component
const AdminAuthGuard = () => {
  const { isAuthenticated, isLoading, isAdmin } = useSupabaseAdminAuth();

  console.log('🔐 AdminAuthGuard State:', { 
    isAuthenticated, 
    isLoading, 
    isAdmin,
    timestamp: new Date().toISOString()
  });

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show login form if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    console.log('🔐 Showing login form - user not authenticated or not admin');
    return <SupabaseAdminLogin />;
  }

  // User is authenticated and is admin - show admin content
  console.log('✅ User authenticated and is admin - showing admin content');
  return (
    <ContentProtection enableProtection={false}>
      <BuddysAdminContent />
    </ContentProtection>
  );
};

// Main admin component with authentication provider
const BuddysAdmin = () => {
  console.log('🔐 BuddysAdmin: Component rendering with auth provider');
  
  // Check if this is the password sync route
  if (window.location.pathname === '/buddys_admin/password-sync') {
    return <AdminPasswordSync />;
  }
  
  return (
    <SupabaseAdminAuthProvider>
      <AdminAuthGuard />
    </SupabaseAdminAuthProvider>
  );
};

export default BuddysAdmin;
