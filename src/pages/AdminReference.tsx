import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import IconLibraryDisplay from '@/components/admin/IconLibraryDisplay';
import IconUploadForm from '@/components/admin/IconUploadForm';
import PreferredColorsTable from '@/components/admin/PreferredColorsTable';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const SCROLL_STORAGE_KEY = 'admin-reference-scroll-position';

const AdminReference = () => {
  const { userRole, isLoading } = useUserRole();
  const queryClient = useQueryClient();

  // Disable React Query refetch on window focus to prevent re-renders that reset scroll
  useEffect(() => {
    const originalRefetchOnWindowFocus = queryClient.getDefaultOptions().queries?.refetchOnWindowFocus;
    
    queryClient.setDefaultOptions({
      queries: {
        refetchOnWindowFocus: false,
      },
    });

    return () => {
      queryClient.setDefaultOptions({
        queries: {
          refetchOnWindowFocus: originalRefetchOnWindowFocus,
        },
      });
    };
  }, [queryClient]);

  // Preserve and restore scroll position using sessionStorage
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem(SCROLL_STORAGE_KEY, window.scrollY.toString());
    };

    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem(SCROLL_STORAGE_KEY);
      if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          window.scrollTo(0, position);
        });
      }
    };

    // Restore scroll position when component mounts
    restoreScrollPosition();

    // Save scroll position on various events
    const saveOnScroll = () => saveScrollPosition();
    const saveOnVisibilityChange = () => {
      if (document.hidden) {
        saveScrollPosition();
      }
    };
    const saveOnBeforeUnload = () => saveScrollPosition();

    window.addEventListener('scroll', saveOnScroll, { passive: true });
    window.addEventListener('beforeunload', saveOnBeforeUnload);
    document.addEventListener('visibilitychange', saveOnVisibilityChange);

    return () => {
      window.removeEventListener('scroll', saveOnScroll);
      window.removeEventListener('beforeunload', saveOnBeforeUnload);
      document.removeEventListener('visibilitychange', saveOnVisibilityChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-muted rounded h-64 w-full"></div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <>
        <Helmet>
          <title>Access Denied - Admin Reference</title>
        </Helmet>
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Admin access required to view reference materials.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Reference - Icons & Resources</title>
        <meta name="description" content="Admin reference materials including icon library" />
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Admin Reference
          </h1>
          <p className="text-muted-foreground">
            Reference materials and resources for administration
          </p>
        </div>

        <PreferredColorsTable />
        
        <IconUploadForm />
        
        <IconLibraryDisplay />
      </div>
    </>
  );
};

export default AdminReference;