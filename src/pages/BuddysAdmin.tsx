
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
      <Route path="/" element={<Navigate to="dashboard" replace />} />
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

// Simple authentication guard component
const AdminAuthGuard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log('🔐 AdminAuthGuard: Component mounted, current state:', { 
    user: user?.email, 
    isLoading, 
    isAuthenticated 
  });

  useEffect(() => {
    console.log('🔄 Setting up auth listener...');
    
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📋 Initial session check:', session?.user?.email);
      
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        setIsLoading(false);
      }
    );

    checkSession();

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = () => {
    console.log('✅ Login success, showing admin content');
    // The auth state change listener will handle the state update
  };

  const handleLogout = async () => {
    console.log('🚪 Logging out...');
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
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
  console.log('🔐 BuddysAdmin: Component rendering');
  
  return <AdminAuthGuard />;
};

export default BuddysAdmin;
