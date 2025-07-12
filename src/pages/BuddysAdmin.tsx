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
import { Button } from "@/components/ui/button";
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

// Main admin component with simplified authentication
const BuddysAdmin = () => {
  // Start unauthenticated - only authenticate after proper verification
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  console.log('BuddysAdmin: Starting, isAuthenticated:', isAuthenticated);

  // Verify admin access with timeout and proper error handling
  const verifyAdminAccess = async (session: any): Promise<boolean> => {
    console.log('BuddysAdmin: Verifying admin access for session:', !!session);
    
    if (!session?.user?.id) {
      console.log('BuddysAdmin: No valid session or user ID');
      return false;
    }
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Admin verification timeout')), 10000)
      );
      
      const verificationPromise = supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      const { data: profile, error } = await Promise.race([verificationPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('BuddysAdmin: Error fetching profile:', error);
        return false;
      }
      
      const isAdmin = profile?.role === 'admin';
      console.log('BuddysAdmin: Admin verification result:', isAdmin);
      return isAdmin;
    } catch (error) {
      console.error('BuddysAdmin: Error in verifyAdminAccess:', error);
      return false;
    }
  };

  // Clear authentication state immediately if verification fails
  const clearAuthState = () => {
    console.log('BuddysAdmin: Clearing auth state');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Simplified authentication using only auth state listener
  useEffect(() => {
    console.log('BuddysAdmin: Setting up auth listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('BuddysAdmin: Auth state changed:', event, !!session);
        
        if (event === 'SIGNED_OUT' || !session) {
          clearAuthState();
          setIsLoading(false);
          return;
        }
        
        // For any session, verify admin access
        if (session) {
          try {
            const isAdmin = await verifyAdminAccess(session);
            if (isAdmin) {
              console.log('BuddysAdmin: Admin access verified, setting authenticated');
              setIsAuthenticated(true);
              setUser(session.user);
            } else {
              console.log('BuddysAdmin: Admin access denied, clearing auth');
              clearAuthState();
              // Force logout if not admin
              await supabase.auth.signOut();
            }
          } catch (error) {
            console.error('BuddysAdmin: Error during admin verification:', error);
            clearAuthState();
          }
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('BuddysAdmin: Error getting initial session:', error);
        setIsLoading(false);
        return;
      }
      
      // Trigger auth state change manually for existing session
      if (session) {
        console.log('BuddysAdmin: Found existing session, verifying admin access');
        verifyAdminAccess(session).then(isAdmin => {
          if (isAdmin) {
            setIsAuthenticated(true);
            setUser(session.user);
          } else {
            clearAuthState();
            supabase.auth.signOut();
          }
          setIsLoading(false);
        }).catch(error => {
          console.error('BuddysAdmin: Error verifying existing session:', error);
          clearAuthState();
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      console.log('BuddysAdmin: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = () => {
    console.log("BuddysAdmin: Login successful, auth listener will handle state update");
  };

  const handleLogout = async () => {
    console.log('BuddysAdmin: Initiating logout');
    try {
      // Clear local state immediately
      clearAuthState();
      
      // Sign out from Supabase (let it handle its own cleanup)
      await supabase.auth.signOut();
      
      // Small delay to ensure cleanup completes
      setTimeout(() => {
        // Redirect to Google search as requested
        window.location.href = 'https://www.google.com';
      }, 100);
    } catch (error) {
      console.error('BuddysAdmin: Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = 'https://www.google.com';
    }
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
        <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, {user?.email}
          </span>
          <Button
            onClick={handleLogout}
            variant="destructive"
            size="sm"
          >
            Logout
          </Button>
        </div>
        <BuddysAdminContent />
      </div>
    </ContentProtection>
  );
};

export default BuddysAdmin;