
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

// Simple but effective authentication guard
const AdminAuthGuard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  console.log('🔐 AdminAuthGuard: Current state:', { isLoading, isAuthenticated, isAdmin });

  useEffect(() => {
    console.log('🔄 Starting auth check...');
    
    const checkAuthAndAdmin = async () => {
      try {
        // Check current session WITHOUT forcing logout
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📋 Session check:', session?.user?.email || 'No session');
        
        if (session?.user) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          console.log('👤 Profile check:', profile);
          
          if (profile?.role === 'admin') {
            console.log('✅ Admin access granted');
            setUser(session.user);
            setIsAuthenticated(true);
            setIsAdmin(true);
          } else {
            console.log('❌ Not admin - require login');
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        } else {
          console.log('❌ No session - require login');
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('💥 Auth check error:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndAdmin();

    // Set up auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event);
        
        if (session?.user) {
          // Check admin role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profile?.role === 'admin') {
            setUser(session.user);
            setIsAuthenticated(true);
            setIsAdmin(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    console.log('✅ Login success callback triggered');
    // The auth state change listener will handle the state update
  };

  console.log('🔐 Current auth state:', { isLoading, isAuthenticated, isAdmin, userEmail: user?.email });

  if (isLoading) {
    console.log('⏳ Showing loading spinner');
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    console.log('🔐 Showing login form - not authenticated or not admin');
    return <SimpleAdminLogin onSuccess={handleLoginSuccess} />;
  }

  console.log('✅ Showing admin content');
  return (
    <ContentProtection enableProtection={false}>
      <div className="relative">
        <button
          onClick={async () => {
            console.log('🚪 Manual logout clicked');
            await supabase.auth.signOut();
          }}
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
