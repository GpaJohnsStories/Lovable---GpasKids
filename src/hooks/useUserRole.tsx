import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'viewer' | 'user' | null;

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkUserRole = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          if (isMounted) {
            setUserRole(null);
            setIsLoading(false);
          }
          return;
        }

        // Check if user is admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
        if (!adminError && isAdmin) {
          if (isMounted) {
            setUserRole('admin');
            setIsLoading(false);
          }
          return;
        }

        // Check if user is viewer
        const { data: isViewer, error: viewerError } = await supabase.rpc('is_viewer');
        if (!viewerError && isViewer) {
          if (isMounted) {
            setUserRole('viewer');
            setIsLoading(false);
          }
          return;
        }

        // Default to user role
        if (isMounted) {
          setUserRole('user');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        if (isMounted) {
          setUserRole(null);
          setIsLoading(false);
        }
      }
    };

    // Initial role check
    checkUserRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (isMounted && (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED')) {
        setTimeout(() => {
          if (isMounted) {
            checkUserRole();
          }
        }, 100);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = userRole === 'admin';
  const isViewer = userRole === 'viewer';
  const hasAdminAccess = isAdmin || isViewer;

  return {
    userRole,
    isAdmin,
    isViewer,
    hasAdminAccess,
    isLoading
  };
};