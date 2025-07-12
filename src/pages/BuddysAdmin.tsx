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

// Robust authentication guard with race condition prevention
const AdminAuthGuard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let checkInProgress = false;

    console.log('🔐 Admin guard initializing...');

    const verifyAdminAccess = async (session: any): Promise<boolean> => {
      if (!session?.user) {
        console.log('❌ No user in session');
        return false;
      }

      try {
        console.log('🔐 Verifying admin access for:', session.user.email);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('❌ Profile fetch error:', error);
          return false;
        }

        if (profile?.role !== 'admin') {
          console.log('❌ User is not admin:', profile?.role);
          return false;
        }

        console.log('✅ Admin access verified');
        return true;
      } catch (error) {
        console.error('❌ Admin verification failed:', error);
        return false;
      }
    };

    const updateAuthState = async (session: any) => {
      if (checkInProgress || !mounted) return;
      checkInProgress = true;

      try {
        if (!session?.user) {
          console.log('🔓 No session - showing login');
          if (mounted) {
            setUser(null);
            setIsAuthenticated(false);
            setAuthError(null);
            setIsLoading(false);
          }
          return;
        }

        const isAdmin = await verifyAdminAccess(session);
        
        if (!mounted) return;

        if (isAdmin) {
          console.log('✅ Authentication successful');
          setUser(session.user);
          setIsAuthenticated(true);
          setAuthError(null);
        } else {
          console.log('❌ Authentication failed - not admin');
          setUser(null);
          setIsAuthenticated(false);
          setAuthError('Admin access required');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Auth state update error:', error);
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
          setAuthError('Authentication failed');
          setIsLoading(false);
        }
      } finally {
        checkInProgress = false;
      }
    };

    // Initial session check
    const initializeAuth = async () => {
      try {
        console.log('🔐 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session error:', error);
          if (mounted) {
            setAuthError('Failed to get session');
            setIsLoading(false);
          }
          return;
        }

        await updateAuthState(session);
      } catch (error) {
        console.error('❌ Initialize auth error:', error);
        if (mounted) {
          setAuthError('Authentication initialization failed');
          setIsLoading(false);
        }
      }
    };

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event);
        
        if (!mounted) return;

        // Handle logout immediately
        if (event === 'SIGNED_OUT') {
          console.log('🔓 User signed out');
          setUser(null);
          setIsAuthenticated(false);
          setAuthError(null);
          setIsLoading(false);
          return;
        }

        // Handle sign in and token refresh
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await updateAuthState(session);
        }
      }
    );

    initializeAuth();

    return () => {
      console.log('🔐 Cleaning up auth guard');
      mounted = false;
      subscription.unsubscribe();
    };
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
      setIsAuthenticated(false);
      setAuthError(null);
      
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

  if (!isAuthenticated || authError) {
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