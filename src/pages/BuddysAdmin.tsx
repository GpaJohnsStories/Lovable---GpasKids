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
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('🔐 Admin guard starting...');
    
    // Check session and listen for changes
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔐 Session check:', !!session);
        
        if (session?.user) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          console.log('🔐 Profile check:', profile);
          
          if (profile?.role === 'admin') {
            console.log('✅ Admin access granted');
            setUser(session.user);
            setShowLogin(false);
          } else {
            console.log('❌ Not admin');
            setUser(null);
            setShowLogin(true);
          }
        } else {
          console.log('❌ No session');
          setUser(null);
          setShowLogin(true);
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        setUser(null);
        setShowLogin(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event, !!session);
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log('🔓 Signed out - requiring login');
          setUser(null);
          setShowLogin(true);
          setIsLoading(false);
        } else if (session?.user) {
          console.log('🔐 Signed in - checking admin role');
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profile?.role === 'admin') {
            console.log('✅ Admin role confirmed');
            setUser(session.user);
            setShowLogin(false);
          } else {
            console.log('❌ Not admin role');
            setUser(null);
            setShowLogin(true);
          }
          setIsLoading(false);
        }
      }
    );

    checkAuth();
    
    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    console.log('🔐 Login success callback');
    // The auth state change listener will handle the rest
  };

  const handleLogout = async () => {
    console.log('🔓 Logout initiated');
    setIsLoading(true);
    
    try {
      // Clear state immediately
      setUser(null);
      setShowLogin(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Logout error:', error);
      } else {
        console.log('✅ Supabase logout successful');
      }
      
      // Clear storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to home
      window.location.href = '/';
      
    } catch (error) {
      console.error('💥 Logout exception:', error);
      // Force redirect anyway
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