import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminStories from "@/components/admin/AdminStories";
import AdminStoryForm from "@/components/admin/AdminStoryForm";
import CommentsDashboard from "@/components/admin/CommentsDashboard";
import StaticDeploymentSystem from "@/components/admin/StaticDeploymentSystem";
import VoicePreview from "@/components/VoicePreview";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentProtection from "@/components/ContentProtection";
import { useAdminSession } from "@/hooks/useAdminSession";
import { Routes, Route, Navigate } from "react-router-dom";
import SimpleAdminLogin from "@/components/admin/SimpleAdminLogin";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { User } from '@supabase/supabase-js';

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

// SIMPLIFIED authentication - remove complex state management
const AdminAuthGuard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    console.log('🔐 Admin guard starting...');
    
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('🔐 Found existing session, checking admin role...');
          
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profile?.role === 'admin') {
            console.log('✅ User is admin, allowing access');
            setShowLogin(false);
          } else {
            console.log('❌ User is not admin');
            setShowLogin(true);
          }
        } else {
          console.log('❌ No session found');
          setShowLogin(true);
        }
      } catch (error) {
        console.error('❌ Session check error:', error);
        setShowLogin(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const handleLoginSuccess = () => {
    console.log('Login success!');
    setShowLogin(false);
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear any local storage items
      localStorage.clear();
      sessionStorage.clear();
      
      // Force a complete page reload to ensure everything is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, force reload to clear everything
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (showLogin) {
    return <SimpleAdminLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <ContentProtection enableProtection={false}>
      <div className="relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
        <BuddysAdminContent />
      </div>
    </ContentProtection>
  );
};

// Main admin component
const BuddysAdmin = () => {
  console.log('🔐 BuddysAdmin: Starting...');
  return <AdminAuthGuard />;
};

export default BuddysAdmin;